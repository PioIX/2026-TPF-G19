"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import styles from "../auth.module.css";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function Login() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const cambiar = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function enviar(e) {
    e.preventDefault();
    setError("");
    setCargando(true);

    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Ocurrió un error");
        return;
      }

      localStorage.setItem("usuario", JSON.stringify(data.usuario));
      router.push("/");
    } catch {
      setError("No se pudo conectar con el servidor");
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className={styles.contenedor}>
      <form className={styles.tarjeta} onSubmit={enviar}>
        <Image className={styles.logo} src="/logo.svg" alt="Draft XI" width={64} height={75} />
        <h1 className={styles.titulo}>Iniciar sesión</h1>

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.campo}>
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" value={form.email} onChange={cambiar} required />
        </div>
        <div className={styles.campo}>
          <label htmlFor="password">Contraseña</label>
          <input id="password" name="password" type="password" value={form.password} onChange={cambiar} required />
        </div>

        <button className={styles.boton} disabled={cargando}>
          {cargando ? "Ingresando..." : "Ingresar"}
        </button>

        <p className={styles.link}>
          ¿No tenés cuenta? <Link href="/registro">Registrate</Link>
        </p>
      </form>
    </div>
  );
}
