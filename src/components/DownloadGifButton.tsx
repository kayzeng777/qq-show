import { useState } from "react";
import type { RefObject } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import type { QQShowOutfit } from "../types/qqShow";
import type { GifExportProgress } from "../utils/gifExport";
import { resolveOutfitLayers } from "../utils/resolveOutfitLayers";

interface DownloadGifButtonProps {
  displayRef: RefObject<HTMLDivElement | null>;
  outfit: QQShowOutfit;
  fileName: string;
}

type ButtonState = "idle" | "working" | "complete" | "limited" | "error";

function sanitizeFileName(value: string): string {
  const safeName = value
    .replace(/[<>:"/\\|?*\u0000-\u001f]/g, "_")
    .replace(/\s+/g, "_")
    .replace(/\.+$/g, "")
    .slice(0, 80);
  return `${safeName || "qqshow"}.gif`;
}

const DownloadGifButton: React.FC<DownloadGifButtonProps> = ({
  displayRef,
  outfit,
  fileName,
}) => {
  const { t } = useLanguage();
  const [buttonState, setButtonState] = useState<ButtonState>("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const handleDownload = async () => {
    const display = displayRef.current;
    if (!display || buttonState === "working") {
      setButtonState("error");
      setStatusMessage(t.app.gifDownloadFailed);
      return;
    }

    setButtonState("working");
    setStatusMessage(t.app.generatingGif);
    try {
      const layers = resolveOutfitLayers(outfit);
      const { createOutfitGif } = await import("../utils/gifExport");
      const onProgress = (_progress: GifExportProgress) => {
        setStatusMessage(t.app.generatingGif);
      };
      const result = await createOutfitGif(display, layers, onProgress);
      const objectUrl = URL.createObjectURL(result.blob);
      const anchor = document.createElement("a");
      anchor.href = objectUrl;
      anchor.download = sanitizeFileName(fileName);
      anchor.style.display = "none";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);

      if (result.loopWasCapped) {
        setButtonState("limited");
        setStatusMessage(t.app.gifLoopCapped);
      } else {
        setButtonState("complete");
        setStatusMessage(t.app.gifDownloadComplete);
      }
    } catch (error) {
      console.error("GIF export failed:", error);
      setButtonState("error");
      setStatusMessage(t.app.gifDownloadFailed);
    }
  };

  const buttonText = buttonState === "working"
    ? t.app.generatingGif
    : buttonState === "complete"
      ? t.app.gifDownloadComplete
      : t.app.downloadGif;

  return (
    <div className="gif-export-control">
      <button
        className="gif-export-button"
        type="button"
        onClick={handleDownload}
        disabled={buttonState === "working"}
        title={t.app.downloadGif}
        aria-label={t.app.downloadGif}
      >
        {buttonText}
      </button>
      <span className="gif-export-status" role="status" aria-live="polite">
        {statusMessage}
      </span>
    </div>
  );
};

export default DownloadGifButton;
