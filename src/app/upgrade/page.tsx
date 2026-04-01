"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, CreditCard } from "lucide-react"

export default function UpgradePage() {
  const handlePayment = async (tier: string) => {
    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier }),
      })
      
      const data = await res.json()
      
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl
      }
    } catch (error) {
      console.error("Erreur:", error)
      alert("Erreur lors de l'initialisation du paiement")
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Abonnement</h1>
          <p className="text-gray-500 mt-1">
            Choisissez le plan qui correspond à vos besoins
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-2xl">Gratuit</CardTitle>
              <div className="mt-4">
                <span className="text-4xl font-bold">0 FCFA</span>
                <span className="text-gray-600">/mois</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-[#7FB147] mr-2 mt-0.5 flex-shrink-0" />
                  <span>1 utilisateur</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-[#7FB147] mr-2 mt-0.5 flex-shrink-0" />
                  <span>10 actions/mois</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-[#7FB147] mr-2 mt-0.5 flex-shrink-0" />
                  <span>Alertes QR limitées</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-[#7FB147] mr-2 mt-0.5 flex-shrink-0" />
                  <span>10 crédits IA/mois</span>
                </li>
              </ul>
              <Button className="w-full" variant="outline" disabled>
                Plan actuel
              </Button>
            </CardContent>
          </Card>

          <Card className="border-2 border-[#7FB147] shadow-lg">
            <CardHeader>
              <div className="text-xs font-semibold text-[#7FB147] mb-2">POPULAIRE</div>
              <CardTitle className="text-2xl">Starter</CardTitle>
              <div className="mt-4">
                <span className="text-4xl font-bold">2 900 FCFA</span>
                <span className="text-gray-600">/mois</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-[#7FB147] mr-2 mt-0.5 flex-shrink-0" />
                  <span>3 utilisateurs</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-[#7FB147] mr-2 mt-0.5 flex-shrink-0" />
                  <span>Actions illimitées</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-[#7FB147] mr-2 mt-0.5 flex-shrink-0" />
                  <span>Alertes QR illimitées</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-[#7FB147] mr-2 mt-0.5 flex-shrink-0" />
                  <span>100 crédits IA/mois</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-[#7FB147] mr-2 mt-0.5 flex-shrink-0" />
                  <span>Support prioritaire</span>
                </li>
              </ul>
              <Button
                className="w-full bg-[#7FB147] hover:bg-[#6a9639]"
                onClick={() => handlePayment("starter")}
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Souscrire
              </Button>
              <p className="text-xs text-center text-gray-500 mt-3">
                Wave • Orange Money • MTN Money
              </p>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-2xl">Pro</CardTitle>
              <div className="mt-4">
                <span className="text-4xl font-bold">9 900 FCFA</span>
                <span className="text-gray-600">/mois</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-[#7FB147] mr-2 mt-0.5 flex-shrink-0" />
                  <span>Utilisateurs illimités</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-[#7FB147] mr-2 mt-0.5 flex-shrink-0" />
                  <span>Tout du plan Starter</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-[#7FB147] mr-2 mt-0.5 flex-shrink-0" />
                  <span>500 crédits IA/mois</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-[#7FB147] mr-2 mt-0.5 flex-shrink-0" />
                  <span>API access</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-[#7FB147] mr-2 mt-0.5 flex-shrink-0" />
                  <span>Support 24/7</span>
                </li>
              </ul>
              <Button
                className="w-full"
                variant="outline"
                onClick={() => handlePayment("pro")}
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Souscrire
              </Button>
              <p className="text-xs text-center text-gray-500 mt-3">
                Wave • Orange Money • MTN Money
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-2">Paiement mobile disponible</h3>
            <p className="text-gray-700">
              Payez facilement avec Wave, Orange Money, ou MTN Money. Le paiement est sécurisé
              via notre partenaire Moneroo, spécialisé dans les transactions en Afrique.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
