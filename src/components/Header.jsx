import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Header({ sessionId, onEnd }) {
  const navigate = useNavigate();
  const TOTAL_SECONDS = 15 * 60;
  const [timeLeft, setTimeLeft] = useState(TOTAL_SECONDS);
  const intervalRef = useRef(null);

  // Format mm:ss
  const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  useEffect(() => {
    if (!sessionId) return;

    const key = `uc_start_${sessionId}`;
    let start = sessionStorage.getItem(key);

    if (!start) {
      // First-time: store start timestamp
      sessionStorage.setItem(key, String(Date.now()));
      start = String(Date.now());
    }

    const computeLeft = () => {
      const startedAt = Number(start);
      const elapsed = Math.floor((Date.now() - startedAt) / 1000);
      const left = TOTAL_SECONDS - elapsed;
      setTimeLeft(left > 0 ? left : 0);

      if (left <= 0) {
        // Session expired
        clearInterval(intervalRef.current);
        sessionStorage.removeItem(key);
        try { onEnd?.(); } catch (e) {}
        navigate("/", { replace: true });
      }
    };

    computeLeft();
    intervalRef.current = setInterval(computeLeft, 1000);

    return () => {
      clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  const handleEndClick = () => {
    const ok = window.confirm("End this session for all devices?");
    if (!ok) return;

    // Clear stored start time and call parent cleanup + navigate
    try {
      sessionStorage.removeItem(`uc_start_${sessionId}`);
    } catch (e) {}
    try { onEnd?.(); } catch (e) {}
    navigate("/", { replace: true });
  };

  // progress percent for a small visual indicator
  const percent = Math.max(0, Math.min(100, Math.round((timeLeft / TOTAL_SECONDS) * 100)));

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
        {/* Session badge */}
        <div className="text-sm text-white/70 px-3 py-2 rounded bg-[#071723]">
          <span className="font-medium">Session:</span> <span className="ml-2 font-mono">{sessionId}</span>
        </div>

        {/* Timer badge */}
        <div className="flex flex-col items-end">
          <div className="px-3 py-2 rounded bg-[#071723] text-white text-sm font-medium flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white/80" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
              <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M21 12A9 9 0 1 1 3 12a9 9 0 0 1 18 0z" />
            </svg>
            <span>{formatTime(timeLeft)}</span>
          </div>
          <div className="w-28 h-1 bg-white/5 rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-indigo-500/80"
              style={{ width: `${percent}%`, transition: "width 500ms linear" }}
            />
          </div>
        </div>

        <button
          onClick={handleEndClick}
          className="bg-rose-500 hover:bg-rose-400 text-white px-4 py-2 rounded-full text-sm font-semibold focus:outline-none focus-visible:ring-4 focus-visible:ring-rose-400/30"
        >
          End Session
        </button>
      </div>
    </header>
  );
}
