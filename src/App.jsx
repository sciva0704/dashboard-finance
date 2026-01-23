import { useState } from "react";
import Navbar from "./components/Navbar1.jsx";
import SeccionDolares from "./components/SeccionDolares.jsx";
import SeccionAcciones from "./components/SeccionAcciones.jsx";
// import SeccionAcciones from "./components/SeccionAcciones.jsx";

function App() {
  const [seccion, setSeccion] = useState("precio");

  return (
    <div className="bg-slate-900 min-h-screen text-white">
      <Navbar seccionActual={seccion} setSeccion={setSeccion} />

      <main className="p-6">
        {seccion === "precio" && <SeccionDolares />}
        {seccion === "acciones" && <SeccionAcciones />}
      </main>
    </div>
  );
}

export default App;