"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function ProduitsRedirectPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the correct ordre page
    router.replace("/admin/orders")
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-lg font-semibold mb-2">Redirection...</h2>
        <p className="text-gray-600">Vous êtes redirigé vers la page des produits.</p>
      </div>
    </div>
  )
}
