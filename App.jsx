import { useState } from "react";
import Eventos from "./components/Eventos";
function App() {

  const EVENTOS = [
    { id: 1, nombre: "Evento 1", precio: 50 },
    { id: 2, nombre: "Evento 2", precio: 45 },
    { id: 3, nombre: "Evento 3", precio: 55 },
    { id: 4, nombre: "Evento 4", precio: 60 },
  ];
  return (
    <>
      <Eventos eventos={EVENTOS} />
    </>
  );
}

export default App;
