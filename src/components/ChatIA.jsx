import { useState } from "react";

export default function ChatIA({ tickerActual }) {
    const [mensaje, setMensaje] = useState("");
    const [chatLog, setChatLog] = useState([]);
    const [cargando, setCargando] = useState(false);

    const enviarPregunta = async () => {
        if (!mensaje.trim() || cargando) return;

        const pregunta = mensaje;
        setMensaje("");
        setCargando(true);
        setChatLog(prev => [...prev, { rol: "user", texto: pregunta }]);

        try {
            const prompt = `Actuá como analista técnico de la bolsa. El usuario consulta sobre el activo: ${tickerActual}. Pregunta: ${pregunta}`;

            // PLAN Z: Conexión manual directa a la versión v1 (ignorando la librería defectuosa)
            const response = await fetch(
                // ¡Acá está el cambio! Pasamos a gemini-flash-latest
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: prompt }] }]
                    })
                }
            );

            const data = await response.json();

            // Si Google nos tira un error, lo atrapamos acá
            if (!response.ok) {
                throw new Error(data.error?.message || "Error desconocido en la API");
            }

            // Extraemos el texto de la respuesta
            const text = data.candidates[0].content.parts[0].text;
            setChatLog(prev => [...prev, { rol: "ia", texto: text }]);

        } catch (error) {
            console.error("ERROR DE CONEXIÓN MANUAL:", error);
            setChatLog(prev => [...prev, { rol: "ia", texto: `Error del servidor: ${error.message}` }]);
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="flex flex-col h-[500px] bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
            {/* Cabecera */}
            <div className="bg-slate-800/50 p-4 border-b border-slate-700 flex justify-between items-center">
                <span className="font-bold text-xs text-emerald-500 uppercase tracking-widest">
                    IA Analyst • {tickerActual || "Seleccioná un activo"}
                </span>
                {cargando && <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>}
            </div>

            {/* Chat Log */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatLog.length === 0 && (
                    <div className="text-center mt-10 text-slate-500 text-[10px] uppercase tracking-widest">
                        Consultá sobre tendencias, soportes o resistencias.
                    </div>
                )}

                {chatLog.map((m, i) => (
                    <div key={i} className={`flex ${m.rol === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] p-3 rounded-2xl text-[11px] leading-relaxed shadow-md ${m.rol === 'user'
                            ? 'bg-emerald-600 text-white rounded-tr-none'
                            : 'bg-slate-800 text-slate-300 border border-slate-700 rounded-tl-none'
                            }`}>
                            {m.texto}
                        </div>
                    </div>
                ))}

                {/* Indicador de carga */}
                {cargando && (
                    <div className="flex justify-start">
                        <div className="bg-slate-800 text-emerald-500 p-3 rounded-2xl rounded-tl-none border border-slate-700 text-[10px] animate-pulse font-bold">
                            ANALIZANDO MERCADO...
                        </div>
                    </div>
                )}
            </div>

            {/* Input de texto */}
            <div className="p-4 bg-slate-900/80 border-t border-slate-800 flex gap-2">
                <input
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors disabled:opacity-50"
                    placeholder={cargando ? "Esperá un momento..." : "Escribí tu consulta..."}
                    value={mensaje}
                    disabled={cargando}
                    onChange={e => setMensaje(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && enviarPregunta()}
                />
                <button
                    onClick={enviarPregunta}
                    disabled={cargando}
                    className={`p-2 px-4 rounded-xl font-bold transition-colors ${cargando ? 'bg-slate-700 text-slate-500' : 'bg-emerald-500 text-slate-900 hover:bg-emerald-400'
                        }`}
                >
                    {cargando ? '...' : '➔'}
                </button>
            </div>
        </div>
    );
}