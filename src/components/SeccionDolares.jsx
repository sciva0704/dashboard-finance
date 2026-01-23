import { useState, useEffect } from "react";
import TarjetaPrecio from "./TarjetaPrecioDolar.jsx";

export default function SeccionDolares() {
  const [precios, setPrecios] = useState([]);

  useEffect(() => {
    fetch('https://dolarapi.com/v1/dolares')
      .then(response => response.json())
      .then(data => setPrecios(data))
      .catch(err => console.error("Error:", err));
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
      {precios.length === 0 ? (
        <p className="text-white">Cargando cotizaciones...</p>
      ) : (
        precios.map((item) => (
          <TarjetaPrecio
            key={item.casa}
            nombre={item.nombre}
            valorCompra={item.compra}
            valorVenta={item.venta}
            fechaActualizacion={item.fechaActualizacion}
          />
        ))
      )}
    </div>
  );
}