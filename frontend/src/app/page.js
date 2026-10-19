"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    // si no hay usuario guardado, mandamos al login
    const guardado = localStorage.getItem("usuario");
    if (!guardado) {
      router.replace("/login");
      return;
    }
    setUsuario(JSON.parse(guardado));
  }, [router]);

  function cerrarSesion() {
    localStorage.removeItem("usuario");
    router.replace("/login");
  }

  if (!usuario) return <p style={{ padding: 24 }}>Cargando...</p>;

  return (
    <main style={{ padding: 24 }}>
      <h1>Hola, {usuario.nombre} 👋</h1>
      <p>Rol: {usuario.rol}</p>
      <button onClick={cerrarSesion}>Cerrar sesión</button>
    </main>
  );
}
