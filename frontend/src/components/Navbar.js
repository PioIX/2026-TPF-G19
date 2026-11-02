"use client";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Button from "./Button";
import styles from "./Navbar.module.css";

export default function Navbar({ usuario }) {
  const router = useRouter();

  const salir = () => {
    localStorage.removeItem("usuario");
    router.replace("/login");
  };

  return (
    <header className={styles.barra}>
      <Link href="/">
        <Image src="/logo.svg" alt="Draft XI" width={40} height={47} />
      </Link>
      <nav className={styles.menu}>
        <Link href="/draft">Jugar</Link>
        <Link href="/ranking">Ranking</Link>
        {usuario.rol === "admin" && <Link href="/admin">Admin</Link>}
        <span className={styles.nombre}>{usuario.nombre}</span>
        <Button chico variante="secundario" onClick={salir}>
          Salir
        </Button>
      </nav>
    </header>
  );
}