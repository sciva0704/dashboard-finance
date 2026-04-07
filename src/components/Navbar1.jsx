import { useState } from "react";

export default function Navbar({ seccionActual, setSeccion }) {
  const [dropdownAbierto, setDropdownAbierto] = useState(false);

  const cambiarSeccion = (seccion) => {
    setSeccion(seccion);
    setDropdownAbierto(false); // Cerramos el dropdown al elegir
  };

  return (
    <nav className="bg-slate-900 border-b border-slate-800 px-4 py-4">
      <div className="max-w-6xl mx-auto flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
        
        <div onClick={() => setSeccion("inicio")} className="cursor-pointer">
          <h1 className="text-xl font-black tracking-tighter text-white">
            FINANZAS <span className="text-emerald-500">PRO</span>
          </h1>
        </div>

        {/* Botones de Navegación */}
        <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8">
          <button
            onClick={() => setSeccion("precio")}
            className={`text-xs font-black uppercase tracking-widest transition-colors ${seccionActual === "precio" ? "text-emerald-500" : "text-slate-500 hover:text-white"
              }`}
          >
            Dólar
          </button>

          {/* Dropdown de Mercados */}
          <div className="relative">
            <button
              onClick={() => setDropdownAbierto(!dropdownAbierto)}
              className={`text-xs font-black uppercase tracking-widest flex items-center gap-1 ${["acciones", "cedears", "lecaps"].includes(seccionActual) ? "text-emerald-500" : "text-slate-500 hover:text-white"
                }`}
            >
              Mercados
              <svg className={`w-3 h-3 transition-transform ${dropdownAbierto ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {dropdownAbierto && (
              <div className="absolute left-1/2 -translate-x-1/2 md:translate-x-0 md:right-0 mt-3 w-44 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden">
                <button onClick={() => cambiarSeccion("acciones")} className="w-full text-left px-4 py-3 text-[10px] font-black text-slate-300 hover:bg-slate-700 hover:text-white border-b border-slate-700/50 uppercase">ACCIONES</button>
                <button onClick={() => cambiarSeccion("cedears")} className="w-full text-left px-4 py-3 text-[10px] font-black text-slate-300 hover:bg-slate-700 hover:text-white border-b border-slate-700/50 uppercase">CEDEARS</button>
                <button onClick={() => cambiarSeccion("lecaps")} className="w-full text-left px-4 py-3 text-[10px] font-black text-slate-300 hover:bg-slate-700 hover:text-white uppercase">RENTA FIJA</button>
              </div>
            )}
          </div>

          <button
            onClick={() => setSeccion("cartera")}
            className={`text-xs font-black uppercase tracking-widest transition-colors ${seccionActual === "cartera" ? "text-emerald-500" : "text-slate-500 hover:text-white"
              }`}
          >
            Cartera
          </button>
        </div>
      </div>
    </nav>
  );
}