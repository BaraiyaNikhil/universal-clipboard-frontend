export default function QRCodeCard({ sessionId, qrSrc, onShare }) {
  return (
    <aside className="w-full md:w-80 bg-[#0b1220] rounded-2xl p-6 shadow-md">
      <h4 className="text-white/90 font-semibold mb-4">Session QR Code</h4>

      <div className="bg-white/5 rounded-lg p-4 mb-4 flex items-center justify-center">
        {qrSrc ? (
          <img src={qrSrc} alt="session-qr" className="h-48 w-48 object-contain rounded-md" />
        ) : (
          <div className="h-48 w-48 rounded-md bg-white/3 flex items-center justify-center text-white/40">QR</div>
        )}
      </div>

      <div className="text-white/60 text-sm mb-3">
        <div className="mb-1">Session ID</div>
        <div className="bg-[#06101a] px-3 py-2 rounded text-sm font-mono break-all">{sessionId}</div>
      </div>

      <button
        onClick={() => onShare?.()}
        className="w-full inline-flex items-center justify-center gap-2 bg-white/6 hover:bg-white/8 text-white px-3 py-2 rounded-lg text-sm"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7" />
          <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M12 3v12" />
        </svg>
        Share Session
      </button>
    </aside>
  );
}
