import { X } from "lucide-react";

type Props = {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
};

export default function EditModal({ title, onClose, children }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-[oklch(0.17_0.018_55)] border border-white/8 p-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2
            className="text-[oklch(0.92_0.02_75)] text-lg"
            style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-[oklch(0.50_0.02_75)] hover:text-[oklch(0.92_0.02_75)] transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
