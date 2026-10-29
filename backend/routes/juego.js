import { Router } from "express";
import { query } from "../modulos/mysql.js";
import { identificarUsuario } from "../modulos/auth.js";
import { FORMACION, FASES, simularPartido, calcularPuntaje } from "../modulos/simulacion.js";

const router = Router();

// Jugadores que el usuario ya eligió en una partida
async function equipoDePartida(partidaId) {
  return await query(
    `SELECT PartidaJugadores.numero, PartidaJugadores.posicion, PartidaJugadores.goles,
            PlantillaJugadores.id AS plantilla_jugador_id, PlantillaJugadores.jugador_id,
            PlantillaJugadores.valoracion, Jugadores.nombre
     FROM PartidaJugadores
     JOIN PlantillaJugadores ON PlantillaJugadores.id = PartidaJugadores.plantilla_jugador_id
     JOIN Jugadores ON Jugadores.id = PlantillaJugadores.jugador_id
     WHERE PartidaJugadores.partida_id = ?
     ORDER BY PartidaJugadores.numero`,
    [partidaId]
  );
}

// Sortea una plantilla que tenga al menos un jugador útil para los puestos que faltan
async function sortear(partidaId) {
  const equipo = await equipoDePartida(partidaId);
  const puestosOcupados = equipo.map((elegido) => elegido.numero);
  const jugadoresUsados = equipo.map((elegido) => elegido.jugador_id);
  const posicionesLibres = FORMACION.filter((puesto) => !puestosOcupados.includes(puesto.numero)).map(
    (puesto) => puesto.posicion
  );

  // Si ya están los 11 puestos, no hay más sorteos
  if (posicionesLibres.length === 0) {
    await query("UPDATE Partidas SET plantilla_sorteada_id = NULL WHERE id = ?", [partidaId]);
    return;
  }

  const plantillas = await query("SELECT id FROM Plantillas");
  while (plantillas.length > 0) {
    const posicion = Math.floor(Math.random() * plantillas.length);
    const plantilla = plantillas.splice(posicion, 1)[0];

    const jugadores = await query(
      "SELECT jugador_id, posicion FROM PlantillaJugadores WHERE plantilla_id = ?",
      [plantilla.id]
    );
    const sirve = jugadores.some(
      (jugador) => posicionesLibres.includes(jugador.posicion) && !jugadoresUsados.includes(jugador.jugador_id)
    );

    if (sirve) {
      await query("UPDATE Partidas SET plantilla_sorteada_id = ? WHERE id = ?", [plantilla.id, partidaId]);
      return;
    }
  }
}

// Arma todo lo que necesita el frontend para dibujar la partida
async function armarEstado(partidaId) {
  const filas = await query(
    `SELECT Partidas.id, Partidas.estado, Partidas.plantilla_sorteada_id,
            Selecciones.nombre AS seleccion, Selecciones.escudo_url, Mundiales.anio
     FROM Partidas
     LEFT JOIN Plantillas ON Plantillas.id = Partidas.plantilla_sorteada_id
     LEFT JOIN Selecciones ON Selecciones.id = Plantillas.seleccion_id
     LEFT JOIN Mundiales ON Mundiales.id = Plantillas.mundial_id
     WHERE Partidas.id = ?`,
    [partidaId]
  );
  const partida = filas[0];
  const equipo = await equipoDePartida(partidaId);

  let sorteo = [];
  if (partida.plantilla_sorteada_id) {
    const jugadores = await query(
      `SELECT PlantillaJugadores.id, PlantillaJugadores.jugador_id, PlantillaJugadores.posicion,
              PlantillaJugadores.valoracion, Jugadores.nombre
       FROM PlantillaJugadores
       JOIN Jugadores ON Jugadores.id = PlantillaJugadores.jugador_id
       WHERE PlantillaJugadores.plantilla_id = ?
       ORDER BY FIELD(PlantillaJugadores.posicion, 'POR', 'DEF', 'MED', 'DEL'), PlantillaJugadores.valoracion DESC`,
      [partida.plantilla_sorteada_id]
    );

    const jugadoresUsados = equipo.map((elegido) => elegido.jugador_id);
    const posicionesLibres = FORMACION.filter(
      (puesto) => !equipo.some((elegido) => elegido.numero === puesto.numero)
    ).map((puesto) => puesto.posicion);

    // elegible = se puede elegir (hay un puesto libre en su posición y no lo elegimos antes)
    sorteo = jugadores.map((jugador) => ({
      ...jugador,
      elegible: posicionesLibres.includes(jugador.posicion) && !jugadoresUsados.includes(jugador.jugador_id),
    }));
  }

  return { partida, formacion: FORMACION, equipo, sorteo };
}

// Partida en curso del usuario (si tiene una)
router.get("/partidas/actual", identificarUsuario, async (req, res) => {
  try {
    const filas = await query(
      "SELECT id FROM Partidas WHERE usuario_id = ? AND estado = 'en_curso' ORDER BY id DESC LIMIT 1",
      [req.usuario.id]
    );
    if (filas.length === 0) {
      return res.json({ partida: null });
    }
    res.json(await armarEstado(filas[0].id));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error del servidor" });
  }
});

// Nueva partida: abandona la anterior y hace el primer sorteo
router.post("/partidas", identificarUsuario, async (req, res) => {
  try {
    await query(
      "UPDATE Partidas SET estado = 'abandonada', fecha_fin = NOW() WHERE usuario_id = ? AND estado = 'en_curso'",
      [req.usuario.id]
    );
    const resultado = await query(
      "INSERT INTO Partidas (usuario_id, estado, fecha_creacion) VALUES (?, 'en_curso', NOW())",
      [req.usuario.id]
    );
    await sortear(resultado.insertId);
    res.status(201).json(await armarEstado(resultado.insertId));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error del servidor" });
  }
});

// Elegir un jugador del sorteo para un puesto de la formación
router.post("/partidas/:id/elegir", identificarUsuario, async (req, res) => {
  try {
    const partidaId = Number(req.params.id);
    const plantillaJugadorId = req.body.plantilla_jugador_id;
    const numeroPuesto = Number(req.body.numero);

    const partidas = await query(
      "SELECT * FROM Partidas WHERE id = ? AND usuario_id = ? AND estado = 'en_curso'",
      [partidaId, req.usuario.id]
    );
    if (partidas.length === 0) {
      return res.status(404).json({ error: "Partida no encontrada" });
    }

    // El jugador tiene que ser de la plantilla sorteada
    const jugadores = await query("SELECT * FROM PlantillaJugadores WHERE id = ? AND plantilla_id = ?", [
      plantillaJugadorId,
      partidas[0].plantilla_sorteada_id,
    ]);
    if (jugadores.length === 0) {
      return res.status(400).json({ error: "Ese jugador no está en el sorteo" });
    }
    const jugador = jugadores[0];

    const puesto = FORMACION.find((item) => item.numero === numeroPuesto);
    if (!puesto) {
      return res.status(400).json({ error: "Puesto inválido" });
    }
    if (puesto.posicion !== jugador.posicion) {
      return res.status(400).json({ error: "Ese jugador no juega en ese puesto" });
    }

    const equipo = await equipoDePartida(partidaId);
    if (equipo.some((elegido) => elegido.numero === puesto.numero)) {
      return res.status(409).json({ error: "Ese puesto ya está ocupado" });
    }
    if (equipo.some((elegido) => elegido.jugador_id === jugador.jugador_id)) {
      return res.status(409).json({ error: "Ese jugador ya está en tu equipo" });
    }

    await query(
      "INSERT INTO PartidaJugadores (partida_id, plantilla_jugador_id, numero, posicion) VALUES (?, ?, ?, ?)",
      [partidaId, jugador.id, puesto.numero, puesto.posicion]
    );
    await sortear(partidaId);
    res.json(await armarEstado(partidaId));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error del servidor" });
  }
});

// Simula el torneo completo (octavos a final) y guarda el puntaje
router.post("/partidas/:id/simular", identificarUsuario, async (req, res) => {
  try {
    const partidaId = Number(req.params.id);
    const partidas = await query(
      "SELECT id FROM Partidas WHERE id = ? AND usuario_id = ? AND estado = 'en_curso'",
      [partidaId, req.usuario.id]
    );
    if (partidas.length === 0) {
      return res.status(404).json({ error: "Partida no encontrada" });
    }

    const equipo = await equipoDePartida(partidaId);
    if (equipo.length < FORMACION.length) {
      return res.status(400).json({ error: "Tenés que completar los 11 puestos" });
    }

    // Todas las plantillas con sus jugadores: de acá salen los rivales
    const plantillas = await query(
      `SELECT Plantillas.id, Selecciones.nombre AS seleccion, Mundiales.anio
       FROM Plantillas
       JOIN Selecciones ON Selecciones.id = Plantillas.seleccion_id
       JOIN Mundiales ON Mundiales.id = Plantillas.mundial_id`
    );
    const todosLosJugadores = await query(
      `SELECT PlantillaJugadores.plantilla_id, PlantillaJugadores.posicion,
              PlantillaJugadores.valoracion, Jugadores.nombre
       FROM PlantillaJugadores
       JOIN Jugadores ON Jugadores.id = PlantillaJugadores.jugador_id`
    );
    const jugadoresPorPlantilla = {};
    todosLosJugadores.forEach((jugador) => {
      if (!jugadoresPorPlantilla[jugador.plantilla_id]) {
        jugadoresPorPlantilla[jugador.plantilla_id] = [];
      }
      jugadoresPorPlantilla[jugador.plantilla_id].push(jugador);
    });
    const posiblesRivales = plantillas.filter((plantilla) => (jugadoresPorPlantilla[plantilla.id] || []).length >= 11);

    // Una ronda por fase; si perdemos, el torneo termina
    const rondas = [];
    const golesPorJugador = {};
    for (const fase of FASES) {
      const posicion = Math.floor(Math.random() * posiblesRivales.length);
      const rival = posiblesRivales.splice(posicion, 1)[0];
      const partido = simularPartido(equipo, jugadoresPorPlantilla[rival.id]);

      partido.goleadoresFavor.forEach((goleador) => {
        const id = goleador.plantilla_jugador_id;
        golesPorJugador[id] = (golesPorJugador[id] || 0) + 1;
      });

      rondas.push({
        fase: fase,
        rival: { id: rival.id, seleccion: rival.seleccion, anio: rival.anio },
        golesFavor: partido.golesFavor,
        golesContra: partido.golesContra,
        penales: partido.penales,
        gana: partido.gana,
        goleadoresFavor: partido.goleadoresFavor.map((goleador) => goleador.nombre),
        goleadoresContra: partido.goleadoresContra.map((goleador) => goleador.nombre),
      });

      if (!partido.gana) break;
    }

    const ultimaRonda = rondas[rondas.length - 1];
    const campeon = rondas.length === FASES.length && ultimaRonda.gana;
    const faseFinal = campeon ? "Campeón" : ultimaRonda.fase;
    const puntaje = calcularPuntaje(rondas);

    // Guardamos los goles de cada jugador y cerramos la partida
    for (const plantillaJugadorId of Object.keys(golesPorJugador)) {
      await query(
        "UPDATE PartidaJugadores SET goles = ? WHERE partida_id = ? AND plantilla_jugador_id = ?",
        [golesPorJugador[plantillaJugadorId], partidaId, plantillaJugadorId]
      );
    }
    await query(
      `UPDATE Partidas SET estado = 'finalizada', rival_plantilla_id = ?, fase = ?,
       goles_favor = ?, goles_contra = ?, puntaje = ?, fecha_fin = NOW() WHERE id = ?`,
      [ultimaRonda.rival.id, faseFinal, ultimaRonda.golesFavor, ultimaRonda.golesContra, puntaje, partidaId]
    );

    // WebSocket: le avisa a todos los conectados que el ranking cambió
    req.app.get("io").emit("ranking:actualizado", {
      nombre: req.usuario.nombre,
      puntaje: puntaje,
      fase: faseFinal,
    });

    res.json({ rondas, puntaje, fase: faseFinal, campeon });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error del servidor" });
  }
});

router.post("/partidas/:id/abandonar", identificarUsuario, async (req, res) => {
  try {
    await query(
      "UPDATE Partidas SET estado = 'abandonada', fecha_fin = NOW() WHERE id = ? AND usuario_id = ? AND estado = 'en_curso'",
      [Number(req.params.id), req.usuario.id]
    );
    res.json({ mensaje: "Partida abandonada" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error del servidor" });
  }
});

router.get("/ranking", identificarUsuario, async (req, res) => {
  try {
    const filas = await query(
      `SELECT Partidas.id, Usuarios.nombre, Partidas.puntaje, Partidas.fase, Partidas.fecha_fin
       FROM Partidas
       JOIN Usuarios ON Usuarios.id = Partidas.usuario_id
       WHERE Partidas.estado = 'finalizada'
       ORDER BY Partidas.puntaje DESC, Partidas.fecha_fin ASC
       LIMIT 10`
    );
    res.json(filas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error del servidor" });
  }
});

router.get("/historial", identificarUsuario, async (req, res) => {
  try {
    const filas = await query(
      `SELECT Partidas.id, Partidas.puntaje, Partidas.fase, Partidas.goles_favor, Partidas.goles_contra,
              Partidas.fecha_fin, Selecciones.nombre AS rival, Mundiales.anio AS rival_anio
       FROM Partidas
       LEFT JOIN Plantillas ON Plantillas.id = Partidas.rival_plantilla_id
       LEFT JOIN Selecciones ON Selecciones.id = Plantillas.seleccion_id
       LEFT JOIN Mundiales ON Mundiales.id = Plantillas.mundial_id
       WHERE Partidas.usuario_id = ? AND Partidas.estado = 'finalizada'
       ORDER BY Partidas.fecha_fin DESC
       LIMIT 20`,
      [req.usuario.id]
    );
    res.json(filas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error del servidor" });
  }
});

export default router;