import React, { useState } from "react";
import { updateEvent } from "../api/api";

function ActualizarEvento() {
  const [eventId, setEventId] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [available, setAvailable] = useState("");
  const [message, setMessage] = useState("");

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const updatedData = {
        name,
        tickets: [
          {
            type: "General",
            price: Number(price),
            available: Number(available),
          },
        ],
      };

      const result = await updateEvent(eventId, updatedData);
      if (result.updated) {
        setMessage("✅ Evento actualizado correctamente");
      } else {
        setMessage("⚠️ No se pudo actualizar el evento");
      }
    } catch (err) {
      setMessage("❌ Error: " + err.message);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-2">Actualizar Evento</h2>
      <form onSubmit={handleUpdate} className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="ID del evento"
          value={eventId}
          onChange={(e) => setEventId(e.target.value)}
          required
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Nuevo nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Nuevo precio (ej: 28000)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Entradas disponibles"
          value={available}
          onChange={(e) => setAvailable(e.target.value)}
          className="border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white rounded p-2 hover:bg-blue-700"
        >
          Actualizar Evento
        </button>
      </form>

      {message && <p className="mt-4 text-center">{message}</p>}
    </div>
  );
}

export default ActualizarEvento;
