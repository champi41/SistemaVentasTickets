const EMAIL_GATEWAY_URL = import.meta.env.VITE_EMAIL_GATEWAY_URL;
const EMAIL_GATEWAY_TOKEN = import.meta.env.VITE_EMAIL_GATEWAY_TOKEN;

// Versión sin CORS: asumimos éxito si no hay excepción de red
export async function sendTicketEmail({ to, subject, html }) {
  const url = `${EMAIL_GATEWAY_URL}?token=${encodeURIComponent(EMAIL_GATEWAY_TOKEN)}`;

  try {
    await fetch(url, {
      method: "POST",
      // Apps Script acepta JSON aunque declares text/plain; evita preflight
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ to, subject, html }),
      mode: "no-cors", // 👈 clave: el navegador no exige CORS
    });

    // No podemos leer la respuesta (opaque). Lo tomamos como éxito.
    return { ok: true, opaque: true };
  } catch (err) {
    // Solo caerás aquí si hay error de red/DNS
    throw new Error("No se pudo contactar al Web App de Apps Script");
  }
}
