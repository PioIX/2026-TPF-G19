import express from "express";
import cors from "cors";
import crypto from "crypto";
import dotenv from "dotenv";
import { query } from "./modulos/mysql.js";

dotenv.config();

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

const app = express();
app.use(cors({ origin: FRONTEND_URL }));
app.use(express.json());

function hashContrasenia(contrasenia) {
  const sal = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(contrasenia, sal, 64).toString("hex");
  return `${sal}:${hash}`;
}

function verificarContrasenia(contrasenia, guardada) {
  const [sal, hash] = String(guardada || "").split(":");
  if (!sal || !hash) return false;
  const esperado = Buffer.from(hash, "hex");
  const calculado = crypto.scryptSync(contrasenia, sal, esperado.length);
  return crypto.timingSafeEqual(calculado, esperado);
}

app.post("/registro", async (req, res) => {
  try {
    const nombre = String(req.body.nombre || "").trim();
    const correo = String(req.body.email || "").trim().toLowerCase();
    const contrasenia = String(req.body.password || "");

    if (!nombre || !correo || !contrasenia) {
      return res.status(400).json({ error: "Completá todos los campos" });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      return res.status(400).json({ error: "El email no es válido" });
    }
    if (contrasenia.length < 6) {
      return res.status(400).json({ error: "La contraseña debe tener al menos 6 caracteres" });
    }

    const existe = await query("SELECT id FROM Usuarios WHERE correo = ? OR nombre = ?", [correo, nombre]);
    if (existe.length > 0) {
      return res.status(409).json({ error: "Ese email o nombre de usuario ya está registrado" });
    }

    await query("INSERT INTO Usuarios (nombre, correo, contrasenia) VALUES (?, ?, ?)", [
      nombre,
      correo,
      hashContrasenia(contrasenia),
    ]);

    res.status(201).json({ mensaje: "Usuario registrado correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error del servidor" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const correo = String(req.body.email || "").trim().toLowerCase();
    const contrasenia = String(req.body.password || "");

    if (!correo || !contrasenia) {
      return res.status(400).json({ error: "Completá email y contraseña" });
    }

    const filas = await query("SELECT * FROM Usuarios WHERE correo = ?", [correo]);
    const usuario = filas[0];

    if (!usuario || !verificarContrasenia(contrasenia, usuario.contrasenia)) {
      return res.status(401).json({ error: "Email o contraseña incorrectos" });
    }

    res.json({
      usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.correo, rol: usuario.rol },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error del servidor" });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend escuchando en http://localhost:${PORT}`));
