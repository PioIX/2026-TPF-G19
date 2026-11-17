import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import { query } from "./modulos/mysql.js";
import rutasAdmin from "./routes/admin.js";
import rutasJuego from "./routes/juego.js";
import { registrarSalas } from "./salas.js";

dotenv.config();

const ORIGENES = (process.env.FRONTEND_URL || "http://localhost:3000,http://localhost:3001")
  .split(",")
  .map((origen) => origen.trim());
const METODOS_CORS = ["GET", "POST", "PUT", "DELETE"];

const app = express();
app.use(cors({ origin: ORIGENES, methods: METODOS_CORS }));
app.use(express.json());

const server = createServer(app);
const io = new Server(server, {
  cors: { origin: ORIGENES, methods: METODOS_CORS },
});
app.set("io", io);

io.use(async (socket, next) => {
  try {
    const id = Number(socket.handshake.auth && socket.handshake.auth.usuarioId);
    if (!id) return next(new Error("No autorizado"));
    const filas = await query("SELECT id, nombre, rol FROM Usuarios WHERE id = ?", [id]);
    if (filas.length === 0) return next(new Error("No autorizado"));
    socket.data.usuario = { id: filas[0].id, nombre: filas[0].nombre, rol: filas[0].rol };
    next();
  } catch (err) {
    console.error(err);
    next(new Error("Error del servidor"));
  }
});

registrarSalas(io);

io.on("connection", (socket) => {
  io.emit("usuarios:conectados", io.of("/").sockets.size);
  socket.on("disconnect", () => {
    io.emit("usuarios:conectados", io.of("/").sockets.size);
  });
});



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

    await query("INSERT INTO Usuarios (nombre, correo, contrasenia, fecha_creacion) VALUES (?, ?, ?, NOW())", [
      nombre,
      correo,
      contrasenia,
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

    if (!usuario || usuario.contrasenia !== contrasenia) {
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

app.use("/admin", rutasAdmin);
app.use(rutasJuego);

const PORT = process.env.PORT || 4000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend escuchando en el puerto ${PORT}`);
});
