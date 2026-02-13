import { useState, useEffect } from "react";

// Componente de encabezado afuera para cumplir con las reglas de ESLint
const ThOrdenable = ({ label, sortKey, align = "text-right", sortConfig, solicitarOrden }) => (
  <th
    className={`p-5 cursor-pointer hover:text-emerald-400 transition-colors ${align} group`}
    onClick={() => solicitarOrden(sortKey)}
  >
    <div className={`flex items-center gap-1 ${align === "text-right" ? "justify-end" : "justify-start"}`}>
      {label}
      <span className="text-[8px] opacity-40 group-hover:opacity-100 transition-opacity">
        {sortConfig.key === sortKey ? (sortConfig.direction === 'asc' ? '▲' : '▼') : '⇅'}
      </span>
    </div>
  </th>
);

export default function SeccionLecaps() {
  const [datos, setDatos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);
  const [filtroActivo, setFiltroActivo] = useState("LECAPS/BONCAPS");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  useEffect(() => {
    const apiNotes = fetch('https://data912.com/live/arg_notes').then(res => res.json());
    const apiBonds = fetch('https://data912.com/live/arg_bonds').then(res => res.json());

    Promise.all([apiNotes, apiBonds])
      .then(([notes, bonds]) => {
        const unificado = [...notes, ...bonds];
        setDatos(unificado);
        setCargando(false);
      })
      .catch(() => setCargando(false));
  }, []);

  const calcularDiasAlVencimiento = (ticker) => {
    const mesesMap = {
      'E': 0, 'F': 1, 'M': 2, 'A': 3, 'Y': 4, 'J': 5,
      'L': 6, 'G': 7, 'S': 8, 'O': 9, 'N': 10, 'D': 11
    };
    const match = ticker.match(/^[ST](\d{2})([A-Z])(\d{1})$/);
    if (!match) return null;

    const dia = parseInt(match[1]);
    const mes = mesesMap[match[2]];
    const año = 2020 + parseInt(match[3]);
    if (mes === undefined) return null;

    const fechaVencimiento = new Date(año, mes, dia);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    fechaVencimiento.setHours(0, 0, 0, 0);

    const diferenciaMs = fechaVencimiento - hoy;
    return Math.ceil(diferenciaMs / (1000 * 60 * 60 * 24));
  };

  const obtenerTipo = (symbol) => {
    // 1. Identificación estricta para etiquetas específicas
    if (/^[S](\d{2})([A-Z])(\d{1})$/.test(symbol)) return "LECAP";
    if (symbol.startsWith('TZX')) return "BONCER";
    if (/^[T](\d{2})([A-Z])(\d{1})$/.test(symbol)) return "BONCAP";

    // 2. Filtro de "Desechados" (Cosas que NO querés ver bajo ninguna circunstancia)
    // Agregá acá tickers técnicos o basura que mande la API y no te sirva
    const desechados = ["BASURA1", "NULL", "ERROR"];
    if (desechados.includes(symbol)) return "DESECHADO";

    // 3. TODO lo demás cae en BONOS
    return "BONOS";
  };

  const solicitarOrden = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filtradosYOrdenados = [...datos]
    .filter(a => {
      const tipo = obtenerTipo(a.symbol);
      const coincideBusqueda = a.symbol?.toLowerCase().includes(busqueda.toLowerCase());

      // Si es algo que marcamos como desechado, no pasa el filtro
      if (tipo === "DESECHADO") return false;

      if (filtroActivo === "LECAPS/BONCAPS") {
        return coincideBusqueda && (tipo === "LECAP" || tipo === "BONCAP");
      }
      if (filtroActivo === "BONCER") {
        return coincideBusqueda && (tipo === "BONCER");
      }
      if (filtroActivo === "BONOS") {
        return coincideBusqueda && tipo === "BONOS";
      }
      return coincideBusqueda;
    })
    .sort((a, b) => {
      if (!sortConfig.key) return 0;
      let valA, valB;
      if (sortConfig.key === 'dias') {
        valA = calcularDiasAlVencimiento(a.symbol);
        valB = calcularDiasAlVencimiento(b.symbol);
        if (valA === null) return 1;
        if (valB === null) return -1;
      } else {
        valA = a[sortConfig.key];
        valB = b[sortConfig.key];
      }
      if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 text-center md:text-left">
        <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase">
          MONITOR <span className="text-emerald-500">LECAPS Y BONOS</span>
        </h2>
        <input
          type="text"
          placeholder="Buscar ticker..."
          className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full md:w-64 transition-all"
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-6">
        {["LECAPS/BONCAPS", "BONCER", "BONOS"].map((btn) => (
          <button
            key={btn}
            onClick={() => setFiltroActivo(btn)}
            className={`px-4 py-2 rounded-lg text-[10px] font-black tracking-widest transition-all uppercase border ${filtroActivo === btn
                ? "bg-emerald-500 border-emerald-500 text-slate-900 shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                : "bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500"
              }`}
          >
            {btn}
          </button>
        ))}
      </div>

      {cargando ? (
        <div className="flex justify-center p-20">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="overflow-x-auto bg-slate-900/50 rounded-2xl border border-slate-800 shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-800/40 text-slate-500 text-[10px] uppercase tracking-widest border-b border-slate-800">
                <ThOrdenable label="Activo" sortKey="symbol" align="text-left" sortConfig={sortConfig} solicitarOrden={solicitarOrden} />
                <ThOrdenable label="Días" sortKey="dias" sortConfig={sortConfig} solicitarOrden={solicitarOrden} />
                <ThOrdenable label="Precio ($)" sortKey="c" sortConfig={sortConfig} solicitarOrden={solicitarOrden} />
                <ThOrdenable label="Variación" sortKey="pct_change" sortConfig={sortConfig} solicitarOrden={solicitarOrden} />
                <ThOrdenable label="Venta" sortKey="px_ask" sortConfig={sortConfig} solicitarOrden={solicitarOrden} />
                <ThOrdenable label="Volumen" sortKey="v" sortConfig={sortConfig} solicitarOrden={solicitarOrden} />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtradosYOrdenados.map((item) => {
                const tipo = obtenerTipo(item.symbol);
                const dias = calcularDiasAlVencimiento(item.symbol);
                const colorTipo = tipo === "LECAP" ? "text-emerald-400" : tipo === "BONCER" ? "text-orange-400" : tipo === "BONCAP" ? "text-blue-400" : "text-slate-500";

                return (
                  <tr key={item.symbol} className="hover:bg-white/5 transition-colors group">
                    <td className="p-5">
                      <span className="text-white font-black block">{item.symbol}</span>
                      <span className={`text-[9px] font-bold uppercase ${colorTipo}`}>{tipo}</span>
                    </td>
                    <td className="p-5 text-right font-mono font-bold">
                      {dias !== null ? (
                        <span className={dias < 15 ? "text-rose-500" : "text-white"}>
                          {dias} <span className="text-[10px] text-slate-500 font-normal">d</span>
                        </span>
                      ) : (
                        <span className="text-slate-600">-</span>
                      )}
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
        </div>
      )}
    </div>
  );
}