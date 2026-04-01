import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { authOptions } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Shield, Smartphone, Zap } from "lucide-react"

export default async function HomePage() {
  const session = await getServerSession(authOptions)
  
  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#133B8B] to-[#1a4ba8]">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-10 w-10 rounded-lg bg-white flex items-center justify-center">
              <span className="text-xl font-bold text-[#133B8B]">DQ</span>
            </div>
            <span className="text-2xl font-bold text-white">DigiQHSE</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/auth/login">
              <Button variant="ghost" className="text-white hover:bg-white/10">
                Connexion
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button className="bg-[#7FB147] hover:bg-[#6a9639] text-white">
                Commencer gratuitement
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold text-white mb-6">
          Gérez votre QHSE avec l'Intelligence Artificielle
        </h1>
        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
          La première plateforme QHSE intelligente conçue pour les PME africaines. 
          Simplifiez vos processus qualité, hygiène, sécurité et environnement.
        </p>
        <div className="flex justify-center space-x-4">
          <Link href="/auth/register">
            <Button size="lg" className="bg-[#7FB147] hover:bg-[#6a9639] text-white text-lg px-8 py-6">
              Démarrer gratuitement
            </Button>
          </Link>
          <Link href="#features">
            <Button size="lg" variant="outline" className="bg-white/10 border-white text-white hover:bg-white/20 text-lg px-8 py-6">
              En savoir plus
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-[#133B8B] mb-4">
            Pourquoi choisir DigiQHSE ?
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Une solution complète pour gérer tous vos besoins QHSE avec l'aide de l'IA
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <CheckCircle className="h-10 w-10 text-[#7FB147] mb-2" />
                <CardTitle>Gestion des Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Créez, suivez et gérez vos actions QHSE avec des rappels automatiques et des tableaux de bord en temps réel.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Smartphone className="h-10 w-10 text-[#7FB147] mb-2" />
                <CardTitle>Alertes QR Code</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Permettez à vos équipes de signaler rapidement les incidents via des codes QR placés sur vos sites.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Zap className="h-10 w-10 text-[#7FB147] mb-2" />
                <CardTitle>Assistant IA</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Posez vos questions QHSE à notre assistant IA alimenté par Claude pour obtenir des réponses instantanées.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="h-10 w-10 text-[#7FB147] mb-2" />
                <CardTitle>100% Sécurisé</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Vos données sont chiffrées et hébergées en toute sécurité. Conformité garantie aux normes africaines.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-[#133B8B] mb-4">
            Tarifs simples et transparents
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Choisissez le plan qui correspond à vos besoins. Paiement mobile disponible (Wave, Orange Money, MTN Money).
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-2xl">Gratuit</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">0 FCFA</span>
                  <span className="text-gray-600">/mois</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-[#7FB147] mr-2 mt-0.5" />
                    <span>1 utilisateur</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-[#7FB147] mr-2 mt-0.5" />
                    <span>10 actions/mois</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-[#7FB147] mr-2 mt-0.5" />
                    <span>Alertes QR limitées</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-[#7FB147] mr-2 mt-0.5" />
                    <span>10 crédits IA/mois</span>
                  </li>
                </ul>
                <Link href="/auth/register" className="block mt-6">
                  <Button className="w-full" variant="outline">
                    Commencer
                  </Button>
                </Link>
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
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-[#7FB147] mr-2 mt-0.5" />
                    <span>3 utilisateurs</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-[#7FB147] mr-2 mt-0.5" />
                    <span>Actions illimitées</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-[#7FB147] mr-2 mt-0.5" />
                    <span>Alertes QR illimitées</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-[#7FB147] mr-2 mt-0.5" />
                    <span>100 crédits IA/mois</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-[#7FB147] mr-2 mt-0.5" />
                    <span>Support prioritaire</span>
                  </li>
                </ul>
                <Link href="/auth/register" className="block mt-6">
                  <Button className="w-full bg-[#7FB147] hover:bg-[#6a9639]">
                    Commencer l'essai
                  </Button>
                </Link>
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
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-[#7FB147] mr-2 mt-0.5" />
                    <span>Utilisateurs illimités</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-[#7FB147] mr-2 mt-0.5" />
                    <span>Tout du plan Starter</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-[#7FB147] mr-2 mt-0.5" />
                    <span>500 crédits IA/mois</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-[#7FB147] mr-2 mt-0.5" />
                    <span>API access</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-[#7FB147] mr-2 mt-0.5" />
                    <span>Support 24/7</span>
                  </li>
                </ul>
                <Link href="/auth/register" className="block mt-6">
                  <Button className="w-full" variant="outline">
                    Nous contacter
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#133B8B]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Prêt à digitaliser votre QHSE ?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Rejoignez les PME africaines qui font confiance à DigiQHSE pour améliorer leur performance QHSE.
          </p>
          <Link href="/auth/register">
            <Button size="lg" className="bg-[#7FB147] hover:bg-[#6a9639] text-white text-lg px-8 py-6">
              Démarrer gratuitement maintenant
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2024 DigiQHSE - Une solution Digitia Solutions
          </p>
          <p className="text-gray-400 mt-2">
            Burkina Faso • Sénégal • Côte d'Ivoire • Mali • Guinée
          </p>
        </div>
      </footer>
    </div>
  )
}
