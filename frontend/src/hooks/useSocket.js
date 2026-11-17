import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { API_URL } from "@/lib/api";

function usuarioGuardado() {
  try {
    return JSON.parse(localStorage.getItem("usuario"));
  } catch {
    return null;
  }
}

function useSocket({ serverUrl = API_URL, options = {} } = {}) {
  const [socket] = useState(() =>
    io(serverUrl, {
      autoConnect: false,
      auth: (enviar) => enviar({ usuarioId: usuarioGuardado()?.id }),
      ...options,
    })
  );
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const onConnect = () => {
      setIsConnected(true);
      console.log("WebSocket conectado:", socket.id);
    };
    const onDisconnect = () => {
      setIsConnected(false);
      console.log("WebSocket desconectado");
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.connect();

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.disconnect();
    };
  }, [socket]);

  return { socket, isConnected };
}

export default useSocket;
export { useSocket };
