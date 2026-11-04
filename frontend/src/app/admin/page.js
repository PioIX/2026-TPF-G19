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
        <h1 className={styles.titulo}>Panel de administración</h1>

        <div className={styles.pestanias}>
          {PESTANIAS.map((nombrePestania) => (
            <Button
              key={nombrePestania}
              variante={pestania === nombrePestania ? undefined : "secundario"}
              onClick={() => setPestania(nombrePestania)}
            >
              {nombrePestania}
            </Button>
          ))}
        </div>

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