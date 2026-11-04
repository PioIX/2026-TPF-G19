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