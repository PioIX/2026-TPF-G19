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

// Qué tan probable es que cada posición haga un gol
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