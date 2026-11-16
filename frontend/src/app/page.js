"use client";

import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";
import styles from "./page.module.css";
import Navbar from "@/components/Navbar";
import useUsuario from "@/hooks/useUsuario";

const OPCIONES = [
  { href: "/draft", icono: "⚽", titulo: "Jugar", texto: "Armá tu once y avanzá de octavos hasta la final.", destacada: true },
  { href: "/sala", icono: "🌐", titulo: "Jugar online", texto: "Creá una sala y desafiá a un amigo en tiempo real." },
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
          <Image src="/logo.svg" alt="" width={72} height={85} priority />
          <h1 className={styles.titulo}>Hola, {usuario.nombre}</h1>
          <p className={styles.subtitulo}>Armá tu once ideal con plantillas históricas de los Mundiales.</p>
        </section>

        <section className={styles.acciones}>
          {opciones.map((opcion) => (
            <Link key={opcion.href} href={opcion.href} className={clsx(styles.opcion, { [styles.destacada]: opcion.destacada })}>
              <span className={styles.icono} aria-hidden="true">
                {opcion.icono}
              </span>
              <span className={styles.opcionTitulo}>{opcion.titulo}</span>
              <span className={styles.opcionTexto}>{opcion.texto}</span>
            </Link>
          ))}
        </section>
      </main>
    </div>
  );
}
