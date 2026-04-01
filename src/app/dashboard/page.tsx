"use client"

import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Plus, 
  Shield,
  AlertCircle,
  MessageSquare,
  CreditCard
} from "lucide-react"
import { getDomainLabel, getPriorityLabel, getPriorityColor, formatDate } from "@/lib/utils"

interface DashboardStats {
  qhseScore: number
  totalActions: number
  completedActions: number
  overdueActions: number
  totalAlerts: number
  pendingAlerts: number
  recentActions: any[]
}

export default function DashboardPage() {
  const { data: session, status } = useSession()

  const { data: stats } = useQuery<DashboardStats>({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const res = await fetch("/api/dashboard/stats")
      return res.json()
    },
    enabled: status === "authenticated",
  })

  if (status === "loading") {
    return <div className="p-8">Chargement...</div>
  }

  if (status === "unauthenticated") {
    redirect("/auth/login")
  }

  const scoreColor = (stats?.qhseScore ?? 0) >= 80 ? 'text-green-500' : (stats?.qhseScore ?? 0) >= 60 ? 'text-yellow-500' : 'text-red-500'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold">Mini QHSE IA</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/dashboard" className="text-blue-600 font-medium">Tableau de bord</Link>
            <Link href="/actions" className="text-gray-600 hover:text-gray-900">Actions</Link>
            <Link href="/alerts" className="text-gray-600 hover:text-gray-900">Alertes</Link>
            <Link href="/ai" className="text-gray-600 hover:text-gray-900">Assistant IA</Link>
          </nav>
          <div className="flex items-center gap-4">
            {session?.user?.subscriptionTier === 'free' && (
              <Link href="/upgrade">
                <Button variant="outline" size="sm" className="hidden sm:flex">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Passer Pro
                </Button>
              </Link>
            )}
            <span className="text-sm text-gray-600">{session?.user?.name}</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Tableau de bord</h1>
          <p className="text-gray-600">Vue d'ensemble de votre performance QHSE</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* QHSE Score */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">QHSE Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-4xl font-bold ${scoreColor}`}>
                {stats?.qhseScore || 0}
              </div>
              <p className="text-xs text-gray-500 mt-1">Sur 100</p>
            </CardContent>
          </Card>

          {/* Overdue Actions */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Actions en retard</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <AlertTriangle className={`h-6 w-6 ${stats?.overdueActions ? 'text-red-500' : 'text-green-500'}`} />
                <span className="text-3xl font-bold">{stats?.overdueActions || 0}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">À traiter en priorité</p>
            </CardContent>
          </Card>

          {/* Total Actions */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Actions totales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-6 w-6 text-blue-500" />
                <span className="text-3xl font-bold">{stats?.totalActions || 0}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {stats?.completedActions || 0} terminées
              </p>
            </CardContent>
          </Card>

          {/* Alerts */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Alertes en attente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <AlertCircle className={`h-6 w-6 ${stats?.pendingAlerts ? 'text-orange-500' : 'text-green-500'}`} />
                <span className="text-3xl font-bold">{stats?.pendingAlerts || 0}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">À traiter</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link href="/actions/new">
            <Button className="w-full h-20 text-lg" variant="outline">
              <Plus className="h-5 w-5 mr-2" />
              Nouvelle Action
            </Button>
          </Link>
          
          <Link href="/ai">
            <Button className="w-full h-20 text-lg" variant="outline">
              <MessageSquare className="h-5 w-5 mr-2" />
              Assistant IA
            </Button>
          </Link>
          
          <Link href="/qr-codes">
            <Button className="w-full h-20 text-lg" variant="outline">
              <Shield className="h-5 w-5 mr-2" />
              QR Codes Alertes
            </Button>
          </Link>
        </div>

        {/* Recent Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Actions récentes</CardTitle>
          </CardHeader>
          <CardContent>
            {stats?.recentActions?.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                Aucune action créée. Commencez par en créer une !
              </p>
            ) : (
              <div className="space-y-3">
                {stats?.recentActions?.map((action) => (
                  <div key={action.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${getPriorityColor(action.priority)}`} />
                      <div>
                        <p className="font-medium">{action.title}</p>
                        <p className="text-sm text-gray-500">
                          {getDomainLabel(action.domain)} • Échéance: {formatDate(action.dueDate)}
                        </p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      action.status === 'completed' ? 'bg-green-100 text-green-800' :
                      action.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                      new Date(action.dueDate) < new Date() ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {action.status === 'completed' ? 'Terminée' :
                       action.status === 'in_progress' ? 'En cours' :
                       new Date(action.dueDate) < new Date() ? 'En retard' : 'À faire'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
