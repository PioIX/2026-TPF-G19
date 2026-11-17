export const FORMACION = [
  { numero: 1, posicion: "POR", etiqueta: "POR", x: 50, y: 90 },
  { numero: 2, posicion: "DEF", etiqueta: "LI", x: 14, y: 70 },
  { numero: 3, posicion: "DEF", etiqueta: "DFC", x: 38, y: 74 },
  { numero: 4, posicion: "DEF", etiqueta: "DFC", x: 62, y: 74 },
  { numero: 5, posicion: "DEF", etiqueta: "LD", x: 86, y: 70 },
  { numero: 6, posicion: "MED", etiqueta: "MI", x: 25, y: 50 },
  { numero: 7, posicion: "MED", etiqueta: "MC", x: 50, y: 54 },
  { numero: 8, posicion: "MED", etiqueta: "MD", x: 75, y: 50 },
  { numero: 9, posicion: "DEL", etiqueta: "EI", x: 20, y: 24 },
  { numero: 10, posicion: "DEL", etiqueta: "DC", x: 50, y: 18 },
  { numero: 11, posicion: "DEL", etiqueta: "ED", x: 80, y: 24 },
];

export const FASES = ["Octavos de final", "Cuartos de final", "Semifinal", "Final"];

const PESO_GOLEADOR = { POR: 0, DEF: 1, MED: 3, DEL: 6 };

function promedio(jugadores, posicion) {
  const lista = jugadores.filter((jugador) => jugador.posicion === posicion);
  if (lista.length === 0) return 70;
  let suma = 0;
  for (const jugador of lista) {
    suma += Number(jugador.valoracion);
  }
  return suma / lista.length;
}

function ataque(equipo) {
  return 0.5 * promedio(equipo, "DEL") + 0.3 * promedio(equipo, "MED") + 0.2 * promedio(equipo, "DEF");
}

function defensa(equipo) {
  return 0.35 * promedio(equipo, "POR") + 0.45 * promedio(equipo, "DEF") + 0.2 * promedio(equipo, "MED");
}

function golesEsperados(atacante, defensor) {
  return 1.35 * Math.exp((ataque(atacante) - defensa(defensor)) / 18);
}

function sortearGoles(esperados) {
  const limite = Math.exp(-esperados);
  let goles = 0;
  let producto = Math.random();
  while (producto > limite) {
    goles += 1;
    producto *= Math.random();
  }
  return goles;
}

function elegirGoleador(equipo) {
  const pesos = equipo.map((jugador) => (PESO_GOLEADOR[jugador.posicion] || 0) * Number(jugador.valoracion));
  let totalPesos = 0;
  for (const peso of pesos) {
    totalPesos += peso;
  }
  let sorteo = Math.random() * totalPesos;
  for (let i = 0; i < equipo.length; i++) {
    sorteo -= pesos[i];
    if (sorteo <= 0) return equipo[i];
  }
  return equipo[equipo.length - 1];
}

function promedioGeneral(equipo) {
  let suma = 0;
  for (const jugador of equipo) {
    suma += Number(jugador.valoracion);
  }
  return suma / equipo.length;
}

export function simularPartido(equipo, rival) {
  const golesFavor = sortearGoles(golesEsperados(equipo, rival));
  const golesContra = sortearGoles(golesEsperados(rival, equipo));

  const goleadoresFavor = [];
  for (let i = 0; i < golesFavor; i++) {
    const goleador = elegirGoleador(equipo);
    goleadoresFavor.push({ plantilla_jugador_id: goleador.plantilla_jugador_id, nombre: goleador.nombre });
  }
  const goleadoresContra = [];
  for (let i = 0; i < golesContra; i++) {
    goleadoresContra.push({ nombre: elegirGoleador(rival).nombre });
  }

  let gana = golesFavor > golesContra;
  let penales = false;
  if (golesFavor === golesContra) {
    penales = true;
    const ventaja = (promedioGeneral(equipo) - promedioGeneral(rival)) / 100;
    gana = Math.random() < Math.min(0.7, Math.max(0.3, 0.5 + ventaja));
  }

  return { golesFavor, golesContra, penales, gana, goleadoresFavor, goleadoresContra };
}

export function calcularPuntaje(rondas) {
  let puntaje = 0;
  rondas.forEach((ronda, indice) => {
    puntaje += ronda.golesFavor * 10;
    if (ronda.gana) puntaje += 100 * (indice + 1);
  });
  const campeon = rondas.length === FASES.length && rondas[rondas.length - 1].gana;
  if (campeon) puntaje += 100;
  return puntaje;
}
