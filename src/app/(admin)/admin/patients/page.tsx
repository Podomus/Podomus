"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink,
  BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator
} from "@/components/ui/breadcrumb"
import { authClient } from "@/lib/auth-client"
import {
  Search, Plus, Edit, Trash, FileText,
  CalendarPlus, Phone, Mail, MapPin, Calendar
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
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

const emptyForm = {
  nom: "", prenom: "", dateNaissance: "", email: "",
  telephone: "", adresse: "", codePostal: "", ville: "", numSecu: "", notes: ""
}

const defaultTimeSlots = [
  "07:30","08:00","08:15","08:30","08:45","09:00","09:15","09:30","09:45",
  "10:00","10:15","10:30","10:45","11:00","11:15","11:30","11:45","12:00",
  "13:30","14:00","14:15","14:30","14:45","15:00","15:15","15:30","15:45",
  "16:00","16:15","16:30","16:45","17:00","17:15","17:30","17:45",
  "18:00","18:15","18:30","18:45","19:00"
]

const EASE_OUT: [number, number, number, number] = [0.23, 1, 0.32, 1]
const fadeInUp = {
  hidden: { opacity: 0, y: 12 },
  visible: (custom: any) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.2, ease: EASE_OUT, delay: Math.min((custom as number) * 0.03, 0.2) }
  })
}
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
}

export default function PatientsPage() {
  const router = useRouter()
  const [loading, setLoading] = React.useState(true)
  const [patients, setPatients] = React.useState<Patient[]>([])
  const [searchTerm, setSearchTerm] = React.useState("")
  const [refresh, setRefresh] = React.useState(0)

  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)
  const [isAppointmentDialogOpen, setIsAppointmentDialogOpen] = React.useState(false)

  const [patientToEdit, setPatientToEdit] = React.useState<Patient | null>(null)
  const [patientToDelete, setPatientToDelete] = React.useState<Patient | null>(null)
  const [patientForAppointment, setPatientForAppointment] = React.useState<Patient | null>(null)

  const [form, setForm] = React.useState(emptyForm)

  const [existingAppointments, setExistingAppointments] = React.useState<any[]>([])
  const [availableTimeSlots, setAvailableTimeSlots] = React.useState<string[]>([])
  const [newAppointment, setNewAppointment] = React.useState({
    date: "", time: "", duration: "30"
  })

  React.useEffect(() => {
    const init = async () => {
      try {
        const { data } = await authClient.getSession()
        if (!data?.user || data.user.email !== "admin@podomus.local") {
          router.push("/login"); return
        }
        const res = await fetch('/api/patients')
        if (!res.ok) throw new Error()
        const list = await res.json()
        setPatients(list.map((p: any) => ({
          ...p,
          dateNaissance: p.dateNaissance ? new Date(p.dateNaissance) : undefined,
          createdAt: new Date(p.createdAt),
          updatedAt: new Date(p.updatedAt)
        })))
        const aptRes = await fetch('/api/appointments')
        if (aptRes.ok) setExistingAppointments(await aptRes.json())
      } catch {
        toast.error("Erreur lors du chargement des patients")
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [router, refresh])

  const calculateAvailableTimeSlots = (date: string, duration = newAppointment.duration) => {
    if (!date) return
    const selectedDate = new Date(date)
    const dayApts = existingAppointments.filter(apt => {
      const d = new Date(apt.date)
      return d.getFullYear() === selectedDate.getFullYear() &&
        d.getMonth() === selectedDate.getMonth() &&
        d.getDate() === selectedDate.getDate() &&
        apt.status !== 'cancelled' && apt.status !== 'no_show'
    })
    const available = defaultTimeSlots.filter(slot => {
      const [h, m] = slot.split(':').map(Number)
      const slotStart = new Date(selectedDate); slotStart.setHours(h, m, 0)
      const slotEnd = new Date(slotStart); slotEnd.setMinutes(slotEnd.getMinutes() + parseInt(duration))
      return !dayApts.some(apt => {
        const s = new Date(apt.date)
        const e = new Date(s); e.setMinutes(e.getMinutes() + (apt.duration || 30))
        return slotStart < e && slotEnd > s
      })
    })
    setAvailableTimeSlots(available)
  }

  const filtered = patients.filter(p => {
    const q = searchTerm.toLowerCase()
    return p.nom.toLowerCase().includes(q) || p.prenom.toLowerCase().includes(q) ||
      p.telephone?.includes(q) || p.email?.toLowerCase().includes(q)
  })

  const handleCreate = async () => {
    try {
      const res = await fetch('/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          dateNaissance: form.dateNaissance ? new Date(form.dateNaissance).toISOString() : undefined,
          email: form.email || undefined, telephone: form.telephone || undefined,
          adresse: form.adresse || undefined, codePostal: form.codePostal || undefined,
          ville: form.ville || undefined, numSecu: form.numSecu || undefined,
          notes: form.notes || undefined
        })
      })
      if (!res.ok) { const e = await res.json(); throw new Error(e.error || "Erreur") }
      setIsAddDialogOpen(false); setForm(emptyForm)
      toast.success("Patient créé avec succès")
      setRefresh(r => r + 1)
    } catch (e: any) { toast.error(e.message || "Une erreur est survenue") }
  }

  const handleUpdate = async () => {
    if (!patientToEdit) return
    try {
      const res = await fetch(`/api/patients/${patientToEdit.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          dateNaissance: form.dateNaissance ? new Date(form.dateNaissance).toISOString() : undefined,
          email: form.email || undefined, telephone: form.telephone || undefined,
          adresse: form.adresse || undefined, codePostal: form.codePostal || undefined,
          ville: form.ville || undefined, numSecu: form.numSecu || undefined,
          notes: form.notes || undefined
        })
      })
      if (!res.ok) { const e = await res.json(); throw new Error(e.error || "Erreur") }
      setIsEditDialogOpen(false); setPatientToEdit(null); setForm(emptyForm)
      toast.success("Patient mis à jour avec succès")
      setRefresh(r => r + 1)
    } catch (e: any) { toast.error(e.message || "Une erreur est survenue") }
  }

  const handleDelete = async () => {
    if (!patientToDelete) return
    try {
      const res = await fetch(`/api/patients/${patientToDelete.id}`, { method: 'DELETE' })
      if (!res.ok) { const e = await res.json(); throw new Error(e.error || "Erreur") }
      setIsDeleteDialogOpen(false); setPatientToDelete(null)
      toast.success("Patient supprimé avec succès")
      setRefresh(r => r + 1)
    } catch (e: any) { toast.error(e.message || "Une erreur est survenue") }
  }

  const handleCreateAppointment = async () => {
    if (!patientForAppointment || !newAppointment.date || !newAppointment.time) {
      toast.error("Veuillez remplir tous les champs obligatoires"); return
    }
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId: patientForAppointment.id,
          patientName: `${patientForAppointment.prenom} ${patientForAppointment.nom}`,
          patientEmail: patientForAppointment.email || '',
          patientPhone: patientForAppointment.telephone || '',
          date: new Date(newAppointment.date),
          time: newAppointment.time,
          duration: parseInt(newAppointment.duration),
          status: 'scheduled'
        })
      })
      if (res.ok) {
        toast.success("Rendez-vous créé avec succès")
        setIsAppointmentDialogOpen(false)
        setPatientForAppointment(null)
        setNewAppointment({ date: "", time: "", duration: "30" })
        const aptRes = await fetch('/api/appointments')
        if (aptRes.ok) setExistingAppointments(await aptRes.json())
      } else {
        const e = await res.json()
        toast.error(e.message || "Erreur lors de la création du rendez-vous")
      }
    } catch { toast.error("Erreur lors de la création du rendez-vous") }
  }

  const openEditDialog = (p: Patient) => {
    setPatientToEdit(p)
    setForm({
      nom: p.nom, prenom: p.prenom,
      dateNaissance: p.dateNaissance ? p.dateNaissance.toISOString().split('T')[0] : "",
      email: p.email || "", telephone: p.telephone || "", adresse: p.adresse || "",
      codePostal: p.codePostal || "", ville: p.ville || "",
      numSecu: p.numSecu || "", notes: p.notes || ""
    })
    setIsEditDialogOpen(true)
  }

  const renderFormFields = () => (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label>Prénom *</Label>
        <Input placeholder="Prénom" value={form.prenom}
          onChange={e => setForm({ ...form, prenom: e.target.value })} className="mt-1 transition-[box-shadow] duration-150" />
      </div>
      <div>
        <Label>Nom *</Label>
        <Input placeholder="Nom" value={form.nom}
          onChange={e => setForm({ ...form, nom: e.target.value })} className="mt-1 transition-[box-shadow] duration-150" />
      </div>
      <div>
        <Label>Date de naissance</Label>
        <Input type="date" value={form.dateNaissance}
          onChange={e => setForm({ ...form, dateNaissance: e.target.value })} className="mt-1 transition-[box-shadow] duration-150" />
      </div>
      <div>
        <Label>N° sécurité sociale</Label>
        <Input placeholder="X XX XX XX XXX XXX XX" value={form.numSecu}
          onChange={e => setForm({ ...form, numSecu: e.target.value })} className="mt-1 transition-[box-shadow] duration-150" />
      </div>
      <div>
        <Label>Téléphone</Label>
        <Input placeholder="06 XX XX XX XX" value={form.telephone}
          onChange={e => setForm({ ...form, telephone: e.target.value })} className="mt-1 transition-[box-shadow] duration-150" />
      </div>
      <div>
        <Label>Email</Label>
        <Input type="email" placeholder="email@exemple.com" value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })} className="mt-1 transition-[box-shadow] duration-150" />
      </div>
      <div className="col-span-2">
        <Label>Adresse</Label>
        <Input placeholder="Adresse complète" value={form.adresse}
          onChange={e => setForm({ ...form, adresse: e.target.value })} className="mt-1 transition-[box-shadow] duration-150" />
      </div>
      <div>
        <Label>Code postal</Label>
        <Input placeholder="75000" value={form.codePostal}
          onChange={e => setForm({ ...form, codePostal: e.target.value })} className="mt-1 transition-[box-shadow] duration-150" />
      </div>
      <div>
        <Label>Ville</Label>
        <Input placeholder="Ville" value={form.ville}
          onChange={e => setForm({ ...form, ville: e.target.value })} className="mt-1 transition-[box-shadow] duration-150" />
      </div>
      <div className="col-span-2">
        <Label>Notes cliniques</Label>
        <Textarea placeholder="Observations, antécédents, traitements en cours..."
          value={form.notes}
          onChange={e => setForm({ ...form, notes: e.target.value })}
          className="mt-1 resize-none h-24 transition-[box-shadow] duration-150" />
      </div>
    </div>
  )

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
                    <BreadcrumbPage>Patients</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
              <h1 className="text-2xl font-bold text-gray-800">Gestion des patients</h1>
              <p className="text-sm text-gray-500 mt-0.5">
                {loading
                  ? "Chargement..."
                  : `${patients.length} patient${patients.length !== 1 ? "s" : ""} enregistré${patients.length !== 1 ? "s" : ""}`}
              </p>
            </div>
            <Button
              className="mt-4 sm:mt-0 bg-softtail-600 hover:bg-softtail-700 active:scale-[0.97] transition-[transform,color,background-color] duration-100"
              onClick={() => { setForm(emptyForm); setIsAddDialogOpen(true) }}
            >
              <Plus size={16} className="mr-2" /> Nouveau patient
            </Button>
          </div>

          {/* Search */}
          <div className="mb-6 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <Input
              className="pl-10 transition-[box-shadow] duration-150"
              placeholder="Rechercher par nom, prénom ou téléphone..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          {/* List */}
          {loading ? (
            <div className="text-center py-16 text-gray-500">Chargement des patients...</div>
          ) : filtered.length === 0 ? (
            <motion.div
              className="text-center py-16 text-gray-400"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            >
              {searchTerm ? "Aucun patient ne correspond à votre recherche." : "Aucun patient enregistré."}
            </motion.div>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
            >
              {filtered.map((patient, index) => (
                <motion.div key={patient.id} variants={fadeInUp} custom={index}>
                  <Card
                    className="border border-gray-200 hover:shadow-md transition-[transform,box-shadow] duration-150 h-full flex flex-col cursor-pointer active:scale-[0.98]"
                    onClick={() => router.push(`/admin/patients/${patient.id}`)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start gap-2">
                        <div className="min-w-0">
                          <CardTitle className="text-base font-semibold text-gray-800">
                            {patient.prenom} {patient.nom}
                          </CardTitle>
                          {patient.dateNaissance && (
                            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                              <Calendar size={11} />
                              Né(e) le {patient.dateNaissance.toLocaleDateString('fr-FR')}
                            </p>
                          )}
                        </div>
                        {patient.ville && (
                          <Badge variant="outline" className="text-xs shrink-0">
                            {patient.ville}
                          </Badge>
                        )}
                      </div>
                    </CardHeader>

                    <CardContent className="pb-3 flex-1 space-y-1.5">
                      {patient.telephone && (
                        <p className="text-sm text-gray-600 flex items-center gap-2">
                          <Phone size={13} className="text-gray-400 shrink-0" />
                          {patient.telephone}
                        </p>
                      )}
                      {patient.email && (
                        <p className="text-sm text-gray-600 flex items-center gap-2">
                          <Mail size={13} className="text-gray-400 shrink-0" />
                          <span className="truncate">{patient.email}</span>
                        </p>
                      )}
                      {(patient.codePostal || patient.ville) && (
                        <p className="text-sm text-gray-600 flex items-center gap-2">
                          <MapPin size={13} className="text-gray-400 shrink-0" />
                          {[patient.codePostal, patient.ville].filter(Boolean).join(" ")}
                        </p>
                      )}
                    </CardContent>

                    <Separator />

                    <CardFooter className="pt-3 flex flex-wrap gap-2">
                      <Button size="sm" variant="outline"
                        className="text-softtail-600 border-softtail-200 hover:bg-softtail-50 active:scale-[0.97] transition-[transform,color,background-color] duration-100"
                        onClick={e => { e.stopPropagation(); router.push(`/admin/patients/${patient.id}`) }}
                      >
                        <FileText size={13} className="mr-1" /> Voir dossier
                      </Button>
                      <Button size="sm" variant="outline"
                        className="text-amber-600 border-amber-200 hover:bg-amber-50 active:scale-[0.97] transition-[transform,color,background-color] duration-100"
                        onClick={e => { e.stopPropagation(); openEditDialog(patient) }}
                      >
                        <Edit size={13} className="mr-1" /> Modifier
                      </Button>
                      <Button size="sm" variant="outline"
                        className="text-green-600 border-green-200 hover:bg-green-50 active:scale-[0.97] transition-[transform,color,background-color] duration-100"
                        onClick={e => { e.stopPropagation(); setPatientForAppointment(patient); setIsAppointmentDialogOpen(true) }}
                      >
                        <CalendarPlus size={13} className="mr-1" /> Rendez-vous
                      </Button>
                      <Button size="sm" variant="outline"
                        className="text-red-600 border-red-200 hover:bg-red-50 ml-auto active:scale-[0.97] transition-[transform,color,background-color] duration-100"
                        onClick={e => { e.stopPropagation(); setPatientToDelete(patient); setIsDeleteDialogOpen(true) }}
                      >
                        <Trash size={13} className="mr-1" /> Supprimer
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {/* Dialog: Nouveau patient */}
      <Dialog open={isAddDialogOpen} onOpenChange={open => { setIsAddDialogOpen(open); if (!open) setForm(emptyForm) }}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nouveau patient</DialogTitle>
            <DialogDescription>
              Créez une nouvelle fiche patient. Les champs marqués d'un * sont obligatoires.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">{renderFormFields()}</div>
          <DialogFooter>
            <Button variant="outline" className="active:scale-[0.97] transition-[transform,color,background-color] duration-100" onClick={() => setIsAddDialogOpen(false)}>Annuler</Button>
            <Button className="bg-softtail-600 hover:bg-softtail-700 active:scale-[0.97] transition-[transform,color,background-color] duration-100" onClick={handleCreate}
              disabled={!form.nom || !form.prenom}>
              Créer le patient
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog: Modifier patient */}
      <Dialog open={isEditDialogOpen} onOpenChange={open => { setIsEditDialogOpen(open); if (!open) { setPatientToEdit(null); setForm(emptyForm) } }}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier le patient</DialogTitle>
            <DialogDescription>
              {patientToEdit && `Fiche de ${patientToEdit.prenom} ${patientToEdit.nom}`}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">{renderFormFields()}</div>
          <DialogFooter>
            <Button variant="outline" className="active:scale-[0.97] transition-[transform,color,background-color] duration-100" onClick={() => setIsEditDialogOpen(false)}>Annuler</Button>
            <Button className="bg-softtail-600 hover:bg-softtail-700 active:scale-[0.97] transition-[transform,color,background-color] duration-100" onClick={handleUpdate}
              disabled={!form.nom || !form.prenom}>
              Enregistrer les modifications
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog: Supprimer patient */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={open => { setIsDeleteDialogOpen(open); if (!open) setPatientToDelete(null) }}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              {patientToDelete && (
                <>
                  Vous êtes sur le point de supprimer la fiche de{" "}
                  <strong>{patientToDelete.prenom} {patientToDelete.nom}</strong>.{" "}
                  Cette action est irréversible et supprimera toutes les données associées au patient.
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" className="active:scale-[0.97] transition-[transform,color,background-color] duration-100" onClick={() => setIsDeleteDialogOpen(false)}>Annuler</Button>
            <Button variant="destructive" className="active:scale-[0.97] transition-[transform,color,background-color] duration-100" onClick={handleDelete}>Supprimer définitivement</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog: Planifier rendez-vous */}
      <Dialog open={isAppointmentDialogOpen} onOpenChange={open => {
        setIsAppointmentDialogOpen(open)
        if (!open) { setPatientForAppointment(null); setNewAppointment({ date: "", time: "", duration: "30" }); setAvailableTimeSlots([]) }
      }}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Planifier un rendez-vous</DialogTitle>
            <DialogDescription>
              {patientForAppointment &&
                `Nouveau rendez-vous pour ${patientForAppointment.prenom} ${patientForAppointment.nom}`}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-1.5">
              <Label>Date du rendez-vous *</Label>
              <Input type="date"
                value={newAppointment.date}
                onChange={e => {
                  setNewAppointment({ ...newAppointment, date: e.target.value, time: "" })
                  calculateAvailableTimeSlots(e.target.value, newAppointment.duration)
                }}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Durée</Label>
              <Select value={newAppointment.duration}
                onValueChange={v => {
                  setNewAppointment({ ...newAppointment, duration: v, time: "" })
                  if (newAppointment.date) calculateAvailableTimeSlots(newAppointment.date, v)
                }}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="20">20 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="60">1 heure</SelectItem>
                  <SelectItem value="75">1h15</SelectItem>
                  <SelectItem value="90">1h30</SelectItem>
                  <SelectItem value="120">2 heures</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Heure *</Label>
              <Select
                value={newAppointment.time}
                onValueChange={v => setNewAppointment({ ...newAppointment, time: v })}
                disabled={!newAppointment.date}
              >
                <SelectTrigger>
                  <SelectValue placeholder={
                    !newAppointment.date ? "Sélectionnez d'abord une date"
                      : availableTimeSlots.length === 0 ? "Aucun créneau disponible"
                        : "Sélectionner l'heure"
                  } />
                </SelectTrigger>
                <SelectContent>
                  {availableTimeSlots.map(slot => (
                    <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {newAppointment.date && availableTimeSlots.length === 0 && (
                <p className="text-xs text-red-500">Aucun créneau disponible. Choisissez une autre date.</p>
              )}
              {newAppointment.date && availableTimeSlots.length > 0 && (
                <p className="text-xs text-green-600">{availableTimeSlots.length} créneau(x) disponible(s)</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" className="active:scale-[0.97] transition-[transform,color,background-color] duration-100" onClick={() => setIsAppointmentDialogOpen(false)}>Annuler</Button>
            <Button className="active:scale-[0.97] transition-[transform,color,background-color] duration-100" onClick={handleCreateAppointment}
              disabled={!newAppointment.date || !newAppointment.time}>
              <CalendarPlus size={14} className="mr-2" /> Créer le rendez-vous
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
