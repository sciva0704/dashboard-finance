import { useState, useEffect } from "react";

const formatearFecha = (fechaRaw) => {
  if (!fechaRaw) return "Sin datos";

  const fecha = new Date(fechaRaw);

  // Esto devuelve solo la hora y minutos en formato 24hs
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(fecha);
};

function TarjetaPrecio(props) {
  return (
    <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl m-2 shadow-lg">
      <h2 className="text-slate-400 text-2xl font-bold uppercase tracking-wider mb-4 border-b border-slate-700 pb-2">
        {props.nombre}
      </h2>
      <div className="flex justify-between gap-8">
        <div className="flex-1">
          <p className="text-slate-500 text-sm font-semibold">COMPRA</p>
          <p className="text-3xl font-mono text-green-400 font-bold">${props.valorCompra}</p>
        </div>
        <div className="flex-1">
          <p className="text-slate-500 text-sm font-semibold">VENTA</p>
          <p className="text-3xl font-mono text-green-400 font-bold">${props.valorVenta}</p>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-slate-700">
        <p className="text-slate-500 text-xs italic">
          Actualizado: {formatearFecha(props.fechaActualizacion)} hs
        </p>
      </div>
    </div>
  );
}

function App() {
  const [precios, setPrecios] = useState([]);
  useEffect(() => {
    fetch('https://dolarapi.com/v1/dolares')
      .then(response => response.json())
      .then(data => { setPrecios(data); });
  }, []);
  console.log(precios);
  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', fontSize: '40px' }}>
      <h1>Finanzas Dashboard 📈</h1>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {precios
          .filter(item => item.nombre.includes('Blue') || item.nombre.includes('Oficial') || item.nombre.includes('Bolsa'))
          .map((item) => (
            <TarjetaPrecio
              key={item.casa}      // React necesita una 'key' única para cada item
              nombre={item.nombre} // 'nombre' viene de la API
              valorCompra={item.compra} // 'compra' es el precio de la API
              valorVenta={item.venta}  // 'venta' es el precio de la API
              fechaActualizacion={item.fechaActualizacion}
            />
          ))}
      </div>
    </div>
  );
}

export default App