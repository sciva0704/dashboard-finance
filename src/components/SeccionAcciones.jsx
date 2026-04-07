import { useState, useEffect } from "react";
// IMPORTANTE: Asegurate de que estos archivos existan en la misma carpeta
import GraficoTrading from "./GraficoTrading.jsx"; 
// import ChatIA from "./ChatIA.jsx";

export default function SeccionAcciones() {
  const [acciones, setAcciones] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);
  const [tickerSeleccionado, setTickerSeleccionado] = useState(null);

  useEffect(() => {
    fetch('https://data912.com/live/arg_stocks')
      .then(res => res.json())
      .then(data => {
        const ordenados = data.sort((a, b) => a.symbol.localeCompare(b.symbol));
        setAcciones(ordenados);
        setCargando(false);
      })
      .catch(err => {
        console.error("Error al conectar con la API:", err);
        setCargando(false);
      });
  }, []);

  const filtradas = acciones.filter(a =>
    a.symbol?.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
      {/* HEADER Y BUSCADOR */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">
            MONITOR <span className="text-blue-500">ACCIONES</span>
          </h2>
          <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">Datos en tiempo real</p>
        </div>

        <input
          type="text"
          placeholder="Buscar ticker (ej: GGAL)..."
          className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64 transition-all"
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      {/* TABLA DE PRECIOS */}
      <div className="overflow-x-auto bg-slate-900/50 rounded-2xl border border-slate-800 shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-800/40 text-slate-400 text-[10px] uppercase tracking-widest border-b border-slate-800">
              <th className="p-4 font-bold">Activo</th>
              <th className="p-4 font-bold text-right">Último</th>
              <th className="p-4 font-bold text-right">Variación</th>
              <th className="p-4 font-bold text-right hidden md:table-cell">Volumen</th>
              <th className="p-4 font-bold text-center">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filtradas.map((item) => (
              <tr key={item.symbol} className={`hover:bg-blue-500/5 transition-colors group ${tickerSeleccionado === `BCBA:${item.symbol}` ? 'bg-blue-500/10' : ''}`}>
                <td className="p-4 font-black text-blue-400">{item.symbol}</td>
                <td className="p-4 text-right font-mono font-bold text-white">
                  ${item.c?.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                </td>
                <td className={`p-4 text-right font-bold ${item.pct_change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {item.pct_change}%
                </td>
                <td className="p-4 text-right text-slate-500 text-xs font-mono hidden md:table-cell">
                  {Math.round(item.v)?.toLocaleString('es-AR')}
                </td>
                <td className="p-4 text-center">
                  <button 
                    onClick={() => setTickerSeleccionado(`BCBA:${item.symbol}`)}
                    className="text-[10px] bg-blue-500 hover:bg-blue-400 text-slate-950 font-black px-3 py-1 rounded-lg uppercase transition-all"
                  >
                    Analizar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PANEL DE IA Y TRADINGVIEW (Solo se muestra si hay un ticker seleccionado) */}
      {tickerSeleccionado && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
          <div className="lg:col-span-2">
            <GraficoTrading ticker={tickerSeleccionado} />
          </div>
          {/* <div className="lg:col-span-1">
            <ChatIA tickerActual={tickerSeleccionado} />
          </div> */}
        </div>
      )}

      {/* MENSAJE CUANDO NO HAY RESULTADOS */}
      {filtradas.length === 0 && !cargando && (
        <div className="p-20 text-center bg-slate-900/20 rounded-3xl border-2 border-dashed border-slate-800">
          <p className="text-slate-600 font-bold uppercase text-xs tracking-widest">Sin resultados</p>
        </div>
      )}

      {/* LOADER */}
      {cargando && (
        <div className="flex flex-col items-center justify-center p-12">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-blue-500 text-xs font-black uppercase tracking-widest animate-pulse">Sincronizando BCBA...</p>
        </div>
      )}
    </div>
  );
}