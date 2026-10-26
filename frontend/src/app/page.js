"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function Home() {
  const router = useRouter();
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    try {
      const guardado = JSON.parse(localStorage.getItem("usuario"));
      if (guardado) setUsuario(guardado);
      else router.replace("/login");
    } catch {
      router.replace("/login");
    }
  }, [router]);

  function salir() {
    localStorage.removeItem("usuario");
    router.replace("/login");
  }

  if (!usuario) return <p className={styles.cargando}>Cargando...</p>;

  return (
    <main className={styles.principal}>
      <h1 className={styles.titulo}>Hola, {usuario.nombre}</h1>
      <p className={styles.subtitulo}>Armá tu once ideal con plantillas históricas de los Mundiales.</p>
      <button className="btn" onClick={salir}>
        Salir
      </button>
    </main>
  );
}
