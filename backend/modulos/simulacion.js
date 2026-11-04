export const FORMACION = [
  { numero: 1, etiqueta: "ARQ", posicion: "POR", x: 50, y: 88 },
  { numero: 2, etiqueta: "LI", posicion: "DEF", x: 12, y: 68 },
  { numero: 3, etiqueta: "DEF", posicion: "DEF", x: 37, y: 72 },
  { numero: 4, etiqueta: "DEF", posicion: "DEF", x: 63, y: 72 },
  { numero: 5, etiqueta: "LD", posicion: "DEF", x: 88, y: 68 },
  { numero: 6, etiqueta: "MED", posicion: "MED", x: 28, y: 50 },
  { numero: 7, etiqueta: "MED", posicion: "MED", x: 72, y: 50 },
  { numero: 8, etiqueta: "MCO", posicion: "MED", x: 50, y: 36 },
  { numero: 9, etiqueta: "EI", posicion: "DEL", x: 15, y: 18 },
  { numero: 10, etiqueta: "DC", posicion: "DEL", x: 50, y: 10 },
  { numero: 11, etiqueta: "ED", posicion: "DEL", x: 85, y: 18 },
];

export const FASES = ["Octavos de Final", "Cuartos de Final", "Semifinal", "Final"];


const PESO_GOL = { DEL: 6, MED: 3, DEF: 1, POR: 0.05 };

function promedio(numeros) {
  if (numeros.length === 0) return 60;
  let suma = 0;
  numeros.forEach((numero) => {
    suma = suma + numero;
  });
  return suma / numeros.length;
}

function valoracionesDe(jugadores, posicion) {
  return jugadores.filter((jugador) => jugador.posicion === posicion).map((jugador) => jugador.valoracion);
}


function calcularFuerza(jugadores) {
  return {
    ataque: promedio(valoracionesDe(jugadores, "DEL")) * 0.6 + promedio(valoracionesDe(jugadores, "MED")) * 0.4,
    defensa: promedio(valoracionesDe(jugadores, "POR")) * 0.4 + promedio(valoracionesDe(jugadores, "DEF")) * 0.6,
  };
}


function golesAlAzar(promedioGoles) {
  const limite = Math.exp(-promedioGoles);
  let goles = 0;
  let azar = Math.random();
  while (azar > limite && goles < 8) {
    goles++;
    azar = azar * Math.random();
  }
  return goles;
}


function elegirGoleador(jugadores) {
  const pesos = jugadores.map((jugador) => PESO_GOL[jugador.posicion] * jugador.valoracion);
  let total = 0;
  pesos.forEach((peso) => {
    total = total + peso;
  });

  let azar = Math.random() * total;
  for (let i = 0; i < jugadores.length; i++) {
    azar = azar - pesos[i];
    if (azar <= 0) return jugadores[i];
  }
  return jugadores[jugadores.length - 1];
}


export function simularPartido(equipo, rival) {
  const fuerzaEquipo = calcularFuerza(equipo);
  const fuerzaRival = calcularFuerza(rival);

  const golesFavor = golesAlAzar(1.3 * Math.pow(fuerzaEquipo.ataque / fuerzaRival.defensa, 6));
  const golesContra = golesAlAzar(1.3 * Math.pow(fuerzaRival.ataque / fuerzaEquipo.defensa, 6));

  let gana = golesFavor > golesContra;
  const penales = golesFavor === golesContra;
  if (penales) {

    const diferencia = fuerzaEquipo.ataque + fuerzaEquipo.defensa - fuerzaRival.ataque - fuerzaRival.defensa;
    gana = Math.random() < 0.5 + diferencia / 400;
  }

  const goleadoresFavor = [];
  for (let i = 0; i < golesFavor; i++) {
    goleadoresFavor.push(elegirGoleador(equipo));
  }
  const goleadoresContra = [];
  for (let i = 0; i < golesContra; i++) {
    goleadoresContra.push(elegirGoleador(rival));
  }

  return { golesFavor, golesContra, penales, gana, goleadoresFavor, goleadoresContra };
}


export function calcularPuntaje(rondas) {
  let puntos = 0;
  rondas.forEach((ronda) => {
    if (ronda.gana) puntos = puntos + 100;
    puntos = puntos + ronda.golesFavor * 10 - ronda.golesContra * 5;
  });

  const ultimaRonda = rondas[rondas.length - 1];
  if (rondas.length === FASES.length && ultimaRonda.gana) puntos = puntos + 200;

  return Math.max(0, puntos);
}