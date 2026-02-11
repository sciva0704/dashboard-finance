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
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Encabezado */}
      <div className="mb-8">
        <h2 className="text-3xl font-black text-emerald-400 italic">MI CARTERA <span className="text-white text-sm font-normal not-italic ml-2">Gestión de Patrimonio</span></h2>
      </div>

      {/* Tablero de Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-2xl">
          <p className="text-slate-500 text-[10px] uppercase font-black tracking-widest mb-1">Capital Invertido</p>
          <p className="text-3xl font-mono font-bold text-emerald-400">
            ${inversionTotalAcumulada.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
          </p>
        </div>
        
        <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-2xl">
          <p className="text-slate-500 text-[10px] uppercase font-black tracking-widest mb-1">Meta 2026</p>
          <p className="text-3xl font-mono font-bold text-white">$20.000.000</p>
        </div>

        <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-2xl">
          <p className="text-slate-500 text-[10px] uppercase font-black tracking-widest mb-1">Progreso Objetivo</p>
          <div className="flex items-center gap-4 mt-2">
            <p className="text-3xl font-mono font-bold text-blue-400">{porcentajeProgreso.toFixed(1)}%</p>
            <div className="flex-1 bg-slate-900 h-3 rounded-full overflow-hidden border border-slate-700">
              <div 
                className="bg-blue-500 h-full transition-all duration-1000 ease-out" 
                style={{ width: `${porcentajeProgreso}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Formulario de Carga */}
      <form onSubmit={agregarActivo} className="bg-slate-800 p-6 rounded-2xl border border-slate-700 mb-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 shadow-2xl">
        <select 
          className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
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
          type="number" placeholder="P. Compra" step="any"
          className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
          value={precioCompra} onChange={(e) => setPrecioCompra(e.target.value)}
        />

        <input 
          type="number" placeholder="Cantidad" 
          className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
          value={cantidad} onChange={(e) => setCantidad(e.target.value)}
        />

        <button className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-black rounded-xl py-3 transition-all uppercase text-xs tracking-widest shadow-lg shadow-emerald-500/20">
          Cargar
        </button>
      </form>

      {/* Tabla de Inversiones */}
      <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/50 text-slate-500 text-[10px] uppercase tracking-widest border-b border-slate-700">
                <th className="p-5 font-bold">Activo / Categoría</th>
                <th className="p-5 font-bold text-right">Cant.</th>
                <th className="p-5 font-bold text-right">P. Compra</th>
                <th className="p-5 font-bold text-right">Inversión Total</th>
                <th className="p-5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {activos.map((a) => (
                <tr key={a.id} className="hover:bg-slate-700/20 transition-colors">
                  <td className="p-5">
                    <span className="text-emerald-500 font-black text-lg block leading-none">{a.nombre}</span>
                    <span className="text-[10px] text-slate-500 uppercase tracking-tighter">{a.categoria}</span>
                  </td>
                  <td className="p-5 text-right font-mono text-slate-300">{a.cantidad.toLocaleString('es-AR')}</td>
                  <td className="p-5 text-right font-mono text-white">${a.precioCompra.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</td>
                  <td className="p-5 text-right font-mono text-emerald-400 font-bold">
                    ${a.totalInvertido.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="p-5 text-right">
                    <button 
                      onClick={() => eliminarActivo(a.id)} 
                      className="text-slate-600 hover:text-red-500 transition-colors p-2"
                      title="Eliminar activo"
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
          <div className="p-20 text-center">
            <p className="text-slate-500 italic">Tu cartera está vacía. Empezá cargando tus activos arriba.</p>
          </div>
        )}
      </div>
    </div>
  );
}