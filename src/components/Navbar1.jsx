export default function Navbar({ seccionActual, setSeccion }) {
  const botones = [
    { id: 'precio', nombre: 'Cotizaciones Dólar' },
    { id: 'acciones', nombre: 'Acciones' }, // Nueva sección de ejemplo
    { id: 'config', nombre: 'Ajustes' }
  ];

  return (
    <nav className="bg-slate-800 border-b border-slate-700 p-4 sticky top-0 z-50">
      {/* "flex-col" en celular, "flex-row" en pantallas grandes */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        
        <h1 className="text-xl font-bold text-green-400 tracking-tighter">
          FINANZAS <span className="text-white">PRO</span>
        </h1>

        {/* Menú de botones con scroll horizontal si no entran */}
        <div className="flex gap-4 text-xs md:text-sm font-medium overflow-x-auto pb-2 md:pb-0 w-full md:w-auto justify-center">
          {botones.map((boton) => (
            <button
              key={boton.id}
              onClick={() => setSeccion(boton.id)}
              className={`whitespace-nowrap px-3 py-1 rounded-full transition ${
                seccionActual === boton.id 
                  ? "bg-green-500 text-slate-900 font-bold" 
                  : "text-slate-400 hover:bg-slate-700"
              }`}
            >
              {boton.nombre}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}