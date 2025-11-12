// src/components/TestMail.jsx
import { sendTicketEmail } from "../api/sendEmail";

export default function TestMail() {
  const probar = async () => {
    try {
      await sendTicketEmail({
        to: "TU_CORREO@gmail.com",
        subject: "🧾 Prueba de TicketNow",
        html: "<h1>¡Correo de prueba!</h1><p>Esto viene desde Apps Script y tu React.</p>",
      });
      alert("Correo enviado correctamente ✅");
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <button
      onClick={probar}
      style={{
        backgroundColor: "#4CAF50",
        color: "white",
        border: "none",
        padding: "8px 16px",
        borderRadius: "6px",
        cursor: "pointer",
      }}
    >
      Probar correo
    </button>
  );
}
