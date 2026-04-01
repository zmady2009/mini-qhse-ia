"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save, Building } from "lucide-react"

export default function SettingsPage() {
  const { data: session } = useSession()
  const [saving, setSaving] = useState(false)
  const [orgData, setOrgData] = useState({
    name: "",
    sector: "",
    country: "",
  })

  useEffect(() => {
    fetchOrgData()
  }, [])

  const fetchOrgData = async () => {
    try {
      const res = await fetch("/api/organization")
      if (res.ok) {
        const data = await res.json()
        setOrgData({
          name: data.name || "",
          sector: data.sector || "",
          country: data.country || "",
        })
      }
    } catch (error) {
      console.error("Erreur:", error)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch("/api/organization", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orgData),
      })
      if (res.ok) {
        alert("Paramètres enregistrés avec succès")
      }
    } catch (error) {
      console.error("Erreur:", error)
      alert("Erreur lors de l'enregistrement")
    } finally {
      setSaving(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Paramètres</h1>
          <p className="text-gray-500 mt-1">
            Gérez les paramètres de votre organisation
          </p>
        </div>

        <Tabs defaultValue="organization" className="space-y-4">
          <TabsList>
            <TabsTrigger value="organization">Organisation</TabsTrigger>
            <TabsTrigger value="profile">Profil</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="organization" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building className="h-5 w-5 mr-2" />
                  Informations de l'organisation
                </CardTitle>
                <CardDescription>
                  Configurez les informations de votre entreprise
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="orgName">Nom de l'organisation</Label>
                  <Input
                    id="orgName"
                    value={orgData.name}
                    onChange={(e) =>
                      setOrgData({ ...orgData, name: e.target.value })
                    }
                    placeholder="Ex: Mon Entreprise SARL"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sector">Secteur d'activité</Label>
                  <Select
                    value={orgData.sector}
                    onValueChange={(value) =>
                      setOrgData({ ...orgData, sector: value })
                    }
                  >
                    <SelectTrigger id="sector">
                      <SelectValue placeholder="Sélectionnez un secteur" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="btp">BTP et Construction</SelectItem>
                      <SelectItem value="agro">Agroalimentaire</SelectItem>
                      <SelectItem value="sante">Santé</SelectItem>
                      <SelectItem value="industrie">Industrie</SelectItem>
                      <SelectItem value="services">Services</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Pays</Label>
                  <Select
                    value={orgData.country}
                    onValueChange={(value) =>
                      setOrgData({ ...orgData, country: value })
                    }
                  >
                    <SelectTrigger id="country">
                      <SelectValue placeholder="Sélectionnez un pays" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BF">🇧🇫 Burkina Faso</SelectItem>
                      <SelectItem value="SN">🇸🇳 Sénégal</SelectItem>
                      <SelectItem value="CI">🇨🇮 Côte d'Ivoire</SelectItem>
                      <SelectItem value="ML">🇲🇱 Mali</SelectItem>
                      <SelectItem value="GN">🇬🇳 Guinée</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-[#133B8B] hover:bg-[#0f2d6b]"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? "Enregistrement..." : "Enregistrer"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Profil utilisateur</CardTitle>
                <CardDescription>
                  Gérez vos informations personnelles
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Nom</Label>
                  <Input value={session?.user?.name || ""} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input value={session?.user?.email || ""} disabled />
                </div>
                <p className="text-sm text-gray-500">
                  Pour modifier vos informations personnelles, contactez le support.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Préférences de notification</CardTitle>
                <CardDescription>
                  Configurez vos alertes et notifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  Les paramètres de notification seront disponibles prochainement.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
