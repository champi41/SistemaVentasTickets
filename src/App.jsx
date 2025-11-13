// src/App.jsx
import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import Home from "./pages/Home";
import EventDetail from "./pages/EventDetail";
import Checkout from "./pages/Checkout";
import Purchases from "./pages/Purchases";

import TestMail from "./components/TestMail";
import RandomEventButton from "./components/RandomEventButton";

// Topbar recibe la lista de IDs válidos
function Topbar({ validEventIds }) {
  const nav = useNavigate();

  return (
    <header
      style={{
        display: "flex",
        gap: "2rem",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "1rem",
      }}
    >
      <Link to="/" style={{ textDecoration: "none" }}>
        <h1>TicketNow</h1>
      </Link>

      <nav className="navButtons">
        {/* Evento sorpresa */}
        <RandomEventButton validEventIds={validEventIds} className="nav-btn nav-btn--accent" />

        {/* Ir a eventos */}
        <button
          className="nav-btn"
          onClick={() => nav("/")}
        >
          Eventos
        </button>

        {/* Historial de compras */}
        <button
          className="nav-btn-outline"
          onClick={() => nav("/purchases")}
        >
          Mis compras
        </button>

       
      </nav>
    </header>
  );
}

export default function App() {
  // Estado con los ObjectId de eventos válidos (para el botón random)
  const [eventIds, setEventIds] = useState([]);

  return (
    <BrowserRouter>
      <div className="app">
        {/* Pasamos la lista de IDs al Topbar */}
        <Topbar validEventIds={eventIds} />

        <Routes>
          {/* Pasamos setEventIds a Home (si lo usas dentro) */}
          <Route path="/" element={<Home setEventIds={setEventIds} />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/checkout/:reservation_id" element={<Checkout />} />
          <Route path="/purchases" element={<Purchases />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
