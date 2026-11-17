"use client";

import { useState } from "react";
import styles from "./page.module.css";
import Navbar from "@/components/Navbar";
import Button from "@/components/Button";
import TablaCrud from "@/components/TablaCrud";
import AdminPlantillas from "@/components/AdminPlantillas";
import useUsuario from "@/hooks/useUsuario";

const PESTANIAS = ["Selecciones", "Mundiales", "Jugadores", "Plantillas"];

export default function AdminPage() {
  const usuario = useUsuario({ soloAdmin: true });
  const [pestania, setPestania] = useState("Selecciones");

  if (!usuario) {
    return <div className={styles.cargando}>Cargando...</div>;
  }

  return (
    <div>
      <Navbar usuario={usuario} />
      <main className={styles.principal}>
        <header className={styles.cabecera}>
          <div>
            <span className={styles.kicker}>DRAFT XI · CONTROL DEL JUEGO</span>
            <h1 className={styles.titulo}>Centro de <span>administración</span></h1>
            <p className={styles.bajada}>Gestioná los equipos, los mundiales y las plantillas del torneo.</p>
          </div>
          <span className={styles.sello} aria-hidden="true">⚙</span>
        </header>

        <nav className={styles.pestanias} aria-label="Secciones de administración">
          {PESTANIAS.map((nombrePestania, indice) => (
            <Button
              key={nombrePestania}
              variante={pestania === nombrePestania ? undefined : "secundario"}
              className={`${styles.tab} ${pestania === nombrePestania ? styles.tabActiva : ""}`}
              onClick={() => setPestania(nombrePestania)}
            >
              <span className={styles.numeroTab}>0{indice + 1}</span>{nombrePestania}
            </Button>
          ))}
        </nav>

        {pestania === "Selecciones" && (
          <TablaCrud
            titulo="Selecciones"
            ruta="selecciones"
            campos={[
              { name: "nombre", label: "Nombre" },
              { name: "codigo", label: "Código" },
              { name: "escudo_url", label: "URL del escudo" },
            ]}
          />
        )}
        {pestania === "Mundiales" && (
          <TablaCrud
            titulo="Mundiales"
            ruta="mundiales"
            campos={[
              { name: "anio", label: "Año", type: "number" },
              { name: "pais_sede", label: "País sede" },
            ]}
          />
        )}
        {pestania === "Jugadores" && (
          <TablaCrud titulo="Jugadores" ruta="jugadores" campos={[{ name: "nombre", label: "Nombre" }]} />
        )}
        {pestania === "Plantillas" && <AdminPlantillas />}
      </main>
    </div>
  );
}
