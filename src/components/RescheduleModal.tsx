import { useState } from "react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Calendar as CalendarIcon } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Label } from "@/components/ui/label"

interface RescheduleModalProps {
  open: boolean
  onClose: () => void
  appointmentId: string
  currentDate?: Date
  currentTime?: string
  currentDuration?: number
  onReschedule: () => void
}

export function RescheduleModal({
  open,
  onClose,
  appointmentId,
  currentDate = new Date(),
  currentTime = "10:00",
  currentDuration = 30,
  onReschedule
}: RescheduleModalProps) {
  const [loading, setLoading] = useState(false)
  const [date, setDate] = useState<Date>(currentDate)
  const [time, setTime] = useState<string>(currentTime)
  const [duration, setDuration] = useState<number>(currentDuration)
  
  const handleReschedule = async () => {
    try {
      setLoading(true)
      
      // Préparer la date avec l'heure correcte
      const appointmentDate = new Date(date)
      const [hours, minutes] = time.split(':').map(Number)
      appointmentDate.setHours(hours, minutes, 0)
      
      const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: appointmentDate.toISOString(),
          time,
          duration,
          status: 'scheduled', // Remettre le statut à programmé
        }),
      })
      
      if (!response.ok) {
        // En cas de conflit (horaire déjà réservé)
        if (response.status === 409) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'Créneau déjà réservé')
        }
        throw new Error('Une erreur est survenue lors de la reprogrammation')
      }
      
      toast.success('Rendez-vous reprogrammé avec succès')
      onReschedule()
      onClose()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erreur lors de la reprogrammation')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] data-[state=open]:duration-200 data-[state=closed]:duration-150">
        <DialogHeader>
          <DialogTitle>Reprogrammer le rendez-vous</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label>Nouvelle date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal mt-2 active:scale-[0.97] transition-[transform,color,background-color,border-color] duration-100 ease-out"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP", { locale: fr }) : "Sélectionner une date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(date) => date && setDate(date)}
                    locale={fr}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div>
              <Label>Nouvel horaire</Label>
              <Select 
                value={time}
                onValueChange={setTime}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Sélectionner une heure" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 15 }, (_, i) => {
                    const totalMinutes = 9 * 60 + 30 + i * 30 // Commence à 9h30
                    const hour = Math.floor(totalMinutes / 60)
                    const minute = totalMinutes % 60
                    const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
                    return <SelectItem key={time} value={time}>{time}</SelectItem>
                  })}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Durée</Label>
              <Select 
                value={duration.toString()} 
                onValueChange={(value) => setDuration(parseInt(value))}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Durée" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="60">60 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={onClose} 
            disabled={loading}
            className="active:scale-[0.97] transition-[transform,color,background-color,border-color] duration-100 ease-out"
          >
            Annuler
          </Button>
          <Button 
            className="bg-softtail-600 hover:bg-softtail-700 active:scale-[0.97] transition-[transform,color,background-color,border-color] duration-100 ease-out"
            onClick={handleReschedule}
            disabled={loading}
          >
            {loading ? "En cours..." : "Reprogrammer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
