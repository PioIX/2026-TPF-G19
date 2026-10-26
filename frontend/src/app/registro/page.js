"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import styles from "../auth.module.css";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function Registro() {
  const router = useRouter();
  const [form, setForm] = useState({ nombre: "", email: "", password: "", confirmar: "" });
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const [cargando, setCargando] = useState(false);

  const cambiar = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function enviar(e) {
    e.preventDefault();
    setError("");
    setOk("");

    if (form.password !== form.confirmar) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setCargando(true);
    try {
      const res = await fetch(`${API_URL}/registro`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: form.nombre, email: form.email, password: form.password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Ocurrió un error");
        return;
      }

      setOk("Registro exitoso. Redirigiendo al login...");
      setTimeout(() => router.push("/login"), 1200);
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
        <h1 className={styles.titulo}>Crear cuenta</h1>

        {error && <div className={styles.error}>{error}</div>}
        {ok && <div className={styles.ok}>{ok}</div>}

        <div className={styles.campo}>
          <label htmlFor="nombre">Nombre de usuario</label>
          <input id="nombre" name="nombre" value={form.nombre} onChange={cambiar} required />
        </div>
        <div className={styles.campo}>
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" value={form.email} onChange={cambiar} required />
        </div>
        <div className={styles.campo}>
          <label htmlFor="password">Contraseña</label>
          <input id="password" name="password" type="password" minLength={6} value={form.password} onChange={cambiar} required />
        </div>
        <div className={styles.campo}>
          <label htmlFor="confirmar">Repetir contraseña</label>
          <input id="confirmar" name="confirmar" type="password" value={form.confirmar} onChange={cambiar} required />
        </div>

        <button className={styles.boton} disabled={cargando}>
          {cargando ? "Registrando..." : "Registrarme"}
        </button>

        <p className={styles.link}>
          ¿Ya tenés cuenta? <Link href="/login">Iniciar sesión</Link>
        </p>
      </form>
    </div>
  );
}
