import { useState, useEffect } from "react";

export default function SeccionAcciones() {
  const [acciones, setAcciones] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    // Usamos la URL que pasaste. 
    // Nota: Si en el navegador te da error de CORS, podrías necesitar un proxy.
    fetch('https://data912.com/live/arg_stocks') 
      .then(res => res.json())
      .then(data => {
        // Ordenamos por símbolo alfabéticamente
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
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white italic tracking-tight">
            MONITOR <span className="text-blue-500">ACCIONES</span>
          </h2>
          <p className="text-slate-500 text-xs">Datos en tiempo real de data912</p>
        </div>
        
        <input 
          type="text" 
          placeholder="Buscar ticker..." 
          className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500 w-full md:w-64 transition-all"
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto bg-slate-900/50 rounded-xl border border-slate-800 shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-800/40 text-slate-400 text-[10px] uppercase tracking-widest border-b border-slate-800">
              <th className="p-4 font-bold">Activo</th>
              <th className="p-4 font-bold text-right">Último</th>
              <th className="p-4 font-bold text-right">Variación</th>
              <th className="p-4 font-bold text-right">Punta Compra</th>
              <th className="p-4 font-bold text-right">Punta Venta</th>
              <th className="p-4 font-bold text-right">Volumen</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filtradas.map((item) => (
              <tr key={item.symbol} className="hover:bg-blue-500/5 transition-colors group">
                <td className="p-4 font-black text-blue-400 group-hover:text-blue-300">
                  {item.symbol}
                </td>
                <td className="p-4 text-right font-mono font-bold text-white">
                  ${item.c?.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                </td>
                <td className={`p-4 text-right font-bold ${item.pct_change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  <span className="text-[10px] mr-1">{item.pct_change >= 0 ? '▲' : '▼'}</span>
                  {item.pct_change}%
                </td>
                <td className="p-4 text-right text-slate-400 font-mono text-xs">
                  ${item.px_bid?.toLocaleString('es-AR')}
                </td>
                <td className="p-4 text-right text-slate-400 font-mono text-xs">
                  ${item.px_ask?.toLocaleString('es-AR')}
                </td>
                <td className="p-4 text-right text-slate-500 text-xs font-mono">
                  {Math.round(item.v)?.toLocaleString('es-AR')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filtradas.length === 0 && !cargando && (
          <div className="p-20 text-center">
            <p className="text-slate-600 italic">No se encontraron activos que coincidan con la búsqueda.</p>
          </div>
        )}
      </div>
      
      {cargando && (
        <div className="flex flex-col items-center justify-center p-12">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-blue-500 text-sm font-medium animate-pulse">Conectando con el mercado...</p>
        </div>
      )}
    </div>
  );
}