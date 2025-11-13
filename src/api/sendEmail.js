// src/api/sendEmail.js

const WEBHOOK = import.meta.env.VITE_MAIL_WEBHOOK;
const TOKEN = import.meta.env.VITE_MAIL_TOKEN;

/**
 * Envía un correo con las entradas usando el Apps Script.
 * No lanzamos error si el fetch falla (modo no-cors), sólo logueamos.
 */
export async function sendTicketEmail({ to, subject, html }) {
  if (!WEBHOOK || !TOKEN) {
    console.error("❌ Faltan VITE_MAIL_WEBHOOK o VITE_MAIL_TOKEN en .env");
    return;
  }

  try {
    const url = `${WEBHOOK}?token=${encodeURIComponent(TOKEN)}`;

    await fetch(url, {
      method: "POST",
      mode: "no-cors", // importante para que el navegador no bloquee por CORS
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to,
        subject,
        html,
      }),
    });

    // En no-cors no podemos leer la respuesta, asumimos OK si no explota el fetch.
    console.log("✅ Petición de envío de correo enviada al webhook");
  } catch (err) {
    console.error("❌ Error al llamar al webhook de correo:", err);
  }
}
