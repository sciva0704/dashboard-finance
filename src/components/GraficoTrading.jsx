import React, { useEffect, useRef } from 'react';

export default function GraficoTrading({ ticker }) {
  const container = useRef();

  useEffect(() => {
    // Esto limpia el gráfico anterior antes de poner el nuevo
    if (container.current) {
      container.current.innerHTML = "";
      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = JSON.stringify({
        "autosize": true,
        "symbol": ticker,
        "interval": "D",
        "timezone": "Etc/UTC",
        "theme": "dark",
        "style": "1",
        "locale": "es",
        "enable_publishing": false,
        "allow_symbol_change": true,
        "container_id": "tradingview_chart_container" // <--- ID CLAVE
      });
      container.current.appendChild(script);
    }
  }, [ticker]);

  return (
    <div className="h-[500px] w-full border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
      {/* El ID de este div debe coincidir con el container_id del script */}
      <div id="tradingview_chart_container" ref={container} className="h-full w-full"></div>
    </div>
  );
}
