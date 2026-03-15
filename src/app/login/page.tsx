"use client";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

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
        
        // Attendre un petit délai pour que le cookie soit défini
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Essayer différentes méthodes de redirection
        try {
          router.replace("/admin/dashboard");
          // Si ça ne marche pas, forcer avec window.location
          setTimeout(() => {
            if (window.location.pathname === "/login") {
              window.location.href = "/admin/dashboard";
            }
          }, 500);
        } catch (routerError) {
          console.error("Erreur avec router.replace, utilisation de window.location:", routerError);
          window.location.href = "/admin/dashboard";
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
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ maxWidth: 400, width: "100%", padding: 24, background: "#fff", borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
        <h1 style={{ textAlign: "center", marginBottom: 24 }}>Connexion Admin</h1>
        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{ padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{ padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
          />
          <button 
            type="submit" 
            disabled={loading} 
            style={{ padding: 10, borderRadius: 4, background: "#40826D", color: "#fff", fontWeight: "bold", border: "none" }}
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
          {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
        </form>
        <div style={{ marginTop: 16, textAlign: "center", fontSize: "14px", color: "#666" }}>
          <p>Accès réservé à l&apos;administrateur</p>
          <p>Email : admin@podomus.local</p>
        </div>
      </div>
    </div>
  );
} 