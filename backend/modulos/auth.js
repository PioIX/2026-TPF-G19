import { query } from "./mysql.js";

export async function identificarUsuario(req, res, next) {
  try {
    const id = Number(req.headers["usuario-id"]);
    if (!id) {
      return res.status(401).json({ error: "Tenés que iniciar sesión" });
    }
    const filas = await query("SELECT id, nombre, rol FROM Usuarios WHERE id = ?", [id]);
    if (filas.length === 0) {
      return res.status(401).json({ error: "Tenés que iniciar sesión" });
    }
    req.usuario = filas[0];
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error del servidor" });
  }
}

export function soloAdmin(req, res, next) {
  if (req.usuario.rol !== "admin") {
    return res.status(403).json({ error: "Solo para administradores" });
  }
  next();
}