import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import EventDetail from "./pages/EventDetail";
import Checkout from "./pages/Checkout";

function Topbar() {
  const nav = useNavigate();
  return (
    <header style={{ display:"flex",gap:"2rem",alignItems:"center",justifyContent:"space-between" }}>
      <Link to="/" style={{ textDecoration:"none" }}><h1>🎫 TicketNow</h1></Link>
      <nav style={{ display:"flex", gap:"1rem" }}>
        <button onClick={() => nav("/")}>Eventos</button>
        {/* Historial eliminado */}
      </nav>
    </header>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Topbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/checkout/:reservation_id" element={<Checkout />} />
          {/* <Route path="/purchases" element={<Purchases />} /> ← eliminado */}
        </Routes>
      </div>
    </BrowserRouter>
  );
}
