import { useCallback, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";

export default function QRCodeCard({ sessionId }) {
  const wrapperRef = useRef(null);
  const url = `${window.location.origin}/clipboard/${sessionId}`;

  const handleShare = useCallback(async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Universal Clipboard Session",
          text: "Join my Universal Clipboard session",
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        alert("Session link copied to clipboard");
      }
    } catch (err) {
      console.error("Share failed:", err);
      try {
        await navigator.clipboard.writeText(url);
        alert("Session link copied to clipboard");
      } catch (e) {}
    }
  }, [url]);

  return (
    <aside className="md:col-span-1 space-y-4">
      <div className="bg-[#0f172a] p-5 rounded-2xl shadow-md">
        <h4 className="text-white/90 font-semibold mb-4 flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            viewBox="0 -960 960 960"
            fill="#F3F3F3"
          >
            <path d="M120-520v-320h320v320H120Zm80-80h160v-160H200v160Zm-80 480v-320h320v320H120Zm80-80h160v-160H200v160Zm320-320v-320h320v320H520Zm80-80h160v-160H600v160Zm160 480v-80h80v80h-80ZM520-360v-80h80v80h-80Zm80 80v-80h80v80h-80Zm-80 80v-80h80v80h-80Zm80 80v-80h80v80h-80Zm80-80v-80h80v80h-80Zm0-160v-80h80v80h-80Zm80 80v-80h80v80h-80Z" />
          </svg>
          Session QR Code
        </h4>

        <div className="bg-white/5 rounded-lg p-4 mb-4 flex items-center justify-center">
          <QRCodeCanvas
            value={`${window.location.origin}/clipboard/${sessionId}`}
            size={160}
            fgColor="#ffffff"
            bgColor="transparent"
          />
        </div>

        <div className="bg-[#06101a] px-3 py-2 rounded text-sm font-mono break-all mb-3">
          {sessionId}
        </div>

        <button
          onClick={() => {
            handleShare();
          }}
          className="w-full inline-flex items-center justify-center gap-2 bg-white/6 hover:bg-white/10 text-white px-3 py-2 rounded-lg text-sm"
        >
          <svg
            className="w-4 h-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 -960 960 960"
            fill="#F3F3F3"
          >
            <path d="M680-80q-50 0-85-35t-35-85q0-6 3-28L282-392q-16 15-37 23.5t-45 8.5q-50 0-85-35t-35-85q0-50 35-85t85-35q24 0 45 8.5t37 23.5l281-164q-2-7-2.5-13.5T560-760q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35q-24 0-45-8.5T598-672L317-508q2 7 2.5 13.5t.5 14.5q0 8-.5 14.5T317-452l281 164q16-15 37-23.5t45-8.5q50 0 85 35t35 85q0 50-35 85t-85 35Zm0-80q17 0 28.5-11.5T720-200q0-17-11.5-28.5T680-240q-17 0-28.5 11.5T640-200q0 17 11.5 28.5T680-160ZM200-440q17 0 28.5-11.5T240-480q0-17-11.5-28.5T200-520q-17 0-28.5 11.5T160-480q0 17 11.5 28.5T200-440Zm480-280q17 0 28.5-11.5T720-760q0-17-11.5-28.5T680-800q-17 0-28.5 11.5T640-760q0 17 11.5 28.5T680-720Zm0 520ZM200-480Zm480-280Z" />
          </svg>
          Share Session
        </button>
      </div>

      <div className="bg-[#0b1220] rounded-2xl p-4 text-sm text-white/70">
        <div className="font-medium mb-1">Session Info</div>
        <div className="text-xs text-white/50">
          Expires in 15 minutes. No account needed.
        </div>
      </div>
    </aside>
  );
}
