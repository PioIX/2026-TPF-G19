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