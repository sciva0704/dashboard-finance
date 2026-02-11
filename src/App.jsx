import { useState, useEffect } from "react"; // Agregamos useEffect
import Navbar from "./components/Navbar1.jsx";
import SeccionDolares from "./components/SeccionDolares.jsx";
import SeccionAcciones from "./components/SeccionAcciones.jsx";
import SeccionCartera from "./components/SeccionCartera.jsx";
import SeccionCedears from "./components/SeccionCedears.jsx";
import SeccionLecaps from "./components/SeccionLecaps.jsx";

function App() {
  // 1. Al arrancar, intentamos leer la pestaña guardada. Si no hay, usamos "precio"
  const [seccion, setSeccion] = useState(() => {
    return localStorage.getItem("ultimaSeccion") || "precio";
  });

  // 2. Cada vez que 'seccion' cambie, guardamos el valor en el navegador
  useEffect(() => {
    localStorage.setItem("ultimaSeccion", seccion);
  }, [seccion]);

  return (
    <div className="bg-slate-900 min-h-screen text-white">
      <Navbar seccionActual={seccion} setSeccion={setSeccion} />

      <main className="p-6">
        {seccion === "precio" && <SeccionDolares />}
        {seccion === "acciones" && <SeccionAcciones />}
        {seccion === "lecaps" && <SeccionLecaps />}
        {seccion === "cedears" && <SeccionCedears />}
        {seccion === "cartera" && <SeccionCartera />}
      </main>
    </div>
  );
}

export default App;
