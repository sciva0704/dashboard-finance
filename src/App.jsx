import { useState, useEffect } from "react";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

import Navbar from "./components/Navbar1.jsx";
import MenuPrincipal from "./components/Dashboard.jsx";
import SeccionDolares from "./components/SeccionDolares.jsx";
import SeccionAcciones from "./components/SeccionAcciones.jsx";
import SeccionCartera from "./components/SeccionCartera.jsx";
import SeccionCedears from "./components/SeccionCedears.jsx";
import SeccionLecaps from "./components/SeccionLecaps.jsx";

function App() {
  const [user, setUser] = useState(null);
  const [seccion, setSeccion] = useState(() => {
    // 1. Prioridad: Lo que diga la URL (si usás el historial)
    // 2. Segunda opción: El localStorage
    // 3. Por defecto: inicio
    return localStorage.getItem("ultimaSeccion") || "inicio";
  });

  // --- LÓGICA DE AUTENTICACIÓN ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // --- LÓGICA DEL BOTÓN "ATRÁS" DEL NAVEGADOR ---
  useEffect(() => {
    const manejarNavegacionAtras = (event) => {
      if (event.state && event.state.seccion) {
        setSeccion(event.state.seccion);
      } else {
        setSeccion("inicio");
      }
    };

    window.addEventListener("popstate", manejarNavegacionAtras);
    return () => window.removeEventListener("popstate", manejarNavegacionAtras);
  }, []);

  // --- FUNCIÓN PARA NAVEGAR (Sustituye a setSeccion directo) ---
  const navegarA = (nuevaSeccion) => {
    setSeccion(nuevaSeccion);
    localStorage.setItem("ultimaSeccion", nuevaSeccion);
    // Agregamos el paso al historial del navegador
    window.history.pushState({ seccion: nuevaSeccion }, "", "");
  };

  return (
    <div className="bg-slate-900 min-h-screen text-white font-sans selection:bg-emerald-500/30">
      {/* Pasamos navegarA como prop para que Navbar y Dashboard la usen */}
      <Navbar seccionActual={seccion} setSeccion={navegarA} />

      <main className="p-4 md:p-6 max-w-7xl mx-auto animate-in fade-in duration-500">
        {seccion === "inicio" && <MenuPrincipal setSeccion={navegarA} />}
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