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

