"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { authClient } from "@/lib/auth-client"

export function SignOutButton() {
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      router.push("/login");
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  }

  return (
    <Button
      variant="ghost"
      className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground transition-[transform,color,background-color] duration-150 ease-out active:scale-[0.97]"
      onClick={handleSignOut}
    >
      <LogOut className="h-4 w-4" />
      Se déconnecter
    </Button>
  )
}
