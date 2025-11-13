// src/App.jsx
import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import Home from "./pages/Home";
import EventDetail from "./pages/EventDetail";
import Checkout from "./pages/Checkout";
import Purchases from "./pages/Purchases";

import TestMail from "./components/TestMail";
import RandomEventButton from "./components/RandomEventButton";

// ---- Botón de modo nocturno ----
function DarkModeButton() {
  const [dark, setDark] = useState(() => {
    // Leer preferencia guardada
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    // Aplicar clase global al body
    if (dark) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return (
    <button
      className="nav-btn"
      onClick={() => setDark((d) => !d)}
      title="Cambiar modo nocturno"
      style={{ fontSize: "1.2rem" }}
    >
      {dark ? "🌙" : "☀️"}
    </button>
  );
}

// ---- Topbar ----
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

      <nav className="navButtons" style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <RandomEventButton validEventIds={validEventIds} className="nav-btn nav-btn--accent" />

        <button className="nav-btn" onClick={() => nav("/")}>
          Eventos
        </button>

        {/* 🌙 Botón de modo nocturno */}
        <DarkModeButton />

        <button className="nav-btn-outline" onClick={() => nav("/purchases")}>
          Mis compras
        </button>
      </nav>
    </header>
  );
}

// ---- App principal ----
export default function App() {
  const [eventIds, setEventIds] = useState([]);

  return (
    <BrowserRouter>
      <div className="app">
        <Topbar validEventIds={eventIds} />

        <Routes>
          <Route path="/" element={<Home setEventIds={setEventIds} />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/checkout/:reservation_id" element={<Checkout />} />
          <Route path="/purchases" element={<Purchases />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
