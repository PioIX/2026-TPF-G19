"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";
import Navbar from "@/components/Navbar";
import useUsuario from "@/hooks/useUsuario";
import useSocket from "@/hooks/useSocket";
import { api, API_URL } from "@/lib/api";

export default function RankingPage() {
  const usuario = useUsuario();
  const { socket, isConnected } = useSocket({ serverUrl: API_URL });
  const [ranking, setRanking] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [aviso, setAviso] = useState("");
  const [version, setVersion] = useState(0);

   useEffect(() => {
    if (!usuario) return;
    api("/ranking")
      .then((data) => setRanking(data))
      .catch(() => {});
    api("/historial")
      .then((data) => setHistorial(data))
      .catch(() => {});
  }, [usuario, version]);