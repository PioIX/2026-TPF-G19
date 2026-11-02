import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Devuelve el usuario logueado. Si no hay sesión (o no es admin cuando se pide), redirige.
export default function useUsuario({ soloAdmin = false } = {}) {
  const router = useRouter();
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const guardado = JSON.parse(localStorage.getItem("usuario"));

    if (!guardado) {
      router.replace("/login");
      return;
    }
    if (soloAdmin && guardado.rol !== "admin") {
      router.replace("/");
      return;
    }
    setUsuario(guardado);
  }, [router, soloAdmin]);

  return usuario;
}