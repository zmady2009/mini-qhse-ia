"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

export default function AlertDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [alert, setAlert] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAlert()
  }, [params.id])

  const fetchAlert = async () => {
    try {
      const res = await fetch(`/api/alerts/${params.id}`)
      if (res.ok) {
        const data = await res.json()
        setAlert(data)
      }
    } catch (error) {
      console.error("Erreur:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">Chargement...</p>
        </div>
      </DashboardLayout>
    )
  }

  if (!alert) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">Alerte non trouvée</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/alerts")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Détail de l'alerte</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informations de l'alerte</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-gray-500">Titre</Label>
              <p className="text-lg font-medium">{alert.title}</p>
            </div>
            <div>
              <Label className="text-gray-500">Description</Label>
              <p className="text-gray-700">{alert.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-500">Type</Label>
                <p className="font-medium">{alert.alertType}</p>
              </div>
              <div>
                <Label className="text-gray-500">Gravité</Label>
                <Badge>{alert.severity}</Badge>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-500">Statut</Label>
                <Badge>{alert.status}</Badge>
              </div>
              <div>
                <Label className="text-gray-500">Signalé par</Label>
                <p className="font-medium">{alert.reporterName || "Anonyme"}</p>
              </div>
            </div>
            {alert.reporterPhone && (
              <div>
                <Label className="text-gray-500">Téléphone</Label>
                <p className="font-medium">{alert.reporterPhone}</p>
              </div>
            )}
            <div>
              <Label className="text-gray-500">Date de signalement</Label>
              <p className="text-sm text-gray-600">
                {format(new Date(alert.createdAt), "dd MMMM yyyy 'à' HH:mm", {
                  locale: fr,
                })}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
