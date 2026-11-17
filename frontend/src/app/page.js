"use client";

import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";
import styles from "./page.module.css";
import Navbar from "@/components/Navbar";
import useUsuario from "@/hooks/useUsuario";

const OPCIONES = [
  { href: "/draft", icono: "⚽", titulo: "Jugar", texto: "Armá tu once ideal con leyendas del fútbol y ganate el pase a la final.", etiqueta: "MODO CAMPAÑA", detalle: "OCTAVOS · CUARTOS · SEMIS · FINAL", destacada: true },
  { href: "/sala", icono: "🌐", titulo: "Jugar online", texto: "Invitá a un amigo, armen sus equipos y definan quién manda en la cancha.", etiqueta: "DUELO EN VIVO", detalle: "CREÁ UNA SALA O UNITE CON CÓDIGO", online: true },
  { href: "/ranking", icono: "🏆", titulo: "Ranking", texto: "Mirá quiénes consiguieron los mejores puntajes." },
];

const OPCION_ADMIN = {
  href: "/admin",
  icono: "🛠️",
  titulo: "Administración",
  texto: "Gestioná selecciones, plantillas y jugadores.",
};

export default function Home() {
  const usuario = useUsuario();

  if (!usuario) return <p className={styles.cargando}>Cargando...</p>;

  const opciones = usuario.rol === "admin" ? [...OPCIONES, OPCION_ADMIN] : OPCIONES;

  return (
    <div>
      <Navbar usuario={usuario} />
      <main className={styles.principal}>
        <section className={styles.cabecera}>
          <Image src="/logo.svg" alt="" width={58} height={68} priority />
          <h1 className={styles.titulo}>Hola, {usuario.nombre}</h1>
          <p className={styles.subtitulo}>Armá tu once ideal con plantillas históricas de los Mundiales.</p>
        </section>

        <section className={styles.acciones}>
          {opciones.map((opcion) => (
            <Link key={opcion.href} href={opcion.href} className={clsx(styles.opcion, { [styles.destacada]: opcion.destacada, [styles.online]: opcion.online })}>
              {opcion.etiqueta && <span className={styles.etiqueta}>{opcion.etiqueta}</span>}
              <span className={styles.icono} aria-hidden="true">{opcion.icono}</span>
              <span className={styles.opcionTitulo}>{opcion.titulo}</span>
              <span className={styles.opcionTexto}>{opcion.texto}</span>
              {opcion.detalle && <span className={styles.detalle}>{opcion.detalle}<span aria-hidden="true"> ↗</span></span>}
            </Link>
          ))}
        </section>
      </main>
    </div>
  );
}
