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