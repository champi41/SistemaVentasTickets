import { useState } from "react";
import { createEvent } from "../api/api";

function CrearEvento({ onEventoCreado }) {
  const [form, setForm] = useState({
    name: "",
    category: "",
    date: "",
    location: "",
    image: "",
    tickets: [
      { type: "", price: "", available: "" },
    ],
  });

  const [mensaje, setMensaje] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleTicketChange = (index, field, value) => {
    const nuevosTickets = [...form.tickets];
    nuevosTickets[index][field] = value;
    setForm({ ...form, tickets: nuevosTickets });
  };

  const agregarTicket = () => {
    setForm({
      ...form,
      tickets: [...form.tickets, { type: "", price: "", available: "" }],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createEvent({
        ...form,
        tickets: form.tickets.map((t) => ({
          type: t.type,
          price: parseFloat(t.price),
          available: parseInt(t.available),
        })),
      });
      setMensaje("✅ Evento creado correctamente");
      setForm({
        name: "",
        category: "",
        date: "",
        location: "",
        image: "",
        tickets: [{ type: "", price: "", available: "" }],
      });
      if (onEventoCreado) onEventoCreado();
    } catch {
      setMensaje("❌ Error al crear evento");
    }
  };

  return (
    <div style={{ marginBottom: "2rem" }}>
      <h2>🆕 Crear Evento</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Nombre del evento"
          required
        />
        <input
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="Categoría"
          required
        />
        <input
          type="datetime-local"
          name="date"
          value={form.date}
          onChange={handleChange}
          required
        />
        <input
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder="Ubicación"
          required
        />
        <input
          name="image"
          value={form.image}
          onChange={handleChange}
          placeholder="URL de imagen"
          required
        />

        <h4>Tickets</h4>
        {form.tickets.map((ticket, i) => (
          <div key={i}>
            <input
              placeholder="Tipo"
              value={ticket.type}
              onChange={(e) => handleTicketChange(i, "type", e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Precio"
              value={ticket.price}
              onChange={(e) => handleTicketChange(i, "price", e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Disponibles"
              value={ticket.available}
              onChange={(e) => handleTicketChange(i, "available", e.target.value)}
              required
            />
          </div>
        ))}
        <button type="button" onClick={agregarTicket}>+ Agregar ticket</button>
        <br /><br />
        <button type="submit">Crear evento</button>
      </form>
      {mensaje && <p>{mensaje}</p>}
    </div>
  );
}

export default CrearEvento;
