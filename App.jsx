import { useState } from "react";
import Eventos from "./components/Eventos";
function App() {
  const EVENTOS = [
    { id: 1, nombre: "Evento 1", tipo1: 50, tipo2: 60, tipo3: 70 },
    { id: 2, nombre: "Evento 2", tipo1: 50, tipo2: 60, tipo3: 70 },
    { id: 3, nombre: "Evento 3", tipo1: 50, tipo2: 60, tipo3: 70 },
    { id: 4, nombre: "Evento 4", tipo1: 50, tipo2: 60, tipo3: 70 },
  ];
  return (
    <>
      <Eventos eventos={EVENTOS} />
    </>
  );
}

export default App;
