import { X } from "lucide-react";

export interface ToastState {
  message: string;
  undo?: () => void;
}

export function WatchlistToast({
  toast,
  onDismiss,
}: {
  toast: ToastState | null;
  onDismiss: () => void;
}) {
  if (!toast) return null;
  return (
    <div className="fixed bottom-22 left-1/2 z-200 flex -translate-x-1/2 items-center gap-4 bg-neutral-50 py-3 pl-4.5 pr-3.5 text-neutral-950 shadow-lg md:bottom-7">
      <span className="text-[13px] font-medium">{toast.message}</span>
      {toast.undo && (
        <button
          type="button"
          onClick={() => {
            toast.undo?.();
            onDismiss();
          }}
          className="text-[12.5px] font-semibold tracking-[0.04em] text-marquee-hover uppercase transition-opacity hover:opacity-70"
        >
          Undo
        </button>
      )}
      <button
        type="button"
        onClick={onDismiss}
        className="inline-flex transition-opacity hover:opacity-60"
      >
        <X size={14} />
      </button>
    </div>
  );
}
