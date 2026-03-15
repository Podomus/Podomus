import { motion } from "framer-motion"
import { Clock, Trash } from "lucide-react"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { AppointmentActions } from "./AppointmentActions"

interface AppointmentCardProps {
  appointment: {
    id: string
    time: string
    patientName: string
    duration: number
    status: string
  }
  onDelete: () => void
  onStatusChange: () => void
}

export function AppointmentCard({ appointment, onDelete, onStatusChange }: AppointmentCardProps) {
  return (
    <motion.div 
      className="p-4 bg-white rounded-lg border border-softtail-100 hover:border-softtail-200 hover:shadow-md transition-all"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-start gap-3">
          <div 
            className={`flex flex-col items-center justify-center w-16 h-16 rounded-full
              ${appointment.status === "scheduled" ? "bg-amber-50" : 
               appointment.status === "completed" ? "bg-green-50" :
               appointment.status === "no_show" ? "bg-orange-50" : "bg-red-50"}`}
          >
            <Clock size={16} className={`
              ${appointment.status === "scheduled" ? "text-amber-600" : 
               appointment.status === "completed" ? "text-green-600" :
               appointment.status === "no_show" ? "text-orange-600" : "text-red-600"}`} 
            />
            <span className="text-sm font-medium text-softtail-800">{appointment.time}</span>
            <span className="text-xs text-softtail-500">{appointment.duration} min</span>
          </div>
          <div>
            <h4 className="font-medium text-softtail-800">{appointment.patientName}</h4>
            <div className="flex items-center gap-2 mt-1">
              <Badge 
                className={
                  appointment.status === "scheduled" ? "bg-amber-500" : 
                  appointment.status === "completed" ? "bg-green-500" :
                  appointment.status === "no_show" ? "bg-orange-500" : "bg-red-500"
                }
              >
                {appointment.status === "scheduled" ? "Planifié" : 
                 appointment.status === "completed" ? "Terminé" : 
                 appointment.status === "no_show" ? "Absent" : "Annulé"}
              </Badge>
            </div>
            
            {/* Boutons de gestion des rendez-vous */}
            <div className="mt-2">
              <AppointmentActions 
                appointmentId={appointment.id} 
                currentStatus={appointment.status}
                appointmentTime={appointment.time}
                appointmentDuration={appointment.duration}
                onStatusChange={onStatusChange} 
              />
            </div>
          </div>
        </div>
        
        <div className="flex items-center">
          <Button 
            variant="outline" 
            size="icon"
            className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
            onClick={onDelete}
          >
            <Trash size={16} />
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
