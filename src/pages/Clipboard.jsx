import { socketConnection } from "../wsConnection/ws";
import { useCallback, useEffect, useRef } from "react";
import Header from "../components/Header";
import QRCodeCard from "../components/QRCodeCard";

export default function ClipboardPage() {
  const sessionId = "8pqv46yr3r6";
  const socket = useRef(null);

  useEffect(() => {
    socket.current = socketConnection();
  }, []);

  const handleEnd = useCallback(() => {
    // End session handler (confirm + redirect)
    if (confirm("End session?")) {
      console.log("Ending session");
      // e.g. navigate away or call API
    }
  }, []);

  const handleShare = useCallback(() => {
    if (navigator.share) {
      navigator.share({
        title: "Universal Clipboard Session",
        text: `Join my clipboard session: ${sessionId}`,
        url: window.location.href + sessionId,
      }).catch(() => {});
    } else {
      // fallback: copy session link
      navigator.clipboard?.writeText(window.location.href);
      alert("Session link copied to clipboard");
    }
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-[#071022] text-white">
      <Header sessionId={sessionId} onEnd={handleEnd} />

      <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <QRCodeCard sessionId={sessionId} onShare={handleShare} />
        </div>
      </div>
    </div>
  );
}

