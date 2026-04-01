"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Loader2, Sparkles } from "lucide-react"
import { suggestPriorityAndDueDate } from "@/lib/claude"

export default function NewActionPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const queryClient = useQueryClient()
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    domain: "safety",
    priority: "medium",
    dueDate: "",
  })
  const [suggesting, setSuggesting] = useState(false)

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await fetch("/api/actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || "Erreur lors de la création")
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] })
      queryClient.invalidateQueries({ queryKey: ["actions"] })
      router.push("/dashboard")
    },
  })

  const handleSuggest = async () => {
    if (!formData.title || formData.title.length < 5) return
    
    setSuggesting(true)
    try {
      const suggestion = await suggestPriorityAndDueDate(formData.title, formData.description)
      
      // Calculate suggested date
      const date = new Date()
      date.setDate(date.getDate() + suggestion.suggestedDays)
      
      setFormData(prev => ({
        ...prev,
        priority: suggestion.priority,
        dueDate: date.toISOString().split('T')[0]
      }))
    } catch (error) {
      console.error("Suggestion error:", error)
    } finally {
      setSuggesting(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createMutation.mutate(formData)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center">
          <Link href="/dashboard" className="flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Nouvelle action QHSE</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Titre de l'action *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ex: Vérification des extincteurs"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Détails de l'action..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="domain">Domaine *</Label>
                  <select
                    id="domain"
                    className="w-full h-10 rounded-md border border-input bg-background px-3"
                    value={formData.domain}
                    onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                  >
                    <option value="safety">Sécurité</option>
                    <option value="quality">Qualité</option>
                    <option value="hygiene">Hygiène</option>
                    <option value="environment">Environnement</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priorité *</Label>
                  <select
                    id="priority"
                    className="w-full h-10 rounded-md border border-input bg-background px-3"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  >
                    <option value="low">Faible</option>
                    <option value="medium">Moyenne</option>
                    <option value="high">Élevée</option>
                    <option value="critical">Critique</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dueDate">Date d'échéance *</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  required
                />
              </div>

              {session?.user?.subscriptionTier !== 'free' && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSuggest}
                  disabled={suggesting || formData.title.length < 5}
                  className="w-full"
                >
                  {suggesting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Analyse IA...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Suggérer priorité et date (IA)
                    </>
                  )}
                </Button>
              )}

              {createMutation.error && (
                <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
                  {createMutation.error.message}
                </div>
              )}

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => router.push("/dashboard")}
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={createMutation.isPending}
                >
                  {createMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Création...
                    </>
                  ) : (
                    "Créer l'action"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
