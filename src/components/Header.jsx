// src/components/Header.jsx
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Header({ sessionId, onEnd }) {
  const navigate = useNavigate();
  const TOTAL_SECONDS = 15 * 60;
  const [timeLeft, setTimeLeft] = useState(TOTAL_SECONDS);
  const intervalRef = useRef(null);

  const formatTime = (s) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  useEffect(() => {
    if (!sessionId) return;

    const key = `uc_start_${sessionId}`;
    let start = sessionStorage.getItem(key);
    if (!start) {
      sessionStorage.setItem(key, String(Date.now()));
      start = String(Date.now());
    }

    const computeLeft = () => {
      const startedAt = Number(start);
      const elapsed = Math.floor((Date.now() - startedAt) / 1000);
      const left = TOTAL_SECONDS - elapsed;
      setTimeLeft(left > 0 ? left : 0);

      if (left <= 0) {
        clearInterval(intervalRef.current);
        try {
          sessionStorage.removeItem(key);
        } catch (e) {}
        try {
          onEnd?.();
        } catch (e) {}
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
    try {
      sessionStorage.removeItem(`uc_start_${sessionId}`);
    } catch (e) {}
    try {
      onEnd?.();
    } catch (e) {}
    navigate("/", { replace: true });
  };

  const percent = Math.max(
    0,
    Math.min(100, Math.round((timeLeft / TOTAL_SECONDS) * 100))
  );

  return (
    <header className="bg-[#0f1720] border-b border-white/10 p-4">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {/* Left */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              viewBox="0 -960 960 960"
              fill="#F3F3F3"
            >
              <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h167q11-35 43-57.5t70-22.5q40 0 71.5 22.5T594-840h166q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560h-80v120H280v-120h-80v560Zm280-560q17 0 28.5-11.5T520-800q0-17-11.5-28.5T480-840q-17 0-28.5 11.5T440-800q0 17 11.5 28.5T480-760Z" />
            </svg>
          </div>

          <div className="min-w-0">
            <div className="font-semibold text-white truncate">
              Universal Clipboard
            </div>
            <div className="text-xs text-white/60 truncate">Active Session</div>
          </div>
        </div>

        {/* Right */}
        <div className="flex flex-wrap items-center gap-3 justify-end">
          <div className="flex-shrink-0 text-xs sm:text-sm text-white/80 px-3 py-2 rounded bg-[#071723]">
            <span className="font-medium">Session:</span>{" "}
            <span className="ml-1 font-mono">{sessionId}</span>
          </div>

          {/* Timer (give min width so svg never clips) */}
          <div className="flex-shrink-0 min-w-[96px]">
            <div className="px-3 py-2 rounded bg-[#071723] text-white text-xs sm:text-sm font-medium flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 flex-shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v6l4 2"
                />
                <path
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 12A9 9 0 1 1 3 12a9 9 0 0 1 18 0z"
                />
              </svg>
              <span className="tabular-nums">{formatTime(timeLeft)}</span>
            </div>
            <div className="mt-1 w-full h-1 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-500 transition-all duration-500"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>

          <button
            onClick={handleEndClick}
            className="flex-shrink-0 bg-rose-500 hover:bg-rose-400 text-white px-3 py-2 rounded-full text-xs sm:text-sm font-semibold focus:outline-none focus-visible:ring-4 focus-visible:ring-rose-400/30"
            aria-label="End session"
          >
            End Session
          </button>
        </div>
      </div>
    </header>
  );
}
