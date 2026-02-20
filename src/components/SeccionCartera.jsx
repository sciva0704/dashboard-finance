import { useState, useEffect } from "react";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import Login from "../LoginTemp";

export default function SeccionCartera({ user }) {
  const [activos, setActivos] = useState([]);
  const [objetivo, setObjetivo] = useState(20000000);
  const [cargando, setCargando] = useState(true);
  const [mostrarLogin, setMostrarLogin] = useState(false);

  const [editandoMeta, setEditandoMeta] = useState(false);
  const [inputMeta, setInputMeta] = useState("");

  const [listaAcciones, setListaAcciones] = useState([]);
  const [listaCedears, setListaCedears] = useState([]);
  const [listaLecaps, setListaLecaps] = useState([]);
  const [listaBonos, setListaBonos] = useState([]);

  const [categoria, setCategoria] = useState("");
  const [nombre, setNombre] = useState("");
  const [precioCompra, setPrecioCompra] = useState("");
  const [cantidad, setCantidad] = useState("");


  // 🔥 Cargar datos si está logueado
  useEffect(() => {
    const cargarDatos = async () => {
      if (!user) {
        setCargando(false);
        return;
      }

      try {
        const docRef = doc(db, "usuarios", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setActivos(data.activos || []);
          setObjetivo(data.objetivo || 20000000);
        }
      } catch (error) {
        console.error("Error cargando datos:", error);
      }

      setCargando(false);
    };

    cargarDatos();
  }, [user]);

  // 🔥 Fetch APIs
  useEffect(() => {
    const fetchListas = async () => {
      try {
        const [stocks, cedears, notes, bonds] = await Promise.all([
          fetch("https://data912.com/live/arg_stocks").then(res => res.json()),
          fetch("https://data912.com/live/arg_cedears").then(res => res.json()),
          fetch("https://data912.com/live/arg_notes").then(res => res.json()),
          fetch("https://data912.com/live/arg_bonds").then(res => res.json())
        ]);

        setListaAcciones(stocks.map(a => a.symbol).sort());
        setListaCedears(cedears.map(a => a.symbol).sort());
        setListaLecaps(notes.map(a => a.symbol).sort());
        setListaBonos(bonds.map(a => a.symbol).sort());
      } catch (err) {
        console.error("Error APIs:", err);
      }
    };

    fetchListas();
  }, []);

  const obtenerOpcionesNombre = () => {
    if (categoria === "Acciones") return listaAcciones;
    if (categoria === "CEDEARs") return listaCedears;
    if (categoria === "LECAPs") return listaLecaps;
    if (categoria === "Bonos") return listaBonos;
    return [];
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

    setActivos(prev => [...prev, nuevaInversion]);
    setNombre("");
    setPrecioCompra("");
    setCantidad("");
  };

  const eliminarActivo = (id) => {
    setActivos(prev => prev.filter(a => a.id !== id));
  };

  const guardarMeta = () => {
    const numeroLimpio = Number(inputMeta.replace(/\D/g, ""));
    if (!isNaN(numeroLimpio) && numeroLimpio > 0) {
      setObjetivo(numeroLimpio);
    }
    setEditandoMeta(false);
  };

  const guardarEnNube = async () => {
    if (!user) {
      setMostrarLogin(true);
      return;
    }

    try {
      const docRef = doc(db, "usuarios", user.uid);
      await setDoc(docRef, { activos, objetivo }, { merge: true });
      alert("Guardado en la nube correctamente 🚀");
    } catch (err) {
      console.error("Error al guardar:", err);
    }
  };

  const inversionTotalAcumulada = activos.reduce(
    (acc, curr) => acc + curr.totalInvertido,
    0
  );

  const porcentajeProgreso =
    objetivo > 0
      ? Math.min((inversionTotalAcumulada / objetivo) * 100, 100)
      : 0;

  if (cargando) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-emerald-400 font-black animate-pulse">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        Cargando datos...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-black text-emerald-400 italic mb-6 text-center">
        MI CARTERA
      </h2>

      {/* Tablero */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-xl">
          <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mb-1">Invertido</p>
          <p className="text-3xl font-mono font-bold text-emerald-400">
            ${inversionTotalAcumulada.toLocaleString('es-AR')}
          </p>
        </div>

        <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-xl">
          <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mb-1">Meta 2026</p>
          {!editandoMeta ? (
            <div className="flex items-center justify-between">
              <p className="text-3xl font-mono font-bold text-white">${objetivo.toLocaleString("es-AR")}</p>
              <button onClick={() => { setInputMeta(objetivo.toLocaleString("es-AR")); setEditandoMeta(true); }} className="text-slate-400 hover:text-emerald-400">✏</button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <input
                type="text" value={inputMeta} autoFocus
                className="text-2xl font-mono font-bold text-white bg-transparent outline-none w-full border-b border-emerald-500"
                onChange={(e) => setInputMeta(e.target.value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, "."))}
                onKeyDown={(e) => e.key === "Enter" && guardarMeta()}
              />
              <button onClick={guardarMeta} className="text-emerald-400">✔</button>
            </div>
          )}
        </div>

        <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-xl">
          <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mb-1">Progreso</p>
          <div className="flex items-center gap-4 mt-2">
            <p className="text-3xl font-mono font-bold text-blue-400">{porcentajeProgreso.toFixed(1)}%</p>
            <div className="flex-1 bg-slate-900 h-3 rounded-full overflow-hidden">
              <div className="bg-blue-500 h-full transition-all duration-1000" style={{ width: `${porcentajeProgreso}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Formulario */}
      <form onSubmit={agregarActivo} className="bg-slate-800 p-6 rounded-2xl border border-slate-700 mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 shadow-xl">
        <select className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm outline-none focus:ring-2 focus:ring-emerald-500" value={categoria} onChange={(e) => { setCategoria(e.target.value); setNombre(""); }}>
          <option value="">Categoría</option>
          <option value="Acciones">Acciones</option>
          <option value="CEDEARs">CEDEARs</option>
          <option value="LECAPs">LECAPs</option>
          <option value="Bonos">Bonos</option>
        </select>
        <div className="relative">
          <input list="activos-list" className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-30" placeholder="Ticker..." value={nombre} onChange={(e) => setNombre(e.target.value)} disabled={!categoria} />
          <datalist id="activos-list">{obtenerOpcionesNombre().map(n => <option key={n} value={n} />)}</datalist>
        </div>
        <input type="number" placeholder="Precio" step="any" className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm outline-none" value={precioCompra} onChange={(e) => setPrecioCompra(e.target.value)} />
        <input type="number" placeholder="Cant." className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm outline-none" value={cantidad} onChange={(e) => setCantidad(e.target.value)} />
        <button className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-black rounded-xl py-3 uppercase text-xs tracking-widest shadow-lg shadow-emerald-500/20 sm:col-span-2 lg:col-span-1">Cargar</button>
      </form>

      {mostrarLogin && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-slate-900 p-8 rounded-2xl relative">
            <button
              onClick={() => setMostrarLogin(false)}
              className="absolute top-3 right-4 text-slate-400 hover:text-red-500"
            >
              ✕
            </button>

            <Login onSuccess={() => setMostrarLogin(false)} />
          </div>
        </div>
      )}

      {/* Tabla */}
      <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[600px]">
            <thead>
              <tr className="bg-slate-900/50 text-slate-500 text-[10px] uppercase tracking-widest border-b border-slate-700">
                <th className="p-5">Activo</th>
                <th className="p-5 text-right">Cant.</th>
                <th className="p-5 text-right">P. Compra</th>
                <th className="p-5 text-right">Total</th>
                <th className="p-5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {activos.map((a) => (
                <tr key={a.id} className="hover:bg-slate-700/20 transition-colors">
                  <td className="p-5">
                    <span className="text-emerald-500 font-black text-lg block">{a.nombre}</span>
                    <span className="text-[10px] text-slate-500 uppercase">{a.categoria}</span>
                  </td>
                  <td className="p-5 text-right font-mono text-slate-300">{a.cantidad.toLocaleString('es-AR')}</td>
                  <td className="p-5 text-right font-mono text-white">${a.precioCompra.toLocaleString('es-AR')}</td>
                  <td className="p-5 text-right font-mono text-emerald-400 font-bold">${a.totalInvertido.toLocaleString('es-AR')}</td>
                  <td className="p-5 text-right">
                    <button onClick={() => eliminarActivo(a.id)} className="text-slate-600 hover:text-red-500 p-2">✕</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <button
        onClick={guardarEnNube}
        className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold px-4 py-2 rounded-xl mb-6 mt-4"
      >
        Guardar en la nube
      </button>
    </div>
  );
}