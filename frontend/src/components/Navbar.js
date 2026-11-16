"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import Button from "./Button";
import styles from "./Navbar.module.css";

export default function Navbar({ usuario }) {
  const router = useRouter();
  const pathname = usePathname();
  const enInicio = pathname === "/";

  const salir = () => {
    localStorage.removeItem("usuario");
    router.replace("/login");
  };

  return (
    <header className={styles.barra}>
      <div className={styles.izquierda}>
        <Link href="/" title="Ir al inicio" aria-label="Ir al inicio">
          <Image src="/logo.svg" alt="Draft XI" width={40} height={47} />
        </Link>
        {!enInicio && (
          <Link href="/" className={styles.volver} title="Volver a la pantalla de inicio">
            <span aria-hidden="true">←</span> Volver al inicio
          </Link>
        )}
      </div>
      <nav className={styles.menu}>
        <Link href="/draft">Jugar</Link>
        <Link href="/sala">Online</Link>
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
