"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { QrCode } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

const severityColors = {
  low: "bg-blue-100 text-blue-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-orange-100 text-orange-800",
  critical: "bg-red-100 text-red-800",
}

const statusColors = {
  new: "bg-purple-100 text-purple-800",
  in_progress: "bg-blue-100 text-blue-800",
  resolved: "bg-green-100 text-green-800",
  closed: "bg-gray-100 text-gray-800",
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAlerts()
  }, [])

  const fetchAlerts = async () => {
    try {
      const res = await fetch("/api/alerts")
      if (res.ok) {
        const data = await res.json()
        setAlerts(data)
      }
    } catch (error) {
      console.error("Erreur:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Alertes</h1>
            <p className="text-gray-500 mt-1">
              Gérez les alertes remontées via QR Code
            </p>
          </div>
          <Button className="bg-[#133B8B] hover:bg-[#0f2d6b]">
            <QrCode className="h-4 w-4 mr-2" />
            Générer QR Code
          </Button>
        </div>

        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-8 text-center text-gray-500">Chargement...</div>
            ) : alerts.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                Aucune alerte pour le moment
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Titre</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Gravité</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Signalé par</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {alerts.map((alert: any) => (
                    <TableRow key={alert.id}>
                      <TableCell className="font-medium">{alert.title}</TableCell>
                      <TableCell>{alert.alertType}</TableCell>
                      <TableCell>
                        <Badge className={severityColors[alert.severity as keyof typeof severityColors]}>
                          {alert.severity}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[alert.status as keyof typeof statusColors]}>
                          {alert.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{alert.reporterName || "Anonyme"}</TableCell>
                      <TableCell>
                        {format(new Date(alert.createdAt), "dd MMM yyyy", { locale: fr })}
                      </TableCell>
                      <TableCell>
                        <Link href={`/alerts/${alert.id}`}>
                          <Button variant="ghost" size="sm">Voir</Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
