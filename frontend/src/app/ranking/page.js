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

   useEffect(() => {
    const alActualizar = (datos) => {
      setAviso(`${datos.nombre} sumó ${datos.puntaje} puntos (${datos.fase})`);
      setVersion((versionActual) => versionActual + 1);
    };
    socket.on("ranking:actualizado", alActualizar);
    return () => socket.off("ranking:actualizado", alActualizar);
  }, [socket]);

  if (!usuario) {
    return <div className={styles.cargando}>Cargando...</div>;
  }

  return (
    <div>
      <Navbar usuario={usuario} />
      <main className={styles.principal}>
        <h1 className={styles.titulo}>Mi perfil y estadísticas</h1>
        <p className={styles.estado}>{isConnected ? "🟢 Ranking en vivo" : "🔴 Sin conexión en vivo"}</p>
        {aviso && <p className={styles.aviso}>{aviso}</p>}

        <div className={styles.columnas}>
          <section className="tarjeta">
            <h2>Ranking global</h2>
            {ranking.length === 0 && <p>Todavía no hay partidas finalizadas.</p>}
            <ol className={styles.lista}>
              {ranking.map((fila) => (
                <li key={fila.id} className={fila.nombre === usuario.nombre ? styles.mio : ""}>
                  <span>{fila.nombre}</span>
                  <small>{fila.fase}</small>
                  <strong>{fila.puntaje}</strong>
                </li>
              ))}
            </ol>
          </section>

          <section className="tarjeta">
            <h2>Mi historial</h2>
            {historial.length === 0 && <p>Todavía no jugaste ninguna partida.</p>}
            <ol className={styles.lista}>
              {historial.map((partida) => (
                <li key={partida.id}>
                  <span>
                    vs {partida.rival} {partida.rival_anio} ({partida.goles_favor}-{partida.goles_contra})
                  </span>
                  <small>{new Date(partida.fecha_fin).toLocaleDateString("es-AR")}</small>
                  <strong>{partida.puntaje}</strong>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <Link href="/" className="btn secundario">
          Volver al inicio
        </Link>
      </main>
    </div>
  );
}