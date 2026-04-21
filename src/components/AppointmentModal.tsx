import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

// cubic-bezier(0.23, 1, 0.32, 1) — strong ease-out, snappy entrance
const EASE_OUT = [0.23, 1, 0.32, 1] as const;

export default function AppointmentModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[99999]"
          // Outer wrapper: no opacity animation — backdrop and panel animate independently
        >
          {/* Backdrop — fades in faster than panel enters */}
          <motion.div
            className="absolute inset-0 bg-black/65 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: EASE_OUT }}
            onClick={onClose}
          />

          {/* Centering shell — not animated */}
          <div className="flex items-center justify-center h-full p-2 sm:p-4 pointer-events-none">
          {/* Modal panel — scale+opacity independent from backdrop */}
          <motion.div
            className="relative z-10 w-full bg-white flex flex-col rounded-2xl shadow-2xl overflow-hidden pointer-events-auto"
            style={{ maxWidth: '56rem', height: '96vh' }}
            initial={{ scale: 0.95, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.97, opacity: 0, y: 8, transition: { duration: 0.15, ease: EASE_OUT } }}
            transition={{ duration: 0.25, ease: EASE_OUT }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header strip — close button only */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-stone-100 flex-shrink-0">
              <span className="text-sm font-medium text-stone-500 tracking-wide">Prendre rendez-vous</span>
              <button
                className="w-8 h-8 flex items-center justify-center rounded-full text-stone-400 text-xl leading-none transition-[color,background,transform] duration-150 ease-out hover:bg-stone-100 hover:text-stone-700 active:scale-95"
                onClick={onClose}
                aria-label="Fermer le pop-up"
              >
                &times;
              </button>
            </div>

            {/* Google Calendar iframe — fills remaining height */}
            <iframe
              src="https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ0ayWAbT8czzs4r-Sews_x9ey_xrrmBhInxA5CZ_PpeekOpzrYP6ocyuMWBjxsqCC0jTAJ1YLBi"
              title="Prendre rendez-vous Podomus"
              className="w-full border-0"
              style={{ flex: '1 1 0%', minHeight: 0 }}
              allowFullScreen
            />
          </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}