import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

export const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || "2026_5INF_G19",
  password: process.env.DB_PASSWORD || "grupo19",
  database: process.env.DB_NAME || "2026_5INF_G19",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

pool
  .getConnection()
  .then((conn) => {
    console.log("Conectado a MySQL correctamente");
    conn.release();
  })
  .catch((err) => {
    console.error("No se pudo conectar a MySQL:", err.message);
  });

export async function query(sql, params = []) {
  const [resultado] = await pool.execute(sql, params);
  return resultado;
}
