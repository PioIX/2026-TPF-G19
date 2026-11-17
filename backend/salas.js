import { query } from "./modulos/mysql.js";
import { FORMACION, simularPartido } from "./modulos/simulacion.js";

const MAX_JUGADORES = 2;
const LETRAS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const ESPERA_RECONEXION_MS = 5 * 60 * 1000;

let salas = [];
let io = null;


function generarCodigo() {
  let codigo = "";
  let repetido = true;

  while (repetido) {
    codigo = "";
    for (let i = 0; i < 5; i++) {
      const indice = Math.floor(Math.random() * LETRAS.length);
      codigo += LETRAS[indice];
    }
    repetido = salas.some((sala) => sala.codigo === codigo);
  }
  return codigo;
}

function mezclar(lista) {
  for (let i = lista.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [lista[i], lista[j]] = [lista[j], lista[i]];
  }
  return lista;
}

function responder(cb, datos) {
  if (typeof cb === "function") cb(datos);
}

function fallo(cb, mensaje) {
  responder(cb, { error: mensaje });
}

function salaDeUsuario(usuarioId) {
  for (const sala of salas) {
    if (sala.jugadores.some((jugador) => jugador.id === usuarioId)) return sala;
  }
  return null;
}

function puestosLibres(jugador) {
  return FORMACION.filter((puesto) => !jugador.equipo.some((elegido) => elegido.numero === puesto.numero)).map(
    (puesto) => puesto.posicion
  );
}

function esElegible(jugador, item) {
  return (
    puestosLibres(jugador).some((posicion) => posicion === item.posicion) &&
    !jugador.equipo.some((elegido) => elegido.jugador_id === item.jugador_id)
  );
}

function pendiente(jugador) {
  return jugador.equipo.length < FORMACION.length && !jugador.sinOpciones;
}

function cerrarSala(sala) {
  clearTimeout(sala.limpieza);
  salas = salas.filter((item) => item.codigo !== sala.codigo);
}

function programarLimpieza(sala) {
  clearTimeout(sala.limpieza);
  if (sala.jugadores.some((jugador) => jugador.conectado)) return;
  sala.limpieza = setTimeout(() => {
    if (!sala.jugadores.some((jugador) => jugador.conectado)) cerrarSala(sala);
  }, ESPERA_RECONEXION_MS);
  if (sala.limpieza.unref) sala.limpieza.unref();
}


function vista(sala, usuarioId) {
  const yo = sala.jugadores.find((jugador) => jugador.id === usuarioId);
  return {
    codigo: sala.codigo,
    estado: sala.estado,
    anfitrionId: sala.anfitrionId,
    yoId: usuarioId,
    formacion: FORMACION,
    ronda: sala.ronda,
    jugadores: sala.jugadores.map((jugador) => ({
      id: jugador.id,
      nombre: jugador.nombre,
      conectado: jugador.conectado,
      cantidad: jugador.equipo.length,
      listo: jugador.eligio || !pendiente(jugador),
    })),
    equipo: yo ? yo.equipo : [],
    yaElegi: yo ? yo.eligio || !pendiente(yo) : false,
    sinOpciones: yo ? yo.sinOpciones && yo.equipo.length < FORMACION.length : false,
    sorteo:
      yo && yo.sorteo
        ? {
          seleccion: yo.sorteo.seleccion,
          anio: yo.sorteo.anio,
          jugadores: yo.sorteo.jugadores.map((item) => ({ ...item, elegible: esElegible(yo, item) })),
        }
        : null,
    resultado: sala.resultado,
  };
}

function emitir(sala) {
  for (const jugador of sala.jugadores) {
    if (jugador.socketId) io.to(jugador.socketId).emit("sala:estado", vista(sala, jugador.id));
  }
}


async function sortearRonda(sala) {
  const filas = await query(
    `SELECT PlantillaJugadores.id, PlantillaJugadores.plantilla_id, PlantillaJugadores.jugador_id,
            PlantillaJugadores.posicion, PlantillaJugadores.valoracion, Jugadores.nombre,
            Selecciones.nombre AS seleccion, Mundiales.anio
     FROM PlantillaJugadores
     JOIN Jugadores ON Jugadores.id = PlantillaJugadores.jugador_id
     JOIN Plantillas ON Plantillas.id = PlantillaJugadores.plantilla_id
     JOIN Selecciones ON Selecciones.id = Plantillas.seleccion_id
     JOIN Mundiales ON Mundiales.id = Plantillas.mundial_id
     ORDER BY FIELD(PlantillaJugadores.posicion, 'POR', 'DEF', 'MED', 'DEL'),
              PlantillaJugadores.valoracion DESC`
  );

  const porPlantilla = [];
  for (const fila of filas) {
    let plantilla = porPlantilla.find((item) => item.id === fila.plantilla_id);
    if (!plantilla) {
      plantilla = { id: fila.plantilla_id, seleccion: fila.seleccion, anio: fila.anio, jugadores: [] };
      porPlantilla.push(plantilla);
    }
    plantilla.jugadores.push({
      id: fila.id,
      jugador_id: fila.jugador_id,
      posicion: fila.posicion,
      valoracion: fila.valoracion,
      nombre: fila.nombre,
    });
  }

  const activos = sala.jugadores.filter((jugador) => jugador.equipo.length < FORMACION.length);
  const asignadas = [];
  let alguien = false;

  for (const jugador of mezclar([...sala.jugadores])) {
    jugador.sorteo = null;
    jugador.sinOpciones = false;
    if (!activos.some((activo) => activo === jugador)) {
      jugador.sinOpciones = true;
      continue;
    }

    const plantillasMezcladas = mezclar(porPlantilla.slice());
    const sirven = plantillasMezcladas.filter((plantilla) =>
      plantilla.jugadores.some((item) => esElegible(jugador, item))
    );
    let elegida = sirven.find((plantilla) => !asignadas.some((id) => id === plantilla.id));
    if (!elegida) elegida = sirven[0];

    if (!elegida) {
      jugador.sinOpciones = true;
      jugador.sorteo = porPlantilla.length > 0 ? armarSorteo(porPlantilla[0]) : null;
      continue;
    }
    asignadas.push(elegida.id);
    jugador.sorteo = armarSorteo(elegida);
    alguien = true;
  }
  if (!alguien) return false;

  sala.ronda += 1;
  for (const jugador of sala.jugadores) jugador.eligio = false;
  return true;
}

function armarSorteo(plantilla) {
  return {
    plantillaId: plantilla.id,
    seleccion: plantilla.seleccion,
    anio: plantilla.anio,
    jugadores: plantilla.jugadores,
  };
}

function terminar(sala) {
  const [a, b] = sala.jugadores;
  const partido = simularPartido(a.equipo, b.equipo);

  sala.estado = "fin";
  sala.sorteo = null;
  sala.resultado = {
    ganadorId: partido.gana ? a.id : b.id,
    penales: partido.penales,
    marcador: [
      { id: a.id, nombre: a.nombre, goles: partido.golesFavor, goleadores: partido.goleadoresFavor.map((g) => g.nombre) },
      { id: b.id, nombre: b.nombre, goles: partido.golesContra, goleadores: partido.goleadoresContra.map((g) => g.nombre) },
    ],
    equipos: { [a.id]: a.equipo, [b.id]: b.equipo },
  };
}

async function avanzar(sala) {
  if (sala.jugadores.every((jugador) => jugador.equipo.length === FORMACION.length)) {
    terminar(sala);
    return;
  }
  const ok = await sortearRonda(sala);
  if (!ok) {
    sala.estado = "fin";
    sala.sorteo = null;
    sala.resultado = { error: "No quedaron jugadores disponibles para seguir el sorteo." };
  }
}

function rondaCompleta(sala) {
  return sala.jugadores.every((jugador) => !pendiente(jugador) || jugador.eligio);
}

function reiniciarSala(sala) {
  sala.estado = "espera";
  sala.ronda = 0;
  sala.sorteo = null;
  sala.resultado = null;
  for (const jugador of sala.jugadores) {
    jugador.equipo = [];
    jugador.sorteo = null;
    jugador.eligio = false;
    jugador.sinOpciones = false;
  }
}

function quitarJugador(sala, usuarioId) {
  const saliente = sala.jugadores.find((jugador) => jugador.id === usuarioId);
  if (!saliente) return;
  sala.jugadores = sala.jugadores.filter((jugador) => jugador.id !== usuarioId);

  if (sala.jugadores.length === 0) {
    cerrarSala(sala);
    return;
  }
  if (sala.estado === "draft") {
    sala.estado = "fin";
    sala.sorteo = null;
    sala.resultado = { abandono: true, abandonoNombre: saliente.nombre, ganadorId: sala.jugadores[0].id };
  }
  if (sala.anfitrionId === usuarioId) sala.anfitrionId = sala.jugadores[0].id;
  emitir(sala);
}


export function registrarSalas(servidorIo) {
  io = servidorIo;

  io.on("connection", (socket) => {
    const usuario = socket.data.usuario;

    const salaPrevia = salaDeUsuario(usuario.id);
    if (salaPrevia) {
      const jugador = salaPrevia.jugadores.find((item) => item.id === usuario.id);
      jugador.socketId = socket.id;
      jugador.conectado = true;
      clearTimeout(salaPrevia.limpieza);
      emitir(salaPrevia);
    }

    socket.on("sala:crear", (datos, cb) => {
      const existente = salaDeUsuario(usuario.id);
      if (existente) {
        if (existente.estado !== "fin") return fallo(cb, `Ya estás en la sala ${existente.codigo}`);
        quitarJugador(existente, usuario.id);
      }

      const sala = {
        codigo: generarCodigo(),
        anfitrionId: usuario.id,
        estado: "espera",
        ronda: 0,
        sorteo: null,
        resultado: null,
        avanzando: false,
        limpieza: null,
        jugadores: [
          { id: usuario.id, nombre: usuario.nombre, socketId: socket.id, conectado: true, equipo: [], eligio: false, sinOpciones: false },
        ],
      };
      salas.push(sala);
      responder(cb, { sala: vista(sala, usuario.id) });
    });

    socket.on("sala:unirse", (datos, cb) => {
      const codigo = String(datos.codigo || "").trim().toUpperCase();
      const sala = salas.find((item) => item.codigo === codigo);

      if (!sala) return fallo(cb, "No existe una sala con ese código");
      const existente = salaDeUsuario(usuario.id);
      if (existente && existente !== sala) {
        if (existente.estado !== "fin") return fallo(cb, `Ya estás en la sala ${existente.codigo}`);
        quitarJugador(existente, usuario.id);
      }
      if (sala.jugadores.some((jugador) => jugador.id === usuario.id)) {
        return responder(cb, { sala: vista(sala, usuario.id) });
      }
      if (sala.estado !== "espera") return fallo(cb, "Esa partida ya empezó");
      if (sala.jugadores.length >= MAX_JUGADORES) return fallo(cb, "La sala está llena");

      sala.jugadores.push({
        id: usuario.id,
        nombre: usuario.nombre,
        socketId: socket.id,
        conectado: true,
        equipo: [],
        eligio: false,
        sinOpciones: false,
      });
      clearTimeout(sala.limpieza);
      emitir(sala);
      responder(cb, { sala: vista(sala, usuario.id) });
    });

    socket.on("sala:iniciar", async (datos, cb) => {
      try {
        const sala = salaDeUsuario(usuario.id);
        if (!sala) return fallo(cb, "No estás en ninguna sala");
        if (sala.anfitrionId !== usuario.id) return fallo(cb, "Solo el anfitrión puede iniciar la partida");
        if (sala.estado !== "espera") return fallo(cb, "La partida ya empezó");
        if (sala.jugadores.length < MAX_JUGADORES || sala.jugadores.some((jugador) => !jugador.conectado)) {
          return fallo(cb, "Tienen que estar los dos jugadores conectados");
        }

        reiniciarSala(sala);
        sala.estado = "draft";
        sala.avanzando = true;
        try {
          await avanzar(sala);
        } finally {
          sala.avanzando = false;
        }
        emitir(sala);
        responder(cb, { ok: true });
      } catch (err) {
        console.error(err);
        fallo(cb, "Error del servidor");
      }
    });

    socket.on("sala:elegir", async (datos, cb) => {
      try {
        const sala = salaDeUsuario(usuario.id);
        if (!sala || sala.estado !== "draft" || sala.avanzando) return fallo(cb, "No hay una ronda en curso");

        const yo = sala.jugadores.find((jugador) => jugador.id === usuario.id);
        if (yo.eligio || !pendiente(yo)) return fallo(cb, "Ya elegiste en esta ronda");

        const item = yo.sorteo && yo.sorteo.jugadores.find((jugador) => jugador.id === Number(datos.plantilla_jugador_id));
        if (!item) return fallo(cb, "Ese jugador no está en el sorteo");

        const puesto = FORMACION.find((p) => p.numero === Number(datos.numero));
        if (!puesto) return fallo(cb, "Puesto inválido");
        if (puesto.posicion !== item.posicion) return fallo(cb, "Ese jugador no juega en ese puesto");
        if (yo.equipo.some((elegido) => elegido.numero === puesto.numero)) return fallo(cb, "Ese puesto ya está ocupado");
        if (yo.equipo.some((elegido) => elegido.jugador_id === item.jugador_id)) {
          return fallo(cb, "Ese jugador ya está en tu equipo");
        }

        yo.equipo.push({
          numero: puesto.numero,
          posicion: puesto.posicion,
          goles: 0,
          plantilla_jugador_id: item.id,
          jugador_id: item.jugador_id,
          valoracion: item.valoracion,
          nombre: item.nombre,
        });
        yo.eligio = true;

        if (rondaCompleta(sala)) {
          sala.avanzando = true;
          try {
            await avanzar(sala);
          } finally {
            sala.avanzando = false;
          }
        }
        emitir(sala);
        responder(cb, { ok: true });
      } catch (err) {
        console.error(err);
        fallo(cb, "Error del servidor");
      }
    });

    socket.on("sala:volver", (datos, cb) => {
      const sala = salaDeUsuario(usuario.id);
      if (!sala) return fallo(cb, "No estás en ninguna sala");
      if (sala.estado === "fin") {
        reiniciarSala(sala);
        emitir(sala);
      }
      responder(cb, { ok: true });
    });

    socket.on("sala:salir", (datos, cb) => {
      const sala = salaDeUsuario(usuario.id);
      if (sala) quitarJugador(sala, usuario.id);
      responder(cb, { sala: null });
    });

    socket.on("disconnect", () => {
      const sala = salaDeUsuario(usuario.id);
      if (!sala) return;
      const jugador = sala.jugadores.find((item) => item.id === usuario.id);
      if (!jugador || jugador.socketId !== socket.id) return;
      jugador.conectado = false;
      jugador.socketId = null;
      emitir(sala);
      programarLimpieza(sala);
    });
  });
}