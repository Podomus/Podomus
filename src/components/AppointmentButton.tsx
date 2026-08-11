"use client";
import { useState } from "react";
import { IoCalendarOutline } from "react-icons/io5";
import AppointmentModal from "./AppointmentModal";

export default function AppointmentButton({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`inline-flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.97] ${className ?? ""}`}
      >
        {children ?? "Prendre rendez-vous"}
        <IoCalendarOutline size={18} />
      </button>
      <AppointmentModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
