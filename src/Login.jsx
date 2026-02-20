import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";

export default function Login({ onSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, password);

      // 🔥 Si el login fue exitoso
      if (onSuccess) {
        onSuccess();
      }

    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      alert("Credenciales incorrectas");
    }
  };

  return (
    <form onSubmit={handleLogin} className="flex flex-col gap-4 w-80">
      <h2 className="text-2xl font-bold text-white text-center">
        Iniciar sesión
      </h2>

      <input
        type="email"
        placeholder="Email"
        className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Contraseña"
        className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button
        type="submit"
        className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold py-3 rounded-xl"
      >
        Entrar
      </button>
    </form>
  );
}