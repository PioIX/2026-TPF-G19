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

  const posicionUsuario = ranking.findIndex((fila) => fila.nombre === usuario.nombre);
  const mejorPuntaje = historial.reduce((mejor, partida) => Math.max(mejor, Number(partida.puntaje) || 0), 0);

  return (
    <div>
      <Navbar usuario={usuario} />
      <main className={styles.principal}>
        <header className={styles.cabecera}>
          <div>
            <span className={styles.kicker}>TEMPORADA · DRAFT XI</span>
            <h1 className={styles.titulo}>La tabla <span>de campeones</span></h1>
            <p className={styles.bajada}>Tu recorrido y el de los mejores estrategas del torneo.</p>
          </div>
          <p className={`${styles.estado} ${isConnected ? styles.estadoActivo : styles.estadoInactivo}`}>
            <span /> {isConnected ? "EN VIVO" : "SIN CONEXIÓN"}
          </p>
        </header>
        {aviso && <p className={styles.aviso}>{aviso}</p>}

        <section className={styles.resumen} aria-label="Tus estadísticas">
          <div><span>PUESTO GLOBAL</span><strong>{posicionUsuario < 0 ? "—" : `#${posicionUsuario + 1}`}</strong></div>
          <div><span>PARTIDAS JUGADAS</span><strong>{historial.length.toString().padStart(2, "0")}</strong></div>
          <div><span>MEJOR PUNTAJE</span><strong>{mejorPuntaje}<small> pts</small></strong></div>
        </section>

        <div className={styles.columnas}>
          <section className={`tarjeta ${styles.panelRanking}`}>
            <div className={styles.tituloPanel}><div><span className={styles.panelKicker}>LOS QUE MANDAN</span><h2>Ranking global</h2></div><span className={styles.iconoPanel}>🏆</span></div>
            {ranking.length === 0 && <p className={styles.vacio}>Todavía no hay partidas finalizadas. ¡Abrí la tabla con tu primera victoria!</p>}
            <ol className={styles.lista}>
              {ranking.map((fila, indice) => (
                <li key={fila.id} className={`${fila.nombre === usuario.nombre ? styles.mio : ""} ${indice === 0 ? styles.primero : ""}`}>
                  <span className={styles.nombreFila}>{fila.nombre}{fila.nombre === usuario.nombre && <i>VOS</i>}</span>
                  <small>{fila.fase}</small>
                  <strong>{fila.puntaje}<em> pts</em></strong>
                </li>
              ))}
            </ol>
          </section>

          <section className={`tarjeta ${styles.panelHistorial}`}>
            <div className={styles.tituloPanel}><div><span className={styles.panelKicker}>TU CAMINO</span><h2>Últimos partidos</h2></div><span className={styles.iconoPanel}>⚽</span></div>
            {historial.length === 0 && <p className={styles.vacio}>Todavía no jugaste ninguna partida. Tu historial empieza con el próximo torneo.</p>}
            <ol className={styles.lista}>
              {historial.map((partida) => (
                <li key={partida.id} className={styles.filaHistorial}>
                  <span className={`${styles.resultado} ${partida.goles_favor > partida.goles_contra ? styles.victoria : partida.goles_favor < partida.goles_contra ? styles.derrota : styles.empate}`}>{partida.goles_favor > partida.goles_contra ? "V" : partida.goles_favor < partida.goles_contra ? "D" : "E"}</span>
                  <span className={styles.rival}>vs {partida.rival} <small>{partida.rival_anio}</small><b>{partida.goles_favor}–{partida.goles_contra}</b></span>
                  <span className={styles.fechaPuntaje}><small>{new Date(partida.fecha_fin).toLocaleDateString("es-AR")}</small><strong>{partida.puntaje}<em> pts</em></strong></span>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <Link href="/" className={`btn secundario ${styles.volver}`}>
          Volver al inicio
        </Link>
      </main>
    </div>
  );
}
