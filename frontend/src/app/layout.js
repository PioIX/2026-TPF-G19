import { Bebas_Neue, Poppins } from "next/font/google";
import "./globals.css";

const titulo = Bebas_Neue({ weight: "400", subsets: ["latin"], variable: "--font-titulo" });
const texto = Poppins({ weight: ["400", "600"], subsets: ["latin"], variable: "--font-texto" });

export const metadata = {
  title: "Draft XI Mundial",
  description: "Armá tu once ideal con plantillas históricas de los Mundiales",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${titulo.variable} ${texto.variable}`}>
      <body>{children}</body>
    </html>
  );
}
