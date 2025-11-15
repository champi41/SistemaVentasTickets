// src/App.jsx
import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import Home from "./pages/Home";
import EventDetail from "./pages/EventDetail";
import Checkout from "./pages/Checkout";
import Purchases from "./pages/Purchases";

import RandomEventButton from "./components/RandomEventButton";
import ThemeSwitch from "./components/ThemeSwitch";
import Loader from "./components/Loader"; // ⬅ loader morado

// ---- Topbar ----
function Topbar({ validEventIds }) {
  const nav = useNavigate();

  return (
    <header className="topbar">
      <Link to="/" style={{ textDecoration: "none" }}>
        {/* wrapper para título + loader */}
        <div className="topbar-brand">
          <h1 className="neon-title">TicketNow</h1>
          <Loader /> {/* ticket girando */}
        </div>
      </Link>

      <nav className="navButtons">
        

        <button className="nav-btn" onClick={() => nav("/")}>
          Eventos
        </button>
        <button className="nav-btn-outline" onClick={() => nav("/purchases")}>
          Compras
        </button>
        <ThemeSwitch />
        
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
