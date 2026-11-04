AdminPlantillas.js (nuevo)
js
"use client";

import { useEffect, useState } from "react";
import Button from "./Button";
import { api } from "@/lib/api";
import styles from "./TablaCrud.module.css";
HEAD

const POSICIONES = ["POR", "DEF", "MED", "DEL"];
const FORM_VACIO = { jugador_id: "", posicion: "DEL", valoracion: 80 };

export default function AdminPlantillas() {
  const [plantillas, setPlantillas] = useState([]);
  const [selecciones, setSelecciones] = useState([]);
  const [mundiales, setMundiales] = useState([]);
  const [jugadores, setJugadores] = useState([]);
  const [nuevaPlantilla, setNuevaPlantilla] = useState({ seleccion_id: "", mundial_id: "" });
  const [plantillaAbierta, setPlantillaAbierta] = useState(null); 
  const [integrantes, setIntegrantes] = useState([]);
  const [form, setForm] = useState(FORM_VACIO);
  const [editandoId, setEditandoId] = useState(null);
  const [filtro, setFiltro] = useState("");
  const [error, setError] = useState("");
  const [version, setVersion] = useState(0); 
 HEAD
  
  useEffect(() => {
    api("/admin/selecciones").then((data) => setSelecciones(data)).catch((e) => setError(e.message));
    api("/admin/mundiales").then((data) => setMundiales(data)).catch((e) => setError(e.message));
    api("/admin/jugadores").then((data) => setJugadores(data)).catch((e) => setError(e.message));
  }, []);

  useEffect(() => {
    api("/admin/plantillas")
      .then((data) => setPlantillas(data))
      .catch((e) => setError(e.message));
  }, [version]);

  useEffect(() => {
    if (!plantillaAbierta) return;
    api(`/admin/plantillas/${plantillaAbierta.id}/jugadores`)
      .then((data) => setIntegrantes(data))
      .catch((e) => setError(e.message));
  }, [plantillaAbierta, version]);

  async function crearPlantilla(event) {
    event.preventDefault();
    setError("");
    try {
      await api("/admin/plantillas", "POST", nuevaPlantilla);
      setNuevaPlantilla({ seleccion_id: "", mundial_id: "" });
      setVersion(version + 1);
    } catch (e) {
      setError(e.message);
    }
  }

  async function eliminarPlantilla(plantilla) {
    if (!confirm(`¿Eliminar la plantilla ${plantilla.seleccion} ${plantilla.anio} con todos sus jugadores?`)) return;
    setError("");
    try {
      await api(`/admin/plantillas/${plantilla.id}`, "DELETE");
      if (plantillaAbierta && plantillaAbierta.id === plantilla.id) setPlantillaAbierta(null);
      setVersion(version + 1);
    } catch (e) {
      setError(e.message);
    }
  }

  async function guardarIntegrante(event) {
    event.preventDefault();
    setError("");
    try {
      if (editandoId) {
        await api(`/admin/plantilla-jugadores/${editandoId}`, "PUT", {
          posicion: form.posicion,
          valoracion: form.valoracion,
        });
      } else {
        await api(`/admin/plantillas/${plantillaAbierta.id}/jugadores`, "POST", form);
      }
      setForm(FORM_VACIO);
      setEditandoId(null);
      setVersion(version + 1);
    } catch (e) {
      setError(e.message);
    }
  }

  function editarIntegrante(integrante) {
    setEditandoId(integrante.id);
    setForm({ jugador_id: integrante.jugador_id, posicion: integrante.posicion, valoracion: integrante.valoracion });
  }

  function cancelarEdicion() {
    setEditandoId(null);
    setForm(FORM_VACIO);
  }

  async function quitarIntegrante(integrante) {
    setError("");
    try {
      await api(`/admin/plantilla-jugadores/${integrante.id}`, "DELETE");
      setVersion(version + 1);
    } catch (e) {
      setError(e.message);
    }
  }

  
  const jugadoresFiltrados = jugadores
    .filter((jugador) => jugador.nombre.toLowerCase().includes(filtro.toLowerCase()))
    .slice(0, 50);

  return (
    <div className="tarjeta">
      <h2>Plantillas</h2>
      {error && <p className={styles.error}>{error}</p>}

      <form className={styles.form} onSubmit={crearPlantilla}>
        <select
          className={styles.input}
          value={nuevaPlantilla.seleccion_id}
          onChange={(event) => setNuevaPlantilla({ ...nuevaPlantilla, seleccion_id: event.target.value })}
        >
          <option value="">Selección...</option>
          {selecciones.map((seleccion) => (
            <option key={seleccion.id} value={seleccion.id}>
              {seleccion.nombre}
            </option>
          ))}
        </select>
        <select
          className={styles.input}
          value={nuevaPlantilla.mundial_id}
          onChange={(event) => setNuevaPlantilla({ ...nuevaPlantilla, mundial_id: event.target.value })}
        >
          <option value="">Mundial...</option>
          {mundiales.map((mundial) => (
            <option key={mundial.id} value={mundial.id}>
              {mundial.anio} - {mundial.pais_sede}
            </option>
          ))}
        </select>
        <Button type="submit">Crear plantilla</Button>
      </form>

      <div className={styles.scroll}>
        <table className={styles.tabla}>
          <thead>
            <tr>
              <th>Selección</th>
              <th>Año</th>
              <th>Jugadores</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {plantillas.map((plantilla) => (
              <tr key={plantilla.id}>
                <td>{plantilla.seleccion}</td>
                <td>{plantilla.anio}</td>
                <td>{plantilla.cantidad}</td>
                <td className={styles.acciones}>
                  <Button chico variante="secundario" onClick={() => setPlantillaAbierta(plantilla)}>
                    Ver jugadores
                  </Button>
                  <Button chico variante="peligro" onClick={() => eliminarPlantilla(plantilla)}>
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {plantillaAbierta && (
        <div className={styles.detalle}>
          <h3>
            Jugadores de {plantillaAbierta.seleccion} {plantillaAbierta.anio}
          </h3>

          <form className={styles.form} onSubmit={guardarIntegrante}>
            {!editandoId && (
              <div className={styles.grupo}>
                <input
                  className={styles.input}
                  placeholder="Filtrar jugador..."
                  value={filtro}
                  onChange={(event) => setFiltro(event.target.value)}
                />
                <select
                  className={styles.input}
                  value={form.jugador_id}
                  onChange={(event) => setForm({ ...form, jugador_id: event.target.value })}
                >
                  <option value="">Jugador...</option>
                  {jugadoresFiltrados.map((jugador) => (
                    <option key={jugador.id} value={jugador.id}>
                      {jugador.nombre}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <select
              className={styles.input}
              value={form.posicion}
              onChange={(event) => setForm({ ...form, posicion: event.target.value })}
            >
              {POSICIONES.map((posicion) => (
                <option key={posicion} value={posicion}>
                  {posicion}
                </option>
              ))}
            </select>
            <input
              className={styles.input}
              type="number"
              min="1"
              max="99"
              value={form.valoracion}
              onChange={(event) => setForm({ ...form, valoracion: event.target.value })}
            />
            <Button type="submit">{editandoId ? "Guardar cambios" : "Agregar jugador"}</Button>
            {editandoId && (
              <Button variante="secundario" onClick={cancelarEdicion}>
                Cancelar
              </Button>
            )}
          </form>

          <div className={styles.scroll}>
            <table className={styles.tabla}>
              <thead>
                <tr>
                  <th>Jugador</th>
                  <th>Posición</th>
                  <th>Valoración</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {integrantes.map((integrante) => (
                  <tr key={integrante.id}>
                    <td>{integrante.nombre}</td>
                    <td>{integrante.posicion}</td>
                    <td>{integrante.valoracion}</td>
                    <td className={styles.acciones}>
                      <Button chico variante="secundario" onClick={() => editarIntegrante(integrante)}>
                        Editar
                      </Button>
                      <Button chico variante="peligro" onClick={() => quitarIntegrante(integrante)}>
                        Quitar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}


