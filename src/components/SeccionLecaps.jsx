import { useState, useEffect } from "react";

export default function SeccionLecaps() {
  const [datos, setDatos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);
  const [filtroActivo, setFiltroActivo] = useState("TODO"); // Estado para los botones

  useEffect(() => {
    const apiNotes = fetch('https://data912.com/live/arg_notes').then(res => res.json());
    const apiBonds = fetch('https://data912.com/live/arg_bonds').then(res => res.json());

    Promise.all([apiNotes, apiBonds])
      .then(([notes, bonds]) => {
        const unificado = [...notes, ...bonds];
        const ordenados = unificado.sort((a, b) => a.symbol.localeCompare(b.symbol));
        setDatos(ordenados);
        setCargando(false);
      })
      .catch(() => setCargando(false));
  }, []);

  // Lógica de identificación estricta
  const obtenerTipo = (symbol) => {
    if (symbol.startsWith('S')) return "LECAP";
    if (symbol.startsWith('TZX')) return "BONCER";
    // BONCAP Estricto: Empieza con T, el segundo caracter es número y no tiene doble T
    if (symbol.startsWith('T') && !symbol.startsWith('TT') && !symbol.startsWith('TZX') && /\d/.test(symbol[1])) {
      return "BONCAP";
    }
    return "BONOS";
  };

  // Filtrado Maestro
  const filtrados = datos.filter(a => {
    const tipo = obtenerTipo(a.symbol);
    const coincideBusqueda = a.symbol?.toLowerCase().includes(busqueda.toLowerCase());
    
    if (filtroActivo === "TODO") return coincideBusqueda;
    if (filtroActivo === "LECAPS/BONCAPS") return coincideBusqueda && (tipo === "LECAP" || tipo === "BONCAP");
    if (filtroActivo === "BONCER") return coincideBusqueda && tipo === "BONCER";
    if (filtroActivo === "BONOS") return coincideBusqueda && tipo === "BONOS";
    
    return coincideBusqueda;
  });

  const botones = ["TODO", "LECAPS/BONCAPS", "BONCER", "BONOS"];

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase">
          MONITOR <span className="text-emerald-500">RENTA FIJA</span>
        </h2>
        
        <input 
          type="text" 
          placeholder="Buscar ticker..." 
          className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full md:w-64 transition-all"
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      {/* BOTONES DE FILTRO */}
      <div className="flex flex-wrap gap-2 mb-6">
        {botones.map((btn) => (
          <button
            key={btn}
            onClick={() => setFiltroActivo(btn)}
            className={`px-4 py-2 rounded-lg text-[10px] font-black tracking-widest transition-all uppercase border ${
              filtroActivo === btn 
                ? "bg-emerald-500 border-emerald-500 text-slate-900 shadow-[0_0_15px_rgba(16,185,129,0.4)]" 
                : "bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500"
            }`}
          >
            {btn}
          </button>
        ))}
      </div>

      {cargando ? (
        <div className="flex flex-col items-center justify-center p-20 animate-pulse">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        </div>
      ) : (
        <div className="overflow-x-auto bg-slate-900/50 rounded-2xl border border-slate-800 shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-800/40 text-slate-500 text-[10px] uppercase tracking-widest border-b border-slate-800">
                <th className="p-5">Activo</th>
                <th className="p-5 text-right">Precio ($)</th>
                <th className="p-5 text-right">Variación</th>
                <th className="p-5 text-right">Venta</th>
                <th className="p-5 text-right">Volumen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtrados.map((item) => {
                const tipo = obtenerTipo(item.symbol);
                const colorTipo = tipo === "LECAP" ? "text-emerald-400" : tipo === "BONCER" ? "text-orange-400" : tipo === "BONCAP" ? "text-blue-400" : "text-slate-500";
                
                return (
                  <tr key={item.symbol} className="hover:bg-white/5 transition-colors group">
                    <td className="p-5">
                      <span className="text-white font-black block">{item.symbol}</span>
                      <span className={`text-[9px] font-bold uppercase ${colorTipo}`}>{tipo}</span>
                    </td>
                    <td className="p-5 text-right font-mono font-bold text-white">
                      {item.c?.toLocaleString('es-AR', { minimumFractionDigits: 3 })}
                    </td>
                    <td className={`p-5 text-right font-bold ${item.pct_change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {item.pct_change}%
                    </td>
                    <td className="p-5 text-right text-slate-400 font-mono text-xs">
                      {item.px_ask?.toLocaleString('es-AR', { minimumFractionDigits: 3 })}
                    </td>
                    <td className="p-5 text-right text-slate-500 text-xs font-mono">
                      {item.v > 1000000 ? `${(item.v / 1000000).toFixed(1)}M` : item.v?.toLocaleString('es-AR')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtrados.length === 0 && (
            <div className="p-20 text-center text-slate-600 italic text-sm">No hay activos en esta categoría.</div>
          )}
        </div>
      )}
    </div>
  );
}