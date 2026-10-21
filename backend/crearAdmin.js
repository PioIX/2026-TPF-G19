import bcrypt from "bcrypt";
import { query, pool } from "./modulos/mysql.js";

const [nombre, correo, contrasenia] = process.argv.slice(2);
if (!nombre || !correo || !contrasenia) {
  console.log('Uso: npm run crear-admin -- "Nombre" correo contraseña');
  process.exit(1);
}
const hash = await bcrypt.hash(password, 10);
await query(
  "INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, 'admin')",
  [nombre, email.toLowerCase(), hash]
);
console.log("Administrador creado:", email);
process.exit(0);
try {
  const hash = await bcrypt.hash(contrasenia, 10);
  const existente = await query("SELECT id FROM Usuarios WHERE correo = ?", [correo.toLowerCase()]);

  if (existente.length > 0) {
    await query("UPDATE Usuarios SET contrasenia = ?, rol = 'admin' WHERE id = ?", [hash, existente[0].id]);
    console.log("Usuario existente actualizado como administrador:", correo);
  } else {
    await query(
      "INSERT INTO Usuarios (nombre, correo, contrasenia, rol) VALUES (?, ?, ?, 'admin')",
      [nombre, correo.toLowerCase(), hash]
    );
    console.log("Administrador creado:", correo);
  }
} catch (err) {
  console.error("No se pudo crear el administrador:", err.message);
  process.exitCode = 1;
}