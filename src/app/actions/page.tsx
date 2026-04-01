"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Plus, Search, Filter } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

interface Action {
  id: string
  title: string
  domain: string
  priority: string
  status: string
  dueDate: string
  assignedTo?: {
    name: string
  }
}

const priorityColors = {
  low: "bg-blue-100 text-blue-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-orange-100 text-orange-800",
  critical: "bg-red-100 text-red-800",
}

const priorityLabels = {
  low: "Faible",
  medium: "Moyenne",
  high: "Haute",
  critical: "Critique",
}

const statusColors = {
  todo: "bg-gray-100 text-gray-800",
  in_progress: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
}

const statusLabels = {
  todo: "À faire",
  in_progress: "En cours",
  completed: "Terminé",
  cancelled: "Annulé",
}

const domainLabels = {
  quality: "Qualité",
  hygiene: "Hygiène",
  safety: "Sécurité",
  environment: "Environnement",
}

export default function ActionsPage() {
  const { data: session } = useSession()
  const [actions, setActions] = useState<Action[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [domainFilter, setDomainFilter] = useState("all")

  useEffect(() => {
    fetchActions()
  }, [])

  const fetchActions = async () => {
    try {
      const res = await fetch("/api/actions")
      if (res.ok) {
        const data = await res.json()
        setActions(data)
      }
    } catch (error) {
      console.error("Erreur lors du chargement des actions:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredActions = actions.filter((action) => {
    const matchesSearch = action.title.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === "all" || action.status === statusFilter
    const matchesPriority = priorityFilter === "all" || action.priority === priorityFilter
    const matchesDomain = domainFilter === "all" || action.domain === domainFilter
    
    return matchesSearch && matchesStatus && matchesPriority && matchesDomain
  })

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Actions QHSE</h1>
            <p className="text-gray-500 mt-1">
              Gérez toutes vos actions qualité, hygiène, sécurité et environnement
            </p>
          </div>
          <Link href="/actions/new">
            <Button className="bg-[#133B8B] hover:bg-[#0f2d6b]">
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle action
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Filtres et recherche
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="todo">À faire</SelectItem>
                  <SelectItem value="in_progress">En cours</SelectItem>
                  <SelectItem value="completed">Terminé</SelectItem>
                  <SelectItem value="cancelled">Annulé</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Priorité" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les priorités</SelectItem>
                  <SelectItem value="low">Faible</SelectItem>
                  <SelectItem value="medium">Moyenne</SelectItem>
                  <SelectItem value="high">Haute</SelectItem>
                  <SelectItem value="critical">Critique</SelectItem>
                </SelectContent>
              </Select>

              <Select value={domainFilter} onValueChange={setDomainFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Domaine" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les domaines</SelectItem>
                  <SelectItem value="quality">Qualité</SelectItem>
                  <SelectItem value="hygiene">Hygiène</SelectItem>
                  <SelectItem value="safety">Sécurité</SelectItem>
                  <SelectItem value="environment">Environnement</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-8 text-center text-gray-500">
                Chargement...
              </div>
            ) : filteredActions.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                Aucune action trouvée
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Titre</TableHead>
                    <TableHead>Domaine</TableHead>
                    <TableHead>Priorité</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Échéance</TableHead>
                    <TableHead>Assigné à</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredActions.map((action) => (
                    <TableRow key={action.id}>
                      <TableCell className="font-medium">
                        {action.title}
                      </TableCell>
                      <TableCell>
                        {domainLabels[action.domain as keyof typeof domainLabels]}
                      </TableCell>
                      <TableCell>
                        <Badge className={priorityColors[action.priority as keyof typeof priorityColors]}>
                          {priorityLabels[action.priority as keyof typeof priorityLabels]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[action.status as keyof typeof statusColors]}>
                          {statusLabels[action.status as keyof typeof statusLabels]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {format(new Date(action.dueDate), "dd MMM yyyy", { locale: fr })}
                      </TableCell>
                      <TableCell>
                        {action.assignedTo?.name || "Non assigné"}
                      </TableCell>
                      <TableCell>
                        <Link href={`/actions/${action.id}`}>
                          <Button variant="ghost" size="sm">
                            Voir
                          </Button>
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
