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