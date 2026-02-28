"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { SidebarContent } from "@/components/Sidebar";

type MobileSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      panelRef.current?.focus();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <div className={`fixed inset-0 z-[70] md:hidden ${isOpen ? "" : "pointer-events-none"}`} aria-hidden={!isOpen}>
      <button
        onClick={onClose}
        className={`absolute inset-0 bg-black/60 transition-opacity ${isOpen ? "opacity-100" : "opacity-0"}`}
        aria-label="Close navigation drawer"
      />

      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        className={`relative flex h-full w-[86%] max-w-[320px] flex-col border-r border-[var(--line)] bg-[rgba(7,11,17,0.96)] shadow-2xl backdrop-blur-xl transition-transform duration-200 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-end p-3">
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--line)] text-[var(--text-muted)] hover:text-white"
            aria-label="Dismiss navigation drawer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <SidebarContent collapsed={false} onAction={onClose} />
      </div>
    </div>
  );
}
