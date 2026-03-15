import { useState } from 'react'
import { Button } from './ui/button'
import { useToast } from './ui/use-toast'
import { Loader2, Calendar } from 'lucide-react'
import { RescheduleModal } from './RescheduleModal'

interface AppointmentActionsProps {
  appointmentId: string
  currentStatus: string
  appointmentDate?: Date
  appointmentTime?: string
  appointmentDuration?: number
  onStatusChange: () => void
}

export function AppointmentActions({
  appointmentId,
  currentStatus,
  appointmentDate = new Date(),
  appointmentTime = "10:00",
  appointmentDuration = 30,
  onStatusChange
}: AppointmentActionsProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState<string | null>(null)
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false)

  const updateStatus = async (newStatus: string) => {
    setLoading(newStatus)
    try {
      const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Une erreur est survenue')
      }

      toast({
        title: 'Statut mis à jour',
        description: `Le rendez-vous a été marqué comme ${getStatusLabel(newStatus)}`,
      })
      
      onStatusChange()
    } catch (error) {
      toast({
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Une erreur est survenue',
        variant: 'destructive',
      })
    } finally {
      setLoading(null)
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'Programmé'
      case 'completed':
        return 'Terminé'
      case 'cancelled':
        return 'Annulé'
      case 'no_show':
        return 'Absent'
      default:
        return status
    }
  }

  // Fonction pour déterminer si un bouton doit être affiché en fonction du statut actuel
  const shouldShowButton = (buttonStatus: string) => {
    // Logique pour déterminer quels boutons sont pertinents selon le statut actuel
    if (currentStatus === 'cancelled' || currentStatus === 'completed') {
      // Si déjà annulé ou terminé, montrer uniquement le bouton pour reprogrammer
      return buttonStatus === 'scheduled'
    }
    
    if (currentStatus === 'no_show') {
      // Si absent, permettre de reprogrammer ou marquer comme terminé
      return buttonStatus === 'scheduled' || buttonStatus === 'completed'
    }
    
    // Si programmé, montrer tous les autres statuts
    return buttonStatus !== currentStatus
  }

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {shouldShowButton('completed') && (
        <Button
          size="sm"
          variant="default"
          className="bg-green-600 hover:bg-green-700"
          onClick={() => updateStatus('completed')}
          disabled={!!loading}
        >
          {loading === 'completed' ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Terminé'}
        </Button>
      )}
      
      {shouldShowButton('cancelled') && (
        <Button
          size="sm"
          variant="destructive"
          onClick={() => updateStatus('cancelled')}
          disabled={!!loading}
        >
          {loading === 'cancelled' ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Annuler'}
        </Button>
      )}
      
      {shouldShowButton('no_show') && (
        <Button
          size="sm"
          variant="outline"
          className="border-amber-500 text-amber-500 hover:bg-amber-50"
          onClick={() => updateStatus('no_show')}
          disabled={!!loading}
        >
          {loading === 'no_show' ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Absent'}
        </Button>
      )}
      
      {shouldShowButton('scheduled') && (
        <Button
          size="sm"
          variant="outline"
          className="border-blue-500 text-blue-500 hover:bg-blue-50"
          onClick={() => setRescheduleModalOpen(true)}
          disabled={!!loading}
        >
          <Calendar className="h-4 w-4 mr-1" /> Reprogrammer
        </Button>
      )}
      
      <RescheduleModal
        open={rescheduleModalOpen}
        onClose={() => setRescheduleModalOpen(false)}
        appointmentId={appointmentId}
        currentDate={appointmentDate}
        currentTime={appointmentTime}
        currentDuration={appointmentDuration}
        onReschedule={onStatusChange}
      />
    </div>
  )
}
