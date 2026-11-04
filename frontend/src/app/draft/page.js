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