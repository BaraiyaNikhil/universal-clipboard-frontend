import { useCallback, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";

export default function QRCodeCard({ sessionId, qrSrc, onShare }) {
  const wrapperRef = useRef(null);
  const url = `${window.location.origin}/clipboard/${sessionId}`;

  const handleShare = useCallback(async () => {
    // Try native share first
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Universal Clipboard Session",
          text: "Join my Universal Clipboard session",
          url,
        });
      } else {
        // fallback: copy link
        await navigator.clipboard.writeText(url);
        // you can show a toast here (react-hot-toast) if installed
        alert("Session link copied to clipboard");
      }
      onShare?.();
    } catch (err) {
      console.error("Share failed:", err);
      try { await navigator.clipboard.writeText(url); alert("Session link copied to clipboard"); } catch (e) {}
      onShare?.();
    }
  }, [url, onShare]);

  return (
    <aside className="w-full md:w-80 bg-[#0b1220] rounded-2xl p-6 shadow-md">
      <h4 className="text-white/90 font-semibold mb-4">Session QR Code</h4>

      <div ref={wrapperRef} className="bg-white/5 rounded-lg p-4 mb-4 flex items-center justify-center">
        {qrSrc ? (
          <img src={qrSrc} alt="session-qr" className="h-48 w-48 object-contain rounded-md" />
        ) : (
          <QRCodeCanvas
            value={url}
            size={200}
            bgColor="#0b1220"
            fgColor="#6366F1"
            level="M"
            // style to keep rounded corners visible
            style={{ borderRadius: 8, background: "transparent" }}
          />
        )}
      </div>

      <div className="text-white/60 text-sm mb-3">
        <div className="mb-1">Session ID</div>
        <div className="bg-[#06101a] px-3 py-2 rounded text-sm font-mono break-all">{sessionId}</div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleShare}
          className="flex-1 inline-flex items-center justify-center gap-2 bg-white/6 hover:bg-white/8 text-white px-3 py-2 rounded-lg text-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7" />
            <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M12 3v12" />
          </svg>
          Share Session
        </button>
      </div>
    </aside>
  );
}
