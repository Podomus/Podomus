import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, { 
    provider: "postgresql"
  }),
  emailAndPassword: { 
    enabled: true,
    requireEmailVerification: false,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 jours
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 24 * 7 // 7 jours
    }
  },
  security: {
    bcrypt: {
      rounds: 8  // Reduced from 10 for better performance while maintaining security
    }
  },
  middleware: {
    auth: {
      after: async (context) => {
        const { user } = context;
        if (!user) return context;
        
        // Simple check without database query
        if (user.email !== "admin@podomus.local") {
          throw new Error("Accès non autorisé. Seul l'administrateur peut se connecter.");
        }
        return context;
      }
    }
  }
}); 