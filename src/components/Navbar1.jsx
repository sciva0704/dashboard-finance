import { useState } from "react";

export default function Navbar({ seccionActual, setSeccion }) {
  const [dropdownAbierto, setDropdownAbierto] = useState(false);

  // Función para cambiar de sección y cerrar el menú
  const cambiarSeccion = (nombre) => {
    setSeccion(nombre);
    setDropdownAbierto(false);
  };

  return (
    <nav className="bg-slate-800 border-b border-slate-700 px-6 py-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <h1 className="text-xl font-black text-blue-500 tracking-tighter">
          FINANZAS <span className="text-white">2026</span>
        </h1>

        <div className="flex gap-6 items-center">
          {/* Botón Dólar */}
          <button
            onClick={() => setSeccion("precio")}
            className={`text-sm font-bold ${seccionActual === "precio" ? "text-blue-400" : "text-slate-400 hover:text-white"}`}
          >
            Dólar
          </button>

          {/* DROPDOWN COTIZACIONES */}
          <div className="relative">
            <button
              onClick={() => setDropdownAbierto(!dropdownAbierto)}
              className={`text-sm font-bold flex items-center gap-1 ${
                ["acciones", "cedears", "lecaps"].includes(seccionActual) ? "text-blue-400" : "text-slate-400 hover:text-white"
              }`}
            >
              Cotizaciones
              <svg className={`w-4 h-4 transition-transform ${dropdownAbierto ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Menú Desplegable */}
            {dropdownAbierto && (
              <div className="absolute right-0 mt-2 w-40 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden">
                <button
                  onClick={() => cambiarSeccion("acciones")}
                  className="w-full text-left px-4 py-3 text-xs font-bold text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                >
                  Acciones
                </button>
                <button
                  onClick={() => cambiarSeccion("cedears")}
                  className="w-full text-left px-4 py-3 text-xs font-bold text-slate-300 hover:bg-slate-700 hover:text-white transition-colors border-t border-slate-700"
                >
                  CEDEARs
                </button>
                <button
                  onClick={() => cambiarSeccion("lecaps")}
                  className="w-full text-left px-4 py-3 text-xs font-bold text-slate-300 hover:bg-slate-700 hover:text-white transition-colors border-t border-slate-700"
                >
                  LECAPs
                </button>
              </div>
            )}
          </div>

          {/* Botón Cartera */}
          <button
            onClick={() => setSeccion("cartera")}
            className={`text-sm font-bold ${seccionActual === "cartera" ? "text-emerald-400" : "text-slate-400 hover:text-white"}`}
          >
            Mi Cartera
          </button>
        </div>
      </div>
    </nav>
  );
}