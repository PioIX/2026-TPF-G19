import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { API_URL } from "@/lib/api";

function useSocket() {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    let usuario = null;
    try {
      usuario = JSON.parse(localStorage.getItem("usuario"));
    } catch {
      usuario = null;
    }

    const nuevaConexion = io(API_URL, {
      auth: { usuarioId: usuario ? usuario.id : null },
    });

    function alConectar() {
      setIsConnected(true);
      console.log("WebSocket conectado.");
    }

    function alDesconectar() {
      setIsConnected(false);
      console.log("WebSocket desconectado.");
    }

    nuevaConexion.on("connect", alConectar);
    nuevaConexion.on("disconnect", alDesconectar);
    setSocket(nuevaConexion);

    return function limpiarConexion() {
      nuevaConexion.off("connect", alConectar);
      nuevaConexion.off("disconnect", alDesconectar);
      nuevaConexion.disconnect();
    };
  }, []);

  return { socket, isConnected };
}

export default useSocket;
export { useSocket };
