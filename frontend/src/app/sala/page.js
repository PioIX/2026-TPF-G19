"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import draft from "../draft/page.module.css";
import styles from "./page.module.css";
import Navbar from "@/components/Navbar";
import Button from "@/components/Button";
import Cancha from "@/components/Cancha";
import useUsuario from "@/hooks/useUsuario";
import useSocket from "@/hooks/useSocket";

function Lobby({ codigo, setCodigo, isConnected, enviar }) {
  return (
    <div className={clsx("tarjeta", styles.lobby)}>
      <div className={styles.lobbyIntro}>
        <span className={styles.introEtiqueta}><span /> MULTIJUGADOR · EN VIVO</span>
        <h1>EL CLÁSICO <span>SE JUEGA</span></h1>
        <p>Vos y tu rival reciben el mismo sorteo. Armen sus 11 leyendas y que la cancha decida quién se queda con la victoria.</p>
        <div className={styles.versus} aria-hidden="true"><span>VOS</span><b>VS</b><span>RIVAL</span></div>
      </div>
      <div className={styles.lobbyJugar}>
        <div className={styles.lobbyCrear}>
          <span className={styles.numeroPaso}>01 / DESAFIÁ</span>
          <h2>Creá una sala</h2>
          <p>Invitá a un amigo y empezá un duelo nuevo.</p>
          <Button onClick={() => enviar("sala:crear")} disabled={!isConnected}>Crear sala <span aria-hidden="true"> →</span></Button>
        </div>
        <div className={styles.lobbyUnirse}>
          <span className={styles.numeroPaso}>02 / SUMATE</span>
          <h2>¿Tenés un código?</h2>
          <p>Ingresá el código que te pasó tu rival.</p>
          <form className={styles.formUnirse} onSubmit={(evento) => { evento.preventDefault(); enviar("sala:unirse", { codigo }); }}>
            <input className={styles.entrada} value={codigo} onChange={(e) => setCodigo(e.target.value.toUpperCase())} placeholder="XXXXX" maxLength={5} aria-label="Código de sala" />
            <Button type="submit" variante="secundario" disabled={!isConnected || !codigo.trim()}>Unirme</Button>
          </form>
        </div>
        <p className={styles.estadoConexion}><span className={isConnected ? styles.conectado : styles.desconectado} />{isConnected ? "Servidor conectado · listo para jugar" : "Conectando con el servidor..."}</p>
      </div>
    </div>
  );
}

function Espera({ sala, enviar, salir }) {
  const esAnfitrion = sala.anfitrionId === sala.yoId;
  const completa = sala.jugadores.length === 2 && sala.jugadores.every((jugador) => jugador.conectado);

  return (
    <div className={clsx("tarjeta", styles.tarjetaSala)}>
      <h2>Sala de espera</h2>
      <p>Tu cancha está lista. Compartí el código para que se sume tu rival.</p>
      <div className={styles.codigoPanel}>
        <span className={styles.codigoEtiqueta}>CÓDIGO DE INVITACIÓN</span>
        <div className={styles.codigoCaja}>
          <span className={styles.codigo}>{sala.codigo}</span>
          <Button chico variante="secundario" onClick={() => {
            if (navigator.clipboard) {
              navigator.clipboard.writeText(sala.codigo);
            }
          }}>
            Copiar código
          </Button>
        </div>
        <span className={styles.codigoAyuda}>Pasáselo a tu amigo para que entre a la sala</span>
      </div>
      {sala.jugadores.map((jugador) => (
        <div key={jugador.id} className={styles.fila}>
          <span>
            {jugador.nombre}
            {jugador.id === sala.anfitrionId ? " (anfitrión)" : ""}
            {jugador.id === sala.yoId ? " · vos" : ""}
          </span>
          <small>{jugador.conectado ? "🟢 conectado" : "🔴 desconectado"}</small>
        </div>
      ))}
      {sala.jugadores.length < 2 && <p className={styles.espera}>Esperando al segundo jugador...</p>}
      <div className={draft.acciones}>
        {esAnfitrion ? (
          <Button onClick={() => enviar("sala:iniciar")} disabled={!completa}>
            Iniciar partida
          </Button>
        ) : (
          <p className={styles.espera}>Esperando que el anfitrión inicie la partida...</p>
        )}
        <Button variante="secundario" onClick={salir}>
          Salir de la sala
        </Button>
      </div>
    </div>
  );
}

function Draft({ sala, enviar, salir, elegidoId, setElegidoId }) {
  const rival = sala.jugadores.find((jugador) => jugador.id !== sala.yoId);
  const elegido = sala.sorteo.jugadores.find((jugador) => jugador.id === elegidoId && jugador.elegible) || null;

  let puestosHabilitados = [];
  if (elegido && !sala.yaElegi) {
    puestosHabilitados = sala.formacion
      .filter(
        (puesto) =>
          puesto.posicion === elegido.posicion && !sala.equipo.some((ocupado) => ocupado.numero === puesto.numero)
      )
      .map((puesto) => puesto.numero);
  }

  let ayuda = "Elegí un jugador de la lista.";
  if (sala.sinOpciones) ayuda = "Ningún jugador de este sorteo te sirve. Esperá la próxima ronda.";
  else if (sala.yaElegi) ayuda = `Elegiste. Esperando a ${rival ? rival.nombre : "tu rival"}...`;
  else if (elegido) ayuda = `Elegiste a ${elegido.nombre}. Tocá un puesto ${elegido.posicion} resaltado en la cancha.`;

  function colocarJugador(numeroPuesto) {
    enviar("sala:elegir", { plantilla_jugador_id: elegidoId, numero: numeroPuesto }, () => setElegidoId(null));
  }

  return (
    <>
      <div className={styles.estados}>
        {sala.jugadores.map((jugador) => (
          <div key={jugador.id} className={clsx(styles.chip, { [styles.listo]: jugador.listo })}>
            <strong>{jugador.id === sala.yoId ? "Vos" : jugador.nombre}</strong>
            <span>
              {jugador.cantidad}/{sala.formacion.length}
            </span>
            <small>{!jugador.conectado ? "desconectado" : jugador.listo ? "ya eligió" : "eligiendo..."}</small>
          </div>
        ))}
      </div>

      <div className={draft.columnas}>
        <div className="tarjeta">
          <p className={styles.ronda}>
            Ronda {sala.ronda}/{sala.formacion.length}
          </p>
          <p className={draft.sorteo}>
            {sala.sorteo.seleccion} {sala.sorteo.anio}
          </p>
          <ul className={draft.lista}>
            {sala.sorteo.jugadores.map((jugador) => (
              <li key={jugador.id}>
                <button
                  type="button"
                  disabled={!jugador.elegible || sala.yaElegi}
                  onClick={() => setElegidoId(jugador.id)}
                  className={clsx(draft.jugador, {
                    [draft.elegido]: elegidoId === jugador.id,
                    [draft.noDisponible]: !jugador.elegible || sala.yaElegi,
                  })}
                >
                  <span className={draft.posicion}>{jugador.posicion}</span>
                  {jugador.nombre} | {jugador.valoracion}
                </button>
              </li>
            ))}
          </ul>
          <p className={draft.ayuda}>{ayuda}</p>
        </div>

        <div className="tarjeta">
          <h2>
            Alineación ({sala.equipo.length}/{sala.formacion.length})
          </h2>
          <Cancha
            formacion={sala.formacion}
            equipo={sala.equipo}
            habilitados={puestosHabilitados}
            onElegir={colocarJugador}
          />
          <Button variante="secundario" chico onClick={salir}>
            Abandonar partida
          </Button>
        </div>
      </div>
    </>
  );
}

function Resultado({ sala }) {
  const resultado = sala.resultado;

  if (resultado.error) {
    return <p className={draft.centrado}>{resultado.error}</p>;
  }
  if (resultado.abandono) {
    return (
      <>
        <h2 className={draft.fase}>¡Ganaste!</h2>
        <p className={draft.centrado}>{resultado.abandonoNombre} abandonó la partida.</p>
      </>
    );
  }

  const gane = resultado.ganadorId === sala.yoId;
  const local = resultado.marcador[0];
  const visitante = resultado.marcador[1];

  return (
    <>
      <h2 className={draft.fase}>{gane ? "¡Ganaste!" : "Perdiste"}</h2>
      <div className={draft.marcador}>
        <div className={draft.lado}>
          <strong>{local.nombre}</strong>
          <small>{local.goleadores.join(", ") || "Sin goles"}</small>
        </div>
        <div className={draft.goles}>
          {local.goles} - {visitante.goles}
        </div>
        <div className={draft.lado}>
          <strong>{visitante.nombre}</strong>
          <small>{visitante.goleadores.join(", ") || "Sin goles"}</small>
        </div>
      </div>
      {resultado.penales && <p className={draft.centrado}>Se definió por penales</p>}
      <div className={draft.columnas}>
        {resultado.marcador.map((lado) => (
          <div key={lado.id}>
            <h3 className={draft.centrado}>{lado.id === sala.yoId ? "Tu equipo" : `Equipo de ${lado.nombre}`}</h3>
            <Cancha formacion={sala.formacion} equipo={resultado.equipos[lado.id]} onElegir={() => { }} />
          </div>
        ))}
      </div>
    </>
  );
}

function Fin({ sala, enviar, salir }) {
  return (
    <div className="tarjeta">
      <Resultado sala={sala} />
      <div className={draft.acciones}>
        {sala.jugadores.length === 2 && <Button onClick={() => enviar("sala:volver")}>Revancha</Button>}
        <Button variante="secundario" onClick={salir}>
          Salir de la sala
        </Button>
        <Link href="/" className="btn secundario">
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}

export default function SalaPage() {
  const usuario = useUsuario();
  const { socket, isConnected } = useSocket();
  const [sala, setSala] = useState(null);
  const [codigo, setCodigo] = useState("");
  const [error, setError] = useState("");
  const [elegidoId, setElegidoId] = useState(null);

  useEffect(() => {
    if (!socket) return;

    const alEstado = (nuevoEstado) => setSala(nuevoEstado);
    const alFallarConexion = (e) => {
      setError(
        e.message === "No autorizado"
          ? "Tu sesión no es válida. Cerrá sesión y volvé a entrar."
          : "No se pudo conectar con el servidor."
      );
    };
    socket.on("sala:estado", alEstado);
    socket.on("connect_error", alFallarConexion);
    return () => {
      socket.off("sala:estado", alEstado);
      socket.off("connect_error", alFallarConexion);
    };
  }, [socket]);

  function enviar(evento, datos = {}, alTerminar) {
    setError("");
    if (!socket) return;
    socket.emit(evento, datos, (respuesta) => {
      if (respuesta && respuesta.error) {
        setError(respuesta.error);
        return;
      }
      if (respuesta && respuesta.sala !== undefined) setSala(respuesta.sala);
      if (alTerminar) alTerminar();
    });
  }

  function salir() {
    enviar("sala:salir", {}, () => setElegidoId(null));
  }

  if (!usuario) {
    return <div className={draft.cargando}>Cargando...</div>;
  }

  let pantalla;
  if (!sala) {
    pantalla = <Lobby codigo={codigo} setCodigo={setCodigo} isConnected={isConnected} enviar={enviar} />;
  } else if (sala.estado === "draft") {
    pantalla = <Draft sala={sala} enviar={enviar} salir={salir} elegidoId={elegidoId} setElegidoId={setElegidoId} />;
  } else if (sala.estado === "fin") {
    pantalla = <Fin sala={sala} enviar={enviar} salir={salir} />;
  } else {
    pantalla = <Espera sala={sala} enviar={enviar} salir={salir} />;
  }

  return (
    <div>
      <Navbar usuario={usuario} />
      <main className={draft.principal}>
        {error && <div className={draft.error}>{error}</div>}
        {pantalla}
      </main>
    </div>
  );
}
