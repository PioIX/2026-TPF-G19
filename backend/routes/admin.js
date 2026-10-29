import { Router } from "express";
import { query } from "../modulos/mysql.js";
import { identificarUsuario, soloAdmin } from "../modulos/auth.js";

const router = Router();
router.use(identificarUsuario, soloAdmin);

const POSICIONES = ["POR", "DEF", "MED", "DEL"];

function responderError(res, err) {
  console.error(err);
  if (err.code === "ER_DUP_ENTRY") {
    return res.status(409).json({ error: "Ya existe un registro con esos datos" });
  }
  if (err.code === "ER_ROW_IS_REFERENCED_2") {
    return res.status(409).json({ error: "No se puede eliminar: se está usando en otras tablas" });
  }
  if (err.code === "ER_NO_REFERENCED_ROW_2") {
    return res.status(400).json({ error: "Referencia inválida" });
  }
  res.status(500).json({ error: "Error del servidor" });
}

/* ---------- Selecciones ---------- */
router.get("/selecciones", async (req, res) => {
  try {
    res.json(await query("SELECT * FROM Selecciones ORDER BY nombre"));
  } catch (err) {
    responderError(res, err);
  }
});

router.post("/selecciones", async (req, res) => {
  try {
    const { nombre, codigo, escudo_url } = req.body;
    if (!nombre || !codigo) return res.status(400).json({ error: "Nombre y código son obligatorios" });
    const resultado = await query("INSERT INTO Selecciones (nombre, codigo, escudo_url) VALUES (?, ?, ?)", [
      nombre,
      codigo,
      escudo_url || null,
    ]);
    res.status(201).json({ id: resultado.insertId });
  } catch (err) {
    responderError(res, err);
  }
});

router.put("/selecciones/:id", async (req, res) => {
  try {
    const { nombre, codigo, escudo_url } = req.body;
    if (!nombre || !codigo) return res.status(400).json({ error: "Nombre y código son obligatorios" });
    await query("UPDATE Selecciones SET nombre = ?, codigo = ?, escudo_url = ? WHERE id = ?", [
      nombre,
      codigo,
      escudo_url || null,
      req.params.id,
    ]);
    res.json({ mensaje: "Selección actualizada" });
  } catch (err) {
    responderError(res, err);
  }
});

router.delete("/selecciones/:id", async (req, res) => {
  try {
    await query("DELETE FROM Selecciones WHERE id = ?", [req.params.id]);
    res.json({ mensaje: "Selección eliminada" });
  } catch (err) {
    responderError(res, err);
  }
});

/* ---------- Mundiales ---------- */
router.get("/mundiales", async (req, res) => {
  try {
    res.json(await query("SELECT * FROM Mundiales ORDER BY anio DESC"));
  } catch (err) {
    responderError(res, err);
  }
});

router.post("/mundiales", async (req, res) => {
  try {
    const { anio, pais_sede } = req.body;
    if (!anio || !pais_sede) return res.status(400).json({ error: "Año y sede son obligatorios" });
    const resultado = await query("INSERT INTO Mundiales (anio, pais_sede) VALUES (?, ?)", [Number(anio), pais_sede]);
    res.status(201).json({ id: resultado.insertId });
  } catch (err) {
    responderError(res, err);
  }
});

router.put("/mundiales/:id", async (req, res) => {
  try {
    const { anio, pais_sede } = req.body;
    if (!anio || !pais_sede) return res.status(400).json({ error: "Año y sede son obligatorios" });
    await query("UPDATE Mundiales SET anio = ?, pais_sede = ? WHERE id = ?", [
      Number(anio),
      pais_sede,
      req.params.id,
    ]);
    res.json({ mensaje: "Mundial actualizado" });
  } catch (err) {
    responderError(res, err);
  }
});

router.delete("/mundiales/:id", async (req, res) => {
  try {
    await query("DELETE FROM Mundiales WHERE id = ?", [req.params.id]);
    res.json({ mensaje: "Mundial eliminado" });
  } catch (err) {
    responderError(res, err);
  }
});


/* ---------- Jugadores ---------- */
router.get("/jugadores", async (req, res) => {
  try {
    res.json(await query("SELECT * FROM Jugadores ORDER BY nombre"));
  } catch (err) {
    responderError(res, err);
  }
});

router.post("/jugadores", async (req, res) => {
  try {
    const { nombre } = req.body;
    if (!nombre) return res.status(400).json({ error: "El nombre es obligatorio" });
    const resultado = await query("INSERT INTO Jugadores (nombre) VALUES (?)", [nombre]);
    res.status(201).json({ id: resultado.insertId });
  } catch (err) {
    responderError(res, err);
  }
});

router.put("/jugadores/:id", async (req, res) => {
  try {
    const { nombre } = req.body;
    if (!nombre) return res.status(400).json({ error: "El nombre es obligatorio" });
    await query("UPDATE Jugadores SET nombre = ? WHERE id = ?", [nombre, req.params.id]);
    res.json({ mensaje: "Jugador actualizado" });
  } catch (err) {
    responderError(res, err);
  }
});

router.delete("/jugadores/:id", async (req, res) => {
  try {
    await query("DELETE FROM Jugadores WHERE id = ?", [req.params.id]);
    res.json({ mensaje: "Jugador eliminado" });
  } catch (err) {
    responderError(res, err);
  }
});

/* ---------- Plantillas (selección + mundial) ---------- */
router.get("/plantillas", async (req, res) => {
  try {
    res.json(
      await query(
        `SELECT Plantillas.id, Plantillas.seleccion_id, Plantillas.mundial_id,
                Selecciones.nombre AS seleccion, Mundiales.anio,
                (SELECT COUNT(*) FROM PlantillaJugadores WHERE PlantillaJugadores.plantilla_id = Plantillas.id) AS cantidad
         FROM Plantillas
         JOIN Selecciones ON Selecciones.id = Plantillas.seleccion_id
         JOIN Mundiales ON Mundiales.id = Plantillas.mundial_id
         ORDER BY Selecciones.nombre, Mundiales.anio DESC`
      )
    );
  } catch (err) {
    responderError(res, err);
  }
});

router.post("/plantillas", async (req, res) => {
  try {
    const { seleccion_id, mundial_id } = req.body;
    if (!seleccion_id || !mundial_id) return res.status(400).json({ error: "Elegí selección y mundial" });
    const existe = await query("SELECT id FROM Plantillas WHERE seleccion_id = ? AND mundial_id = ?", [
      seleccion_id,
      mundial_id,
    ]);
    if (existe.length > 0) return res.status(409).json({ error: "Esa plantilla ya existe" });
    const resultado = await query("INSERT INTO Plantillas (seleccion_id, mundial_id) VALUES (?, ?)", [
      seleccion_id,
      mundial_id,
    ]);
    res.status(201).json({ id: resultado.insertId });
  } catch (err) {
    responderError(res, err);
  }
});