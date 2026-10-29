import { query, pool } from "./modulos/mysql.js";

const nombre = process.argv[2];
const correo = process.argv[3];
const contrasenia = process.argv[4];

if (!nombre || !correo || !contrasenia) {
  console.log('Uso: npm run crear-admin -- "Nombre" correo contraseña');
  process.exit(1);
}

const existe = await query("SELECT id FROM Usuarios WHERE correo = ?", [correo]);

if (existe.length > 0) {
  await query("UPDATE Usuarios SET rol = 'admin', contrasenia = ? WHERE correo = ?", [contrasenia, correo]);
  console.log("El usuario ya existía: ahora es admin y se actualizó su contraseña");
} else {
  await query(
    "INSERT INTO Usuarios (nombre, correo, contrasenia, rol, fecha_creacion) VALUES (?, ?, ?, 'admin', NOW())",
    [nombre, correo, contrasenia]
  );
  console.log("Administrador creado correctamente");
}

await pool.end();