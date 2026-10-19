import bcrypt from "bcrypt";
import { query } from "./modulos/mysql.js";

const [nombre, email, password] = process.argv.slice(2);
if (!nombre || !email || !password) {
  console.log('Uso: npm run crear-admin -- "Nombre" email contraseña');
  process.exit(1);
}
const hash = await bcrypt.hash(password, 10);
await query(
  "INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, 'admin')",
  [nombre, email.toLowerCase(), hash]
);
console.log("Administrador creado:", email);
process.exit(0);
