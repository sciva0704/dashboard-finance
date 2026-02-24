const secciones = [
  { id: "precio", titulo: "Valor del Dólar", desc: "Precios en tiempo real del dólar blue y financieros.", icon: "💵", color: "border-emerald-500" },
  { id: "acciones", titulo: "Acciones", desc: "Panel líder de la bolsa argentina (BYMA).", icon: "📈", color: "border-blue-500" },
  { id: "cedears", titulo: "CEDEARs", desc: "Invertí en empresas del exterior con pesos.", icon: "🌎", color: "border-purple-500" },
  { id: "lecaps", titulo: "Renta Fija", desc: "LECAPs, Bonos y letras del tesoro.", icon: "📄", color: "border-orange-500" },
  { id: "cartera", titulo: "Mi Cartera", desc: "Gestioná tus inversiones y Pone una Meta.", icon: "💼", color: "border-yellow-500" },
];

export default function MenuPrincipal({ setSeccion }) {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">
          Panel de <span className="text-emerald-500">Control</span>
        </h2>
        <p className="text-slate-400 mt-2">Seleccioná un mercado o gestioná tus activos.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {secciones.map((sec) => (
          <button
            key={sec.id}
            onClick={() => setSeccion(sec.id)}
            className={`bg-slate-800/50 border-2 ${sec.color} p-8 rounded-3xl text-left transition-all hover:scale-105 hover:bg-slate-800 group shadow-xl`}
          >
            <span className="text-4xl mb-4 block">{sec.icon}</span>
            <h3 className="text-xl font-black text-white mb-2 uppercase italic">{sec.titulo}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{sec.desc}</p>
            <div className="mt-4 flex items-center text-xs font-bold text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity">
              INGRESAR ➔
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}