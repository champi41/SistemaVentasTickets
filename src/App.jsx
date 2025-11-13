// src/App.jsx
import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import { useState } from "react"; // 👈 1. Importar useState
import Home from "./pages/Home";
import EventDetail from "./pages/EventDetail";
import Checkout from "./pages/Checkout";
import TestMail from "./components/TestMail";
import RandomEventButton from "./components/RandomEventButton"; // 2. Importar el botón

// 3. Topbar ahora recibe la lista de IDs como prop
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
        <h1>🎫 TicketNow</h1>
      </Link>
      <nav style={{ display: "flex", gap: "1rem" }}>
        {/* 4. Incluir y pasar la lista de IDs al botón random */}
        <RandomEventButton validEventIds={validEventIds} /> 
        <button onClick={() => nav("/")}>Eventos</button>
        <TestMail />
      </nav>
    </header>
  );
}

export default function App() {
  // 5. Crear el estado para almacenar los ObjectIds válidos
  const [eventIds, setEventIds] = useState([]); 

  return (
    <BrowserRouter>
      <div className="app">
        {/* 6. Pasar la lista de IDs al Topbar */}
        <Topbar validEventIds={eventIds} /> 
        <Routes>
          {/* 7. Pasar la función para actualizar el estado a Home */}
          <Route path="/" element={<Home setEventIds={setEventIds} />} /> 
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/checkout/:reservation_id" element={<Checkout />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
