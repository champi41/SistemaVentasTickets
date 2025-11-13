import { useEffect, useState } from "react";
import Home from "./components/Home";
import Reservas from "./components/Reservas";
import Checkout from "./components/Checkout";

const VISTAS = {
  HOME: "home",
  CHECKOUT: "checkout",
  RESERVAS: "reservas",
};
function App() {
  const [activeVista, setActiveVista] = useState(VISTAS.HOME);
  const renderActiveView = () => {
    switch (activeVista) {
      case VISTAS.HOME:
        return <Home></Home>;
      case VISTAS.CHECKOUT:
        return <Checkout></Checkout>;
      case VISTAS.RESERVAS:
        return <Reservas></Reservas>;
      default:
        return <Home></Home>;
    }
  };

  return (
    <>
      <header>
        <h1>TicketNow</h1>
        <div className="vistas">
          <button
            onClick={() => setActiveVista(VISTAS.HOME)}
            className={activeVista === VISTAS.HOME ? "activo" : ""}
          >
            Home
          </button>
          <button
            onClick={() => setActiveVista(VISTAS.CHECKOUT)}
            className={activeVista === VISTAS.CHECKOUT ? "activo" : ""}
          >
            Checkout
          </button>
          <button
            onClick={() => setActiveVista(VISTAS.RESERVAS)}
            className={activeVista === VISTAS.RESERVAS ? "activo" : ""}
          >
            Reservas
          </button>
        </div>
      </header>
      <div className="main">{renderActiveView()}</div>
    </>
  );
}

export default App;
