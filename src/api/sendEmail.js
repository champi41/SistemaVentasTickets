const MAIL_URL = import.meta.env.VITE_MAIL_WEBAPP_URL;
const MAIL_TOKEN = import.meta.env.VITE_MAIL_TOKEN;

/**
 * Envía un correo HTML usando Google Apps Script (modo recomendado)
 */
export async function sendTicketEmail({ to, subject, html }) {
  if (!MAIL_URL || !MAIL_TOKEN) {
    console.error("❌ Faltan VITE_MAIL_WEBAPP_URL o VITE_MAIL_TOKEN en .env");
    return;
  }

  try {
    const res = await fetch(MAIL_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: MAIL_TOKEN,
        to,
        subject,
        html,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("❌ Error al enviar correo:", res.status, text);
      throw new Error(`HTTP ${res.status}`);
    }

    const data = await res.json().catch(() => ({}));

    if (!data.success && !data.ok) {
      console.error("⚠️ El servidor no confirmó el envío:", data);
    } else {
      console.log("✅ Correo enviado correctamente a", to);
    }
  } catch (err) {
    console.error("❌ Error al enviar correo:", err);
  }
}
