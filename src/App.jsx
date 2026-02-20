import { useState, useEffect } from "react";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

import Navbar from "./components/Navbar1.jsx";
import SeccionDolares from "./components/SeccionDolares.jsx";
import SeccionAcciones from "./components/SeccionAcciones.jsx";
import SeccionCartera from "./components/SeccionCartera.jsx";
import SeccionCedears from "./components/SeccionCedears.jsx";
import SeccionLecaps from "./components/SeccionLecaps.jsx";

function App() {
  const [user, setUser] = useState(null);

  // Escuchar cambios de autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const [seccion, setSeccion] = useState(() => {
    return localStorage.getItem("ultimaSeccion") || "precio";
  });

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
        {seccion === "cartera" && <SeccionCartera user={user} />}
      </main>
    </div>
  );
}

export default App;