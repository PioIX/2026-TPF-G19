export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";


export async function api(ruta, metodo = "GET", cuerpo) {
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  const respuesta = await fetch(`${API_URL}${ruta}`, {
    method: metodo,
    headers: {
      "Content-Type": "application/json",
      "usuario-id": usuario ? usuario.id : "",
    },
    body: cuerpo ? JSON.stringify(cuerpo) : undefined,
  });
  const data = await respuesta.json();

  if (respuesta.status === 401) {
    localStorage.removeItem("usuario");
    window.location.href = "/login";
  }
  if (!respuesta.ok) {
    throw new Error(data.error || "Ocurrió un error");
  }
  return data;
}