import { useState } from "react";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile 
} from "firebase/auth";
import { auth } from "./firebase";

export default function Login({ onSuccess }) {
  const [esRegistro, setEsRegistro] = useState(false);
  const [error, setError] = useState("");

  // Estados del formulario
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");

  // Validación de contraseña: Mayúscula, minúscula, número y min 8 caracteres
  const validarPassword = (pass) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return regex.test(pass);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (esRegistro) {
      // Validaciones de Registro
      if (password !== confirmPassword) {
        setError("Las contraseñas no coinciden.");
        return;
      }
      if (!validarPassword(password)) {
        setError("La contraseña debe tener: Mayúscula, Minúscula, Número y mínimo 8 caracteres.");
        return;
      }

      try {
        // Crear usuario
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Guardar Nombre y Apellido en el perfil de Firebase
        await updateProfile(userCredential.user, {
          displayName: `${nombre} ${apellido}`
        });
        if (onSuccess) onSuccess();
      } catch (err) {
        manejarErrores(err);
      }
    } else {
      // Lógica de Login simple
      try {
        await signInWithEmailAndPassword(auth, email, password);
        if (onSuccess) onSuccess();
      } catch (err) {
        manejarErrores(err);
      }
    }
  };

  const manejarErrores = (err) => {
    console.error(err.code);
    if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
      setError("Email o contraseña incorrectos.");
    } else if (err.code === "auth/email-already-in-use") {
      setError("El email ya está registrado.");
    } else {
      setError("Ocurrió un error. Inténtalo de nuevo.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full max-w-sm bg-slate-900/50 p-8 rounded-3xl border border-slate-800 shadow-2xl">
        <h2 className="text-3xl font-black text-white text-center italic mb-4 uppercase tracking-tighter">
          {esRegistro ? "Crear " : "Iniciar "}
          <span className="text-emerald-500">{esRegistro ? "Cuenta" : "Sesión"}</span>
        </h2>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/50 text-rose-500 text-xs p-3 rounded-xl text-center font-bold">
            {error}
          </div>
        )}

        {esRegistro && (
          <div className="flex gap-2">
            <input
              type="text" placeholder="Nombre"
              className="w-1/2 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm outline-none focus:ring-2 focus:ring-emerald-500"
              value={nombre} onChange={(e) => setNombre(e.target.value)} required
            />
            <input
              type="text" placeholder="Apellido"
              className="w-1/2 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm outline-none focus:ring-2 focus:ring-emerald-500"
              value={apellido} onChange={(e) => setApellido(e.target.value)} required
            />
          </div>
        )}

        <input
          type="email" placeholder="Email"
          className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm outline-none focus:ring-2 focus:ring-emerald-500"
          value={email} onChange={(e) => setEmail(e.target.value)} required
        />

        <input
          type="password" placeholder="Contraseña"
          className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm outline-none focus:ring-2 focus:ring-emerald-500"
          value={password} onChange={(e) => setPassword(e.target.value)} required
        />

        {esRegistro && (
          <input
            type="password" placeholder="Repetir Contraseña"
            className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm outline-none focus:ring-2 focus:ring-emerald-500"
            value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required
          />
        )}

        <button
          type="submit"
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-black py-4 rounded-xl mt-2 transition-all shadow-lg shadow-emerald-500/20 uppercase text-xs tracking-widest"
        >
          {esRegistro ? "Registrarse" : "Entrar"}
        </button>

        <p className="text-slate-500 text-center text-xs mt-4">
          {esRegistro ? "¿Ya tienes cuenta?" : "¿No tienes cuenta?"}{" "}
          <button
            type="button"
            onClick={() => { setEsRegistro(!esRegistro); setError(""); }}
            className="text-emerald-500 font-bold hover:underline"
          >
            {esRegistro ? "Inicia sesión" : "Regístrate ahora"}
          </button>
        </p>
      </form>
    </div>
  );
}