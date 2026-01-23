import { useState, useEffect } from "react";

export default function SeccionAcciones() {
  const [acciones, setAcciones] = useState([]);
  const [cargando, setCargando] = useState(true);

useEffect(() => {
    // Probamos con esta ruta que suele ser más estable
    fetch('https://dolarapi.com/v1/cotizaciones/acciones')
      .then(res => {
        if (!res.ok) throw new Error("Error al conectar con la API");
        return res.json();
      })
      .then(data => {
        console.log("Acciones recibidas:", data);
        setAcciones(data);
        setCargando(false);
      })
      .catch(err => {
        console.error("Fallo total de la API:", err);
        setCargando(false);
      });
  }, []);

  if (cargando) return <p className="text-center p-10 text-slate-400 animate-pulse">Consultando al Merval...</p>;

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-blue-400 ml-2">Acciones Panel Líder 📈</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {acciones.map((accion) => (
          <div key={accion.simbolo} className="bg-slate-800 p-5 rounded-xl border border-slate-700 shadow-md">
            <div className="flex justify-between items-start mb-2">
              <span className="bg-blue-900/50 text-blue-300 text-xs font-bold px-2 py-1 rounded">
                MERVAL
              </span>
              <span className={`text-xs font-bold ${accion.variacion >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {accion.variacion >= 0 ? '▲' : '▼'} {accion.variacion}%
              </span>
            </div>
            
            <h3 className="text-xl font-bold text-white mb-1">{accion.simbolo}</h3>
            <p className="text-slate-400 text-xs mb-3 truncate">{accion.nombre}</p>
            
            <div className="flex justify-between items-end">
              <div>
                <p className="text-slate-500 text-[10px] uppercase font-semibold">Último Precio</p>
                <p className="text-2xl font-mono font-bold text-white">
                  ${accion.ultimoPrecio.toLocaleString('es-AR')}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}