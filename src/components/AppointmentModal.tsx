import { createPortal } from "react-dom";

export default function AppointmentModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 p-2 sm:p-4">
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 max-w-sm sm:max-w-2xl w-full max-h-[85vh] sm:max-h-[90vh] relative flex flex-col items-center overflow-hidden">
        <button
          className="absolute top-1 sm:top-2 right-1 sm:right-2 text-xl sm:text-2xl text-gray-500 hover:text-brand"
          onClick={onClose}
          aria-label="Fermer le pop-up"
        >
          &times;
        </button>
        <iframe
          src="https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ0ayWAbT8czzs4r-Sews_x9ey_xrrmBhInxA5CZ_PpeekOpzrYP6ocyuMWBjxsqCC0jTAJ1YLBi"
          title="Prendre rendez-vous Podomus"
          width="100%"
          height="400"
          className="rounded-lg border-0 h-[350px] sm:h-[500px]"
          allowFullScreen
        />
      </div>
    </div>,
    document.body
  );
} 