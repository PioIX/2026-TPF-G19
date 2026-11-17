"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import styles from "./page.module.css";
import Navbar from "@/components/Navbar";
import Button from "@/components/Button";
import Cancha from "@/components/Cancha";
import useUsuario from "@/hooks/useUsuario";
import { api } from "@/lib/api";

const POSICIONES_VISUALES = [
  ["1", 50, 86], ["2", 21, 68], ["3", 41, 72], ["4", 59, 72], ["5", 79, 68],
  ["6", 31, 47], ["7", 50, 53], ["8", 69, 47],
  ["9", 22, 24], ["10", 50, 18], ["11", 78, 24],
];

export default function DraftPage() {
  const usuario = useUsuario();
  const [estado, setEstado] = useState(null); 
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [jugadorElegido, setJugadorElegido] = useState(null);
  const [resultado, setResultado] = useState(null); 
  const [numeroRonda, setNumeroRonda] = useState(0); 

 
  useEffect(() => {
    if (!usuario) return;
    api("/partidas/actual")
      .then((data) => setEstado(data.partida ? data : null))
      .catch((e) => setError(e.message))
      .finally(() => setCargando(false));
  }, [usuario]);

   async function nuevaPartida() {
    setError("");
    setResultado(null);
    setNumeroRonda(0);
    setJugadorElegido(null);
    try {
      setEstado(await api("/partidas", "POST"));
    } catch (e) {
      setError(e.message);
    }
  }

  async function colocarJugador(numeroPuesto) {
    setError("");
    try {
      const data = await api(`/partidas/${estado.partida.id}/elegir`, "POST", {
        plantilla_jugador_id: jugadorElegido.id,
        numero: numeroPuesto,
      });
      setEstado(data);
      setJugadorElegido(null);
    } catch (e) {
      setError(e.message);
    }
  }

  async function simularTorneo() {
    setError("");
    try {
      const data = await api(`/partidas/${estado.partida.id}/simular`, "POST");
      setResultado(data);
      setNumeroRonda(0);
      setEstado(null);
    } catch (e) {
      setError(e.message);
    }
  }

   async function abandonar() {
    if (!confirm("¿Abandonar la partida actual?")) return;
    try {
      await api(`/partidas/${estado.partida.id}/abandonar`, "POST");
      setEstado(null);
      setJugadorElegido(null);
    } catch (e) {
      setError(e.message);
    }
  }

  if (!usuario || cargando) {
    return <div className={styles.cargando}>Cargando...</div>;
  }

  
  let puestosHabilitados = [];
  if (jugadorElegido) {
    puestosHabilitados = estado.formacion
      .filter(
        (puesto) =>
          puesto.posicion === jugadorElegido.posicion &&
          !estado.equipo.some((elegido) => elegido.numero === puesto.numero)
      )
      .map((puesto) => puesto.numero);
  }

  function renderContenido() {
    
    if (resultado) {
      const ronda = resultado.rondas[numeroRonda];
      const esUltimaRonda = numeroRonda === resultado.rondas.length - 1;

      return (
        <div className="tarjeta">
          <h2 className={styles.fase}>{ronda.fase}</h2>
          <div className={styles.marcador}>
            <div className={styles.lado}>
              <strong>Tu equipo</strong>
              <small>{ronda.goleadoresFavor.join(", ") || "Sin goles"}</small>
            </div>
            <div className={styles.goles}>
              {ronda.golesFavor} - {ronda.golesContra}
            </div>
            <div className={styles.lado}>
              <strong>
                {ronda.rival.seleccion} {ronda.rival.anio}
              </strong>
              <small>{ronda.goleadoresContra.join(", ") || "Sin goles"}</small>
            </div>
          </div>
          {ronda.penales && <p className={styles.centrado}>{ronda.gana ? "Ganaste" : "Perdiste"} por penales</p>}

          {!esUltimaRonda && <Button onClick={() => setNumeroRonda(numeroRonda + 1)}>Siguiente</Button>}

          {esUltimaRonda && (
            <div className={styles.final}>
              <h2>{resultado.campeon ? "¡Campeón del mundo!" : `Eliminado en ${ronda.fase}`}</h2>
              <p>Puntaje obtenido: {resultado.puntaje}</p>
              <div className={styles.acciones}>
                <Button onClick={nuevaPartida}>Jugar de nuevo</Button>
                <Link href="/ranking" className="btn secundario">
                  Ver ranking
                </Link>
                <Link href="/" className="btn secundario">
                  Volver al inicio
                </Link>
              </div>
            </div>
          )}
        </div>
      );
    }

     if (!estado) {
      return (
        <div className={styles.introDraft}>
          <div className={styles.introContenido}>
            <span className={styles.introEtiqueta}><span /> MODO CAMPAÑA · COPA DEL MUNDO</span>
            <h1 className={styles.introTitulo}>DRAFT <span>XI</span></h1>
            <p className={styles.introTexto}>Las leyendas están sobre la mesa. Elegí a tus 11, armá un equipo de ensueño y llevalo desde octavos hasta la gloria.</p>
            <div className={styles.pasos}>
              <span><b>01</b> Elegí tus jugadores</span>
              <span><b>02</b> Completá el 4-3-3</span>
              <span><b>03</b> Ganá el Mundial</span>
            </div>
            <Button onClick={nuevaPartida}>Empezar el draft <span aria-hidden="true"> →</span></Button>
          </div>
          <div className={styles.canchaIntro} aria-label="Formación táctica 4-3-3">
            <span className={styles.formacionTag}>FORMACIÓN <b>4—3—3</b></span>
            <div className={styles.miniCancha}>
              {POSICIONES_VISUALES.map(([numero, left, top]) => <i key={numero} style={{ left: `${left}%`, top: `${top}%` }}>{numero}</i>)}
            </div>
            <span className={styles.canchaPie}>TU EQUIPO. TU HISTORIA.</span>
          </div>
        </div>
      );
    }

 
    if (estado.equipo.length === estado.formacion.length) {
      return (
        <div className="tarjeta">
          <h2>Tu equipo está completo</h2>
          <Cancha formacion={estado.formacion} equipo={estado.equipo} onElegir={() => {}} />
          <div className={styles.acciones}>
            <Button onClick={simularTorneo}>Simular torneo</Button>
            <Button variante="secundario" onClick={abandonar}>
              Abandonar
            </Button>
          </div>
        </div>
      );
    }

     return (
      <div className={styles.columnas}>
        <div className="tarjeta">
          <h2>Sorteo</h2>
          <p className={styles.sorteo}>
            {estado.partida.seleccion} {estado.partida.anio}
          </p>
          <ul className={styles.lista}>
            {estado.sorteo.map((jugador) => (
              <li key={jugador.id}>
                <button
                  type="button"
                  disabled={!jugador.elegible}
                  onClick={() => setJugadorElegido(jugador)}
                  className={clsx(styles.jugador, {
                    [styles.elegido]: jugadorElegido && jugadorElegido.id === jugador.id,
                    [styles.noDisponible]: !jugador.elegible,
                  })}
                >
                  <span className={styles.posicion}>{jugador.posicion}</span>
                  {jugador.nombre} | {jugador.valoracion}
                </button>
              </li>
            ))}
          </ul>
          <p className={styles.ayuda}>
            {jugadorElegido
              ? `Elegiste a ${jugadorElegido.nombre}. Tocá un puesto ${jugadorElegido.posicion} resaltado en la cancha.`
              : "Elegí un jugador de la lista."}
          </p>
        </div>
        <div className="tarjeta">
          <h2>
            Alineación ({estado.equipo.length}/{estado.formacion.length})
          </h2>
          <Cancha
            formacion={estado.formacion}
            equipo={estado.equipo}
            habilitados={puestosHabilitados}
            onElegir={colocarJugador}
          />
          <Button variante="secundario" chico onClick={abandonar}>
            Abandonar partida
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar usuario={usuario} />
      <main className={styles.principal}>
        {error && <div className={styles.error}>{error}</div>}
        {renderContenido()}
      </main>
    </div>
  );
}
