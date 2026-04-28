import { X } from "lucide-react";
import { toEmbedUrl } from "@/lib/utils";

type Props = {
  embedUrl: string;
  title?: string;
  onClose: () => void;
};

export default function VideoModal({ embedUrl, title, onClose }: Props) {
  const src = toEmbedUrl(embedUrl);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button
        className="absolute top-5 right-5 text-white/60 hover:text-white transition-colors"
        onClick={onClose}
        aria-label="Close"
      >
        <X size={28} />
      </button>

      <div
        className="w-full max-w-5xl"
        style={{ aspectRatio: "16/9" }}
        onClick={(e) => e.stopPropagation()}
      >
        <iframe
          src={`${src}?autoplay=1`}
          title={title ?? "Video"}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
          style={{ border: "none" }}
        />
      </div>
    </div>
  );
}
