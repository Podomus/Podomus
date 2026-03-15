import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  // Protéger toutes les routes admin
  if (request.nextUrl.pathname.startsWith("/admin")) {
    try {
      // Vérifier le cookie de session Better Auth (bon nom découvert dans les logs)
      const sessionCookie = request.cookies.get("better-auth.session_token");
      
      console.log("Middleware - Chemin:", request.nextUrl.pathname);
      console.log("Middleware - Session cookie:", sessionCookie?.name, sessionCookie?.value ? "présent" : "absent");
      
      if (!sessionCookie) {
        console.log("Middleware - Aucun cookie de session trouvé, redirection vers login");
        return NextResponse.redirect(new URL("/login", request.url));
      }

      console.log("Middleware - Session trouvée, accès autorisé");
      return NextResponse.next();
    } catch (error) {
      console.error("Middleware - Erreur:", error);
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
