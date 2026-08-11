"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

const EASE = [0.23, 1, 0.32, 1] as const;

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      console.log("Tentative de connexion avec:", email);
      
      const { error, data } = await authClient.signIn.email({
        email,
        password,
      });

      console.log("Résultat du login:", { error, data });

      if (error) {
        console.error("Erreur de connexion:", error);
        setError(error.message || "Erreur de connexion");
        setLoading(false);
        return;
      }

      if (data?.user) {
        console.log("Utilisateur connecté:", data.user);
        console.log("Redirection vers /admin/dashboard...");
        
        await new Promise(resolve => setTimeout(resolve, 100));
        
        try {
          router.replace("/admin/dashboard");
          setTimeout(() => {
            if (window.location.pathname === "/login") {
              window.location.href = window.location.origin + "/admin/dashboard";
            }
          }, 500);
        } catch (routerError) {
          console.error("Erreur avec router.replace, utilisation de window.location:", routerError);
          window.location.href = window.location.origin + "/admin/dashboard";
        }
        return;
      } else {
        console.error("Aucune donnée utilisateur reçue");
        setError("Données de connexion invalides");
        setLoading(false);
      }
    } catch (err: any) {
      console.error("Erreur de connexion:", err);
      setError(err.message || "Erreur de connexion");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2, ease: EASE }}
        className="w-full max-w-[400px] p-6 bg-white rounded-xl shadow-md"
      >
        <h1 className="text-center text-xl font-bold mb-6 text-gray-800">
          Connexion Admin
        </h1>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="px-3 py-2.5 rounded-lg border border-gray-300 text-sm outline-none
                       transition-[border-color,box-shadow] duration-150 ease-out
                       focus:border-softtail-600 focus:ring-2 focus:ring-softtail-600/20"
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="px-3 py-2.5 rounded-lg border border-gray-300 text-sm outline-none
                       transition-[border-color,box-shadow] duration-150 ease-out
                       focus:border-softtail-600 focus:ring-2 focus:ring-softtail-600/20"
          />
          <motion.button
            type="submit"
            disabled={loading}
            className="py-2.5 rounded-lg bg-softtail-600 text-white font-semibold text-sm
                       disabled:opacity-50 disabled:cursor-not-allowed"
            whileTap={!loading ? { scale: 0.97 } : {}}
            transition={{ duration: 0.1, ease: "easeOut" }}
          >
            {loading ? "Connexion..." : "Se connecter"}
          </motion.button>
          <AnimatePresence>
            {error && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="text-red-500 text-sm text-center"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>
        </form>
        <p className="mt-4 text-center text-xs text-gray-500">
          Accès réservé à l&apos;administrateur
        </p>
      </motion.div>
    </div>
  );
}