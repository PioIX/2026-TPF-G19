"use client";

import { useEffect, useState } from "react";
import Button from "./Button";
import { api } from "@/lib/api";
import styles from "./TablaCrud.module.css";

// campos: [{ name, label, type }] -> sirve para cualquier tabla simple del backend
export default function TablaCrud({ titulo, ruta, campos }) {
  const [filas, setFilas] = useState([]);
  const [form, setForm] = useState(crearFormVacio());
  const [editandoId, setEditandoId] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [error, setError] = useState("");
  const [version, setVersion] = useState(0); // al cambiar, se vuelve a pedir la lista

  function crearFormVacio() {
    const vacio = {};
    campos.forEach((campo) => {
      vacio[campo.name] = "";
    });
    return vacio;
  }

  useEffect(() => {
    api(`/admin/${ruta}`)
      .then((data) => setFilas(data))
      .catch((e) => setError(e.message));
  }, [ruta, version]);

  const cambiar = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  async function guardar(event) {
    event.preventDefault();
    setError("");
    try {
      if (editandoId) {
        await api(`/admin/${ruta}/${editandoId}`, "PUT", form);
      } else {
        await api(`/admin/${ruta}`, "POST", form);
      }
      setForm(crearFormVacio());
      setEditandoId(null);
      setVersion(version + 1);
    } catch (e) {
      setError(e.message);
    }
  }

  function editar(fila) {
    const datos = {};
    campos.forEach((campo) => {
      datos[campo.name] = fila[campo.name] || "";
    });
    setEditandoId(fila.id);
    setForm(datos);
  }

  function cancelar() {
    setEditandoId(null);
    setForm(crearFormVacio());
  }

  async function eliminar(fila) {
    if (!confirm("¿Eliminar este registro?")) return;
    setError("");
    try {
      await api(`/admin/${ruta}/${fila.id}`, "DELETE");
      setVersion(version + 1);
    } catch (e) {
      setError(e.message);
    }
  }

  // Buscador: deja las filas donde algún campo contiene el texto (máximo 100 filas)
  const filasVisibles = filas
    .filter((fila) =>
      campos.some((campo) => String(fila[campo.name] || "").toLowerCase().includes(busqueda.toLowerCase()))
    )
    .slice(0, 100);

  return (
    <div className="tarjeta">
      <h2>{titulo}</h2>
      {error && <p className={styles.error}>{error}</p>}

      <form className={styles.form} onSubmit={guardar}>
        {campos.map((campo) => (
          <input
            key={campo.name}
            name={campo.name}
            type={campo.type || "text"}
            placeholder={campo.label}
            value={form[campo.name]}
            onChange={cambiar}
            className={styles.input}
          />
        ))}
        <Button type="submit">{editandoId ? "Guardar cambios" : "Agregar"}</Button>
        {editandoId && (
          <Button variante="secundario" onClick={cancelar}>
            Cancelar
          </Button>
        )}
      </form>

      <input
        className={styles.input}
        placeholder="Buscar..."
        value={busqueda}
        onChange={(event) => setBusqueda(event.target.value)}
      />

      <div className={styles.scroll}>
        <table className={styles.tabla}>
          <thead>
            <tr>
              {campos.map((campo) => (
                <th key={campo.name}>{campo.label}</th>
              ))}
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filasVisibles.map((fila) => (
              <tr key={fila.id}>
                {campos.map((campo) => (
                  <td key={campo.name} className={styles.celda}>
                    {fila[campo.name]}
                  </td>
                ))}
                <td className={styles.acciones}>
                  <Button chico variante="secundario" onClick={() => editar(fila)}>
                    Editar
                  </Button>
                  <Button chico variante="peligro" onClick={() => eliminar(fila)}>
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filas.length > filasVisibles.length && (
          <p className={styles.nota}>Mostrando hasta 100 resultados. Usá el buscador.</p>
        )}
      </div>
    </div>
  );
}