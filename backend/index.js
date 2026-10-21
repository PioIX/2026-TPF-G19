import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { query } from "./modulos/mysql.js";
import { Server } from "socket.io";

import { generarToken, requiereLogin, usuarioDesdeToken } from "./modulos/auth.js";
import adminRouter from "./modulos/admin.js";

dotenv.config();

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

const app = express();
app.use(cors({ origin: FRONTEND_URL }));
app.use(express.json());

app.post("/registro", async (req, res) => {
  try {
    const { nombre, email, contrasenia } = req.body;

        if (!nombre || !correo || !contrasenia)  {
      return res.status(400).json({ error: "Completá todos los campos" });
    }

        const existe = await query("SELECT id FROM Usuarios WHERE correo = ? OR nombre = ?", [correo, nombre]);
    if (existe.length > 0) {
      return res.status(409).json({ error: "Ese email o nombre de usuario ya está registrado" });
    }

    const hash = await bcrypt.hash(contrasenia, 10);
    await query("INSERT INTO Usuarios (nombre, correo, contrasenia) VALUES (?, ?, ?)", [nombre, correo, hash]);

    res.status(201).json({ mensaje: "Usuario registrado correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error del servidor" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { correo, contrasenia } = req.body;

    if (!correo || !contrasenia) {
      return res.status(400).json({ error: "Completá email y contraseña" });
    }

    const filas = await query("SELECT * FROM usuarios WHERE correo = ?", [correo.toLowerCase()]);
    const usuario = filas[0];

    if (!usuario || !(await bcrypt.compare(contrasenia, usuario.contrasenia))) {
      return res.status(401).json({ error: "Email o contraseña incorrectos" });
    }

    res.json({
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error del servidor" });
  }
});

app.use("/api/admin", adminRouter);
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: FRONTEND_URL } });

function avisarConectados() {
  io.emit("usuarios_online", io.sockets.sockets.size);
}

io.on("connection", (socket) => {
  const nombre = socket.data.usuario?.nombre || "invitado";
  console.log(`Socket conectado: ${socket.id} (${nombre})`);

  socket.emit("bienvenida", { mensaje: `Conectado al servidor como ${nombre}` });
  avisarConectados();

  socket.on("disconnect", () => {
    console.log(`Socket desconectado: ${socket.id}`);
    avisarConectados();
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend escuchando en http://localhost:${PORT}`));
