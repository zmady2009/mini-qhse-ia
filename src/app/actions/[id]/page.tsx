"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowLeft, Edit, Save, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

const priorityLabels = {
  low: "Faible",
  medium: "Moyenne",
  high: "Haute",
  critical: "Critique",
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

export default function ActionDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [action, setAction] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    domain: "",
    priority: "",
    status: "",
    dueDate: "",
  })

  useEffect(() => {
    fetchAction()
  }, [params.id])

  const fetchAction = async () => {
    try {
      const res = await fetch(`/api/actions/${params.id}`)
      if (res.ok) {
        const data = await res.json()
        setAction(data)
        setFormData({
          title: data.title,
          description: data.description || "",
          domain: data.domain,
          priority: data.priority,
          status: data.status,
          dueDate: data.dueDate.split("T")[0],
        })
      }
    } catch (error) {
      console.error("Erreur:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      const res = await fetch(`/api/actions/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (res.ok) {
        await fetchAction()
        setEditing(false)
      }
    } catch (error) {
      console.error("Erreur:", error)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette action ?")) return
    
    try {
      const res = await fetch(`/api/actions/${params.id}`, {
        method: "DELETE",
      })
      if (res.ok) {
        router.push("/actions")
      }
    } catch (error) {
      console.error("Erreur:", error)
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

  if (!action) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">Action non trouvée</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/actions")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Détail de l'action
              </h1>
            </div>
          </div>
          <div className="flex space-x-2">
            {editing ? (
              <>
                <Button variant="outline" onClick={() => setEditing(false)}>
                  Annuler
                </Button>
                <Button onClick={handleSave}>
                  <Save className="h-4 w-4 mr-2" />
                  Enregistrer
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={handleDelete}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Supprimer
                </Button>
                <Button onClick={() => setEditing(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Modifier
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations générales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {editing ? (
                <>
                  <div className="space-y-2">
                    <Label>Titre</Label>
                    <Input
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      rows={4}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Domaine</Label>
                      <Select
                        value={formData.domain}
                        onValueChange={(value) =>
                          setFormData({ ...formData, domain: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="quality">Qualité</SelectItem>
                          <SelectItem value="hygiene">Hygiène</SelectItem>
                          <SelectItem value="safety">Sécurité</SelectItem>
                          <SelectItem value="environment">Environnement</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Priorité</Label>
                      <Select
                        value={formData.priority}
                        onValueChange={(value) =>
                          setFormData({ ...formData, priority: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Faible</SelectItem>
                          <SelectItem value="medium">Moyenne</SelectItem>
                          <SelectItem value="high">Haute</SelectItem>
                          <SelectItem value="critical">Critique</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Statut</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value) =>
                          setFormData({ ...formData, status: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="todo">À faire</SelectItem>
                          <SelectItem value="in_progress">En cours</SelectItem>
                          <SelectItem value="completed">Terminé</SelectItem>
                          <SelectItem value="cancelled">Annulé</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Date d'échéance</Label>
                      <Input
                        type="date"
                        value={formData.dueDate}
                        onChange={(e) =>
                          setFormData({ ...formData, dueDate: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <Label className="text-gray-500">Titre</Label>
                    <p className="text-lg font-medium">{action.title}</p>
                  </div>
                  {action.description && (
                    <div>
                      <Label className="text-gray-500">Description</Label>
                      <p className="text-gray-700">{action.description}</p>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-500">Domaine</Label>
                      <p className="font-medium">
                        {domainLabels[action.domain as keyof typeof domainLabels]}
                      </p>
                    </div>
                    <div>
                      <Label className="text-gray-500">Priorité</Label>
                      <Badge>
                        {priorityLabels[action.priority as keyof typeof priorityLabels]}
                      </Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-500">Statut</Label>
                      <Badge>
                        {statusLabels[action.status as keyof typeof statusLabels]}
                      </Badge>
                    </div>
                    <div>
                      <Label className="text-gray-500">Date d'échéance</Label>
                      <p className="font-medium">
                        {format(new Date(action.dueDate), "dd MMMM yyyy", {
                          locale: fr,
                        })}
                      </p>
                    </div>
                  </div>
                  {action.assignedTo && (
                    <div>
                      <Label className="text-gray-500">Assigné à</Label>
                      <p className="font-medium">{action.assignedTo.name}</p>
                    </div>
                  )}
                  <div>
                    <Label className="text-gray-500">Créé le</Label>
                    <p className="text-sm text-gray-600">
                      {format(new Date(action.createdAt), "dd MMMM yyyy 'à' HH:mm", {
                        locale: fr,
                      })}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
