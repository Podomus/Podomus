"use client"

import * as React from "react"
import { useRouter, useParams } from "next/navigation"
import { motion } from "framer-motion"
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink,
  BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator
} from "@/components/ui/breadcrumb"
import { authClient } from "@/lib/auth-client"
import {
  ArrowLeft, Edit, User, Phone, Mail,
  MapPin, Calendar, Shield, FileText, Package
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle
} from "@/components/ui/dialog"
import { toast } from "sonner"

interface Patient {
  id: string
  nom: string
  prenom: string
  dateNaissance?: Date
  email?: string
  telephone?: string
  adresse?: string
  codePostal?: string
  ville?: string
  numSecu?: string
  notes?: string
  createdAt: Date
  updatedAt: Date
}

interface Appointment {
  id: string
  patientId?: string
  patientName: string
  date: Date
  time: string
  duration: number
  status: string
}

interface Produit {
  id: string
  type: string
  description?: string
  dateCommande: Date
  dateLivraison?: Date
  prix: number
  status: string
  champsCustom?: Record<string, any>
}

const fadeInUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2, ease: [0.23, 1, 0.32, 1] as [number, number, number, number] } }
}

const appointmentStatusMap: Record<string, { label: string; className: string }> = {
  scheduled:  { label: "Planifié",     className: "bg-amber-100 text-amber-800 border-amber-200" },
  completed:  { label: "Terminé",      className: "bg-green-100 text-green-800 border-green-200" },
  cancelled:  { label: "Annulé",       className: "bg-red-100 text-red-800 border-red-200" },
  no_show:    { label: "Absent",       className: "bg-orange-100 text-orange-800 border-orange-200" },
}

const produitStatusMap: Record<string, { label: string; className: string }> = {
  commande:       { label: "Commandée",      className: "bg-amber-100 text-amber-800 border-amber-200" },
  en_fabrication: { label: "En fabrication", className: "bg-blue-100 text-blue-800 border-blue-200" },
  livree:         { label: "Livrée",         className: "bg-green-100 text-green-800 border-green-200" },
  facturee:       { label: "Facturée",       className: "bg-purple-100 text-purple-800 border-purple-200" },
}

const formatDate = (date?: Date | string) => {
  if (!date) return "Non spécifié"
  const d = date instanceof Date ? date : new Date(date)
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function PatientDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const patientId = params.id as string

  const [loading, setLoading] = React.useState(true)
  const [patient, setPatient] = React.useState<Patient | null>(null)
  const [appointments, setAppointments] = React.useState<Appointment[]>([])
  const [produits, setProduits] = React.useState<Produit[]>([])
  const [loadingTabs, setLoadingTabs] = React.useState(false)

  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false)
  const [editForm, setEditForm] = React.useState({
    nom: "", prenom: "", dateNaissance: "", email: "",
    telephone: "", adresse: "", codePostal: "", ville: "", numSecu: "", notes: ""
  })

  React.useEffect(() => {
    const init = async () => {
      try {
        const { data } = await authClient.getSession()
        if (!data?.user || data.user.email !== "admin@podomus.local") {
          router.push("/login"); return
        }
        const [patRes, aptRes, ordRes] = await Promise.all([
          fetch(`/api/patients/${patientId}`),
          fetch(`/api/appointments?patientId=${patientId}`),
          fetch(`/api/orders?patientId=${patientId}`)
        ])
        if (!patRes.ok) throw new Error("Patient introuvable")
        const patData = await patRes.json()
        setPatient({
          ...patData,
          dateNaissance: patData.dateNaissance ? new Date(patData.dateNaissance) : undefined,
          createdAt: new Date(patData.createdAt),
          updatedAt: new Date(patData.updatedAt)
        })
        if (aptRes.ok) {
          const aptData = await aptRes.json()
          setAppointments(aptData.map((a: any) => ({ ...a, date: new Date(a.date) })))
        }
        if (ordRes.ok) {
          const ordData = await ordRes.json()
          setProduits(ordData.map((p: any) => ({
            ...p,
            dateCommande: new Date(p.dateCommande),
            dateLivraison: p.dateLivraison ? new Date(p.dateLivraison) : undefined
          })))
        }
      } catch (e: any) {
        toast.error(e.message || "Erreur lors du chargement")
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [router, patientId])

  const openEditDialog = () => {
    if (!patient) return
    setEditForm({
      nom: patient.nom,
      prenom: patient.prenom,
      dateNaissance: patient.dateNaissance ? patient.dateNaissance.toISOString().split('T')[0] : "",
      email: patient.email || "",
      telephone: patient.telephone || "",
      adresse: patient.adresse || "",
      codePostal: patient.codePostal || "",
      ville: patient.ville || "",
      numSecu: patient.numSecu || "",
      notes: patient.notes || ""
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdate = async () => {
    if (!patient) return
    try {
      const res = await fetch(`/api/patients/${patient.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...editForm,
          dateNaissance: editForm.dateNaissance ? new Date(editForm.dateNaissance).toISOString() : undefined,
          email: editForm.email || undefined,
          telephone: editForm.telephone || undefined,
          adresse: editForm.adresse || undefined,
          codePostal: editForm.codePostal || undefined,
          ville: editForm.ville || undefined,
          numSecu: editForm.numSecu || undefined,
          notes: editForm.notes || undefined
        })
      })
      if (!res.ok) { const e = await res.json(); throw new Error(e.error || "Erreur") }
      const updated = await res.json()
      setPatient({
        ...updated,
        dateNaissance: updated.dateNaissance ? new Date(updated.dateNaissance) : undefined,
        createdAt: new Date(updated.createdAt),
        updatedAt: new Date(updated.updatedAt)
      })
      setIsEditDialogOpen(false)
      toast.success("Patient mis à jour avec succès")
    } catch (e: any) { toast.error(e.message || "Une erreur est survenue") }
  }

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-64">
        <p className="text-gray-500">Chargement du dossier patient...</p>
      </div>
    )
  }

  if (!patient) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500 mb-4">Patient introuvable.</p>
        <Button variant="outline" onClick={() => router.push('/admin/patients')}>
          <ArrowLeft size={16} className="mr-2" /> Retour aux patients
        </Button>
      </div>
    )
  }

  return (
    <>
      <div className="p-6">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div>
              <Breadcrumb className="mb-2">
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/admin/patients">Patients</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{patient.prenom} {patient.nom}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
              <h1 className="text-2xl font-bold text-gray-800">
                {patient.prenom} {patient.nom}
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Dossier patient · Créé le {formatDate(patient.createdAt)}
              </p>
            </div>
            <div className="flex items-center gap-2 mt-4 sm:mt-0">
              <Button variant="outline" className="active:scale-[0.97] transition-[transform,color,background-color] duration-100" onClick={() => router.push('/admin/patients')}>
                <ArrowLeft size={16} className="mr-2" /> Retour aux patients
              </Button>
              <Button className="bg-amber-500 hover:bg-amber-600 active:scale-[0.97] transition-[transform,color,background-color] duration-100" onClick={openEditDialog}>
                <Edit size={16} className="mr-2" /> Modifier
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Patient info card */}
            <motion.div className="lg:col-span-1" initial="hidden" animate="visible" variants={fadeInUp} transition={{ duration: 0.2 }}>
              <Card className="border border-gray-200 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2 text-gray-700">
                    <User size={16} /> Informations patient
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">

                  <div className="flex items-start gap-3">
                    <User size={15} className="text-gray-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">Identité</p>
                      <p className="font-medium text-gray-800">{patient.prenom} {patient.nom}</p>
                      {patient.dateNaissance && (
                        <p className="text-gray-500 text-xs mt-0.5">
                          Né(e) le {formatDate(patient.dateNaissance)}
                        </p>
                      )}
                    </div>
                  </div>

                  {(patient.telephone || patient.email) && (
                    <>
                      <Separator />
                      <div className="space-y-2">
                        {patient.telephone && (
                          <div className="flex items-center gap-3">
                            <Phone size={14} className="text-gray-400 shrink-0" />
                            <span className="text-gray-700">{patient.telephone}</span>
                          </div>
                        )}
                        {patient.email && (
                          <div className="flex items-center gap-3">
                            <Mail size={14} className="text-gray-400 shrink-0" />
                            <span className="text-gray-700 truncate">{patient.email}</span>
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  {(patient.adresse || patient.codePostal || patient.ville) && (
                    <>
                      <Separator />
                      <div className="flex items-start gap-3">
                        <MapPin size={14} className="text-gray-400 mt-0.5 shrink-0" />
                        <div className="text-gray-700">
                          {patient.adresse && <p>{patient.adresse}</p>}
                          {(patient.codePostal || patient.ville) && (
                            <p>{[patient.codePostal, patient.ville].filter(Boolean).join(" ")}</p>
                          )}
                        </div>
                      </div>
                    </>
                  )}

                  {patient.numSecu && (
                    <>
                      <Separator />
                      <div className="flex items-start gap-3">
                        <Shield size={14} className="text-gray-400 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs text-gray-400 mb-0.5">N° sécurité sociale</p>
                          <p className="text-gray-700 font-mono text-xs">{patient.numSecu}</p>
                        </div>
                      </div>
                    </>
                  )}

                  {patient.notes && (
                    <>
                      <Separator />
                      <div className="flex items-start gap-3">
                        <FileText size={14} className="text-gray-400 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs text-gray-400 mb-0.5">Notes cliniques</p>
                          <p className="text-gray-700 bg-gray-50 p-2 rounded border border-gray-100 text-xs leading-relaxed">
                            {patient.notes}
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Tabs: Rendez-vous / Orthèses */}
            <motion.div
              className="lg:col-span-2"
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              transition={{ delay: 0.06, duration: 0.2 }}
            >
              <Card className="border border-gray-200 shadow-sm h-full">
                <CardContent className="pt-4">
                  <Tabs defaultValue="appointments">
                    <TabsList className="mb-4 w-full justify-start">
                      <TabsTrigger value="appointments" className="gap-2 transition-[color,background-color] duration-150">
                        <Calendar size={14} />
                        Rendez-vous
                        <Badge variant="secondary" className="ml-1 text-xs">{appointments.length}</Badge>
                      </TabsTrigger>
                      <TabsTrigger value="ortheses" className="gap-2 transition-[color,background-color] duration-150">
                        <Package size={14} />
                        Orthèses
                        <Badge variant="secondary" className="ml-1 text-xs">{produits.length}</Badge>
                      </TabsTrigger>
                    </TabsList>

                    {/* Onglet Rendez-vous */}
                    <TabsContent value="appointments" className="data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:slide-in-from-left-1 data-[state=active]:duration-150">
                      {appointments.length === 0 ? (
                        <div className="text-center py-12 text-gray-400 animate-in fade-in-0 duration-200">
                          <Calendar size={32} className="mx-auto mb-3 opacity-30" />
                          <p>Aucun rendez-vous pour ce patient</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {[...appointments]
                            .sort((a, b) => b.date.getTime() - a.date.getTime())
                            .map(apt => {
                              const s = appointmentStatusMap[apt.status] ?? { label: apt.status, className: "bg-gray-100 text-gray-800" }
                              return (
                                <div key={apt.id} className="flex items-start gap-4 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                                  <div className="w-10 h-10 rounded-full bg-softtail-50 flex flex-col items-center justify-center shrink-0">
                                    <Calendar size={13} className="text-softtail-500" />
                                    <span className="text-xs font-medium text-softtail-700 leading-none mt-0.5">{apt.time}</span>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-800">
                                      {apt.date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                      Durée : {apt.duration >= 60
                                        ? `${Math.floor(apt.duration / 60)}h${apt.duration % 60 > 0 ? apt.duration % 60 : ""}`
                                        : `${apt.duration} min`}
                                    </p>
                                  </div>
                                  <Badge variant="outline" className={`text-xs shrink-0 ${s.className}`}>
                                    {s.label}
                                  </Badge>
                                </div>
                              )
                            })}
                        </div>
                      )}
                    </TabsContent>

                    {/* Onglet Orthèses */}
                    <TabsContent value="ortheses" className="data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:slide-in-from-left-1 data-[state=active]:duration-150">
                      {produits.length === 0 ? (
                        <div className="text-center py-12 text-gray-400 animate-in fade-in-0 duration-200">
                          <Package size={32} className="mx-auto mb-3 opacity-30" />
                          <p>Aucune orthèse pour ce patient</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {[...produits]
                            .sort((a, b) => b.dateCommande.getTime() - a.dateCommande.getTime())
                            .map(prod => {
                              const s = produitStatusMap[prod.status] ?? { label: prod.status, className: "bg-gray-100 text-gray-800" }
                              return (
                                <div key={prod.id} className="p-3 rounded-lg border border-gray-100 hover:bg-gray-50 active:bg-gray-100 transition-colors duration-150 cursor-default">
                                  <div className="flex justify-between items-start gap-2">
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2 flex-wrap">
                                        <p className="text-sm font-medium text-gray-800">{prod.type}</p>
                                        <Badge variant="outline" className={`text-xs ${s.className}`}>{s.label}</Badge>
                                      </div>
                                      <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                        <Calendar size={11} />
                                        Commandée le {prod.dateCommande.toLocaleDateString('fr-FR')}
                                        {prod.dateLivraison && ` · Livraison le ${prod.dateLivraison.toLocaleDateString('fr-FR')}`}
                                      </p>
                                      {prod.description && (
                                        <p className="text-xs text-gray-600 mt-1">{prod.description}</p>
                                      )}
                                      {prod.champsCustom && Object.keys(prod.champsCustom).length > 0 && (
                                        <div className="mt-2 pt-2 border-t border-gray-100">
                                          <p className="text-xs font-medium text-gray-500 mb-1">Informations complémentaires</p>
                                          <div className="space-y-0.5">
                                            {Object.entries(prod.champsCustom)
                                              .filter(([, v]) => v !== null && v !== undefined && v !== '')
                                              .map(([k, v]) => (
                                                <p key={k} className="text-xs text-gray-600">
                                                  <span className="font-medium">
                                                    {k.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())} :{" "}
                                                  </span>
                                                  {typeof v === 'boolean' ? (v ? 'Oui' : 'Non') : String(v)}
                                                </p>
                                              ))}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                    <div className="text-right shrink-0">
                                      <p className="text-sm font-semibold text-gray-700">{prod.prix.toFixed(2)} €</p>
                                    </div>
                                  </div>
                                </div>
                              )
                            })}
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Dialog: Modifier patient */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier le patient</DialogTitle>
            <DialogDescription>
              Modification de la fiche de {patient.prenom} {patient.nom}
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div>
              <Label>Prénom *</Label>
              <Input placeholder="Prénom" value={editForm.prenom}
                onChange={e => setEditForm({ ...editForm, prenom: e.target.value })} className="mt-1 transition-[box-shadow] duration-150" />
            </div>
            <div>
              <Label>Nom *</Label>
              <Input placeholder="Nom" value={editForm.nom}
                onChange={e => setEditForm({ ...editForm, nom: e.target.value })} className="mt-1 transition-[box-shadow] duration-150" />
            </div>
            <div>
              <Label>Date de naissance</Label>
              <Input type="date" value={editForm.dateNaissance}
                onChange={e => setEditForm({ ...editForm, dateNaissance: e.target.value })} className="mt-1 transition-[box-shadow] duration-150" />
            </div>
            <div>
              <Label>N° sécurité sociale</Label>
              <Input placeholder="X XX XX XX XXX XXX XX" value={editForm.numSecu}
                onChange={e => setEditForm({ ...editForm, numSecu: e.target.value })} className="mt-1 transition-[box-shadow] duration-150" />
            </div>
            <div>
              <Label>Téléphone</Label>
              <Input placeholder="06 XX XX XX XX" value={editForm.telephone}
                onChange={e => setEditForm({ ...editForm, telephone: e.target.value })} className="mt-1 transition-[box-shadow] duration-150" />
            </div>
            <div>
              <Label>Email</Label>
              <Input type="email" placeholder="email@exemple.com" value={editForm.email}
                onChange={e => setEditForm({ ...editForm, email: e.target.value })} className="mt-1 transition-[box-shadow] duration-150" />
            </div>
            <div className="col-span-2">
              <Label>Adresse</Label>
              <Input placeholder="Adresse complète" value={editForm.adresse}
                onChange={e => setEditForm({ ...editForm, adresse: e.target.value })} className="mt-1 transition-[box-shadow] duration-150" />
            </div>
            <div>
              <Label>Code postal</Label>
              <Input placeholder="75000" value={editForm.codePostal}
                onChange={e => setEditForm({ ...editForm, codePostal: e.target.value })} className="mt-1 transition-[box-shadow] duration-150" />
            </div>
            <div>
              <Label>Ville</Label>
              <Input placeholder="Ville" value={editForm.ville}
                onChange={e => setEditForm({ ...editForm, ville: e.target.value })} className="mt-1 transition-[box-shadow] duration-150" />
            </div>
            <div className="col-span-2">
              <Label>Notes cliniques</Label>
              <Textarea placeholder="Observations, antécédents, traitements en cours..."
                value={editForm.notes}
                onChange={e => setEditForm({ ...editForm, notes: e.target.value })}
                className="mt-1 resize-none h-24 transition-[box-shadow] duration-150" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" className="active:scale-[0.97] transition-[transform,color,background-color] duration-100" onClick={() => setIsEditDialogOpen(false)}>Annuler</Button>
            <Button className="bg-amber-500 hover:bg-amber-600 active:scale-[0.97] transition-[transform,color,background-color] duration-100" onClick={handleUpdate}
              disabled={!editForm.nom || !editForm.prenom}>
              Enregistrer les modifications
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
