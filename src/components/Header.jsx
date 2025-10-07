export default function Header({ sessionId, onEnd }) {
  return (
    <header className="bg-[#0f1720] border-b border-white/6 p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
          {/* clipboard icon */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M9 5h6a2 2 0 0 1 2 2v12H7V7a2 2 0 0 1 2-2z" />
          </svg>
        </div>

        <div>
          <div className="font-semibold text-white">Universal Clipboard</div>
          <div className="text-xs text-white/60">Active Session</div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-sm text-white/70 px-3 py-2 rounded bg-[#071723]">
          <span className="font-medium">Session:</span> <span className="ml-2 font-mono">{sessionId}</span>
        </div>

        <button
          onClick={onEnd}
          className="bg-rose-500 hover:bg-rose-400 text-white px-4 py-2 rounded-full text-sm font-semibold focus:outline-none focus-visible:ring-4 focus-visible:ring-rose-400/30"
        >
          End Session
        </button>
      </div>
    </header>
  );
}
