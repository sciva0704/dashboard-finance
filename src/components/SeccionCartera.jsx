import { useState, useEffect } from "react";

export default function SeccionCartera() {
  // 1. Estado para almacenar las inversiones
  const [activos, setActivos] = useState(() => {
    const guardados = localStorage.getItem("misInversiones");
    return guardados ? JSON.parse(guardados) : [];
  });

  // Estados para las listas dinámicas de las APIs
  const [listaAcciones, setListaAcciones] = useState([]);
  const [listaCedears, setListaCedears] = useState([]);
  const [listaLecaps, setListaLecaps] = useState([]);
  const [listaBonos, setListaBonos] = useState([]);

  // Estados del formulario
  const [categoria, setCategoria] = useState("");
  const [nombre, setNombre] = useState("");
  const [precioCompra, setPrecioCompra] = useState("");
  const [cantidad, setCantidad] = useState("");

  // 2. Carga de todas las listas desde las APIs en paralelo
  useEffect(() => {
    const fetchStocks = fetch('https://data912.com/live/arg_stocks').then(res => res.json());
    const fetchCedears = fetch('https://data912.com/live/arg_cedears').then(res => res.json());
    const fetchNotes = fetch('https://data912.com/live/arg_notes').then(res => res.json());
    const fetchBonds = fetch('https://data912.com/live/arg_bonds').then(res => res.json());

    Promise.all([fetchStocks, fetchCedears, fetchNotes, fetchBonds])
      .then(([stocks, cedears, notes, bonds]) => {
        setListaAcciones(stocks.map(a => a.symbol).sort());
        setListaCedears(cedears.map(a => a.symbol).sort());
        setListaLecaps(notes.map(a => a.symbol).sort());
        setListaBonos(bonds.map(a => a.symbol).sort());
      })
      .catch(err => console.error("Error cargando listas de activos:", err));
  }, []);

  // 3. Persistencia en LocalStorage
  useEffect(() => {
    localStorage.setItem("misInversiones", JSON.stringify(activos));
  }, [activos]);

  // 4. Lógica para filtrar el buscador según la categoría
  const obtenerOpcionesNombre = () => {
    switch (categoria) {
      case "Acciones": return listaAcciones;
      case "CEDEARs": return listaCedears;
      case "LECAPs": return listaLecaps;
      case "Bonos": return listaBonos;
      default: return [];
    }
  };

  const agregarActivo = (e) => {
    e.preventDefault();
    if (!categoria || !nombre || !precioCompra || !cantidad) return;

    const nuevaInversion = {
      id: Date.now(),
      categoria,
      nombre: nombre.toUpperCase(),
      precioCompra: parseFloat(precioCompra),
      cantidad: parseFloat(cantidad),
      totalInvertido: parseFloat(precioCompra) * parseFloat(cantidad)
    };

    setActivos([...activos, nuevaInversion]);
    setNombre("");
    setPrecioCompra("");
    setCantidad("");
  };

  const eliminarActivo = (id) => {
    setActivos(activos.filter(a => a.id !== id));
  };

  // 5. Cálculos para el tablero de control
  const inversionTotalAcumulada = activos.reduce((acc, curr) => acc + curr.totalInvertido, 0);
  const objetivo = 20000000;
  const porcentajeProgreso = Math.min((inversionTotalAcumulada / objetivo) * 100, 100);

  return (
    <div className="max-w-6xl mx-auto px-4 py-4 md:py-8">
      {/* Encabezado */}
      <div className="mb-6 md:mb-8">
        <h2 className="text-2xl md:text-3xl font-black text-emerald-400 italic">
          MI CARTERA <span className="text-white text-xs md:text-sm font-normal not-italic block md:inline md:ml-2">Gestión de Patrimonio</span>
        </h2>
      </div>

      {/* Tablero de Resumen Responsivo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
        <div className="bg-slate-800 border border-slate-700 p-5 rounded-2xl shadow-2xl">
          <p className="text-slate-500 text-[10px] uppercase font-black tracking-widest mb-1">Capital Invertido</p>
          <p className="text-2xl md:text-3xl font-mono font-bold text-emerald-400">
            ${inversionTotalAcumulada.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
          </p>
        </div>
        
        <div className="bg-slate-800 border border-slate-700 p-5 rounded-2xl shadow-2xl">
          <p className="text-slate-500 text-[10px] uppercase font-black tracking-widest mb-1">Meta 2026</p>
          <p className="text-2xl md:text-3xl font-mono font-bold text-white">$20.000.000</p>
        </div>

        <div className="bg-slate-800 border border-slate-700 p-5 rounded-2xl shadow-2xl sm:col-span-2 lg:col-span-1">
          <p className="text-slate-500 text-[10px] uppercase font-black tracking-widest mb-1">Progreso Objetivo</p>
          <div className="flex items-center gap-4 mt-2">
            <p className="text-2xl md:text-3xl font-mono font-bold text-blue-400">{porcentajeProgreso.toFixed(1)}%</p>
            <div className="flex-1 bg-slate-900 h-3 rounded-full overflow-hidden border border-slate-700">
              <div 
                className="bg-blue-500 h-full transition-all duration-1000 ease-out" 
                style={{ width: `${porcentajeProgreso}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Formulario de Carga Responsivo */}
      <form onSubmit={agregarActivo} className="bg-slate-800 p-4 md:p-6 rounded-2xl border border-slate-700 mb-8 grid grid-cols-1 sm:grid-cols-2 lg:col-span-1 lg:grid-cols-5 gap-3 md:gap-4 shadow-2xl">
        <select 
          className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500 text-sm appearance-none"
          value={categoria}
          onChange={(e) => { setCategoria(e.target.value); setNombre(""); }}
        >
          <option value="">Categoría</option>
          <option value="Acciones">Acciones</option>
          <option value="CEDEARs">CEDEARs</option>
          <option value="LECAPs">LECAPs / Notas</option>
          <option value="Bonos">Bonos / Boncaps / Boncer</option>
        </select>

        <div className="relative">
          <input
            list="activos-list"
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500 text-sm disabled:opacity-30"
            placeholder={categoria ? "Escribí el ticker..." : "Elegí categoría"}
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            disabled={!categoria}
          />
          <datalist id="activos-list">
            {obtenerOpcionesNombre().map(n => <option key={n} value={n} />)}
          </datalist>
        </div>

        <input 
          type="number" placeholder="Precio" step="any"
          className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
          value={precioCompra} onChange={(e) => setPrecioCompra(e.target.value)}
        />

        <input 
          type="number" placeholder="Cant." 
          className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
          value={cantidad} onChange={(e) => setCantidad(e.target.value)}
        />

        <button className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-black rounded-xl py-3 transition-all uppercase text-xs tracking-widest shadow-lg sm:col-span-2 lg:col-span-1">
          Cargar
        </button>
      </form>

      {/* Tabla de Inversiones con Scroll Horizontal */}
      <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px] md:min-w-full">
            <thead>
              <tr className="bg-slate-900/50 text-slate-500 text-[10px] uppercase tracking-widest border-b border-slate-700">
                <th className="p-4 md:p-5 font-bold">Activo</th>
                <th className="p-4 md:p-5 font-bold text-right">Cant.</th>
                <th className="p-4 md:p-5 font-bold text-right">P. Compra</th>
                <th className="p-4 md:p-5 font-bold text-right">Total</th>
                <th className="p-4 md:p-5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {activos.map((a) => (
                <tr key={a.id} className="hover:bg-slate-700/20 transition-colors">
                  <td className="p-4 md:p-5">
                    <span className="text-emerald-500 font-black text-base md:text-lg block leading-none">{a.nombre}</span>
                    <span className="text-[10px] text-slate-500 uppercase tracking-tighter">{a.categoria}</span>
                  </td>
                  <td className="p-4 md:p-5 text-right font-mono text-sm text-slate-300">{a.cantidad.toLocaleString('es-AR')}</td>
                  <td className="p-4 md:p-5 text-right font-mono text-sm text-white">${a.precioCompra.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</td>
                  <td className="p-4 md:p-5 text-right font-mono text-sm text-emerald-400 font-bold">
                    ${a.totalInvertido.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="p-4 md:p-5 text-right">
                    <button 
                      onClick={() => eliminarActivo(a.id)} 
                      className="text-slate-600 hover:text-red-500 transition-colors p-2"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {activos.length === 0 && (
          <div className="p-16 md:p-20 text-center">
            <p className="text-slate-500 italic text-sm">Tu cartera está vacía.</p>
          </div>
        )}
      </div>
    </div>
  );
}