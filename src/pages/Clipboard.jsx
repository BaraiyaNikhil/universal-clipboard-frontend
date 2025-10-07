// src/pages/Clipboard.jsx
import React, { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import QRCodeCard from "../components/QRCodeCard";

const MAX_BYTES = 25 * 1024 * 1024; // 25 MB

export default function Clipboard() {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [newText, setNewText] = useState("");
  const [modal, setModal] = useState({ open: false, msg: "" });
  const [feedback, setFeedback] = useState("");
  const fileInputRef = useRef(null);
  const dropRef = useRef(null);

  // initial welcome item (like your screenshot)
  useEffect(() => {
    setItems([
      {
        id: `welcome_${Date.now()}`,
        type: "text",
        content: "Welcome to your Universal Clipboard session! Share the QR code to sync across devices.",
        createdAt: Date.now(),
      },
    ]);
  }, []);

  // cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      items.forEach((it) => {
        if (it.url && it._objectUrl) URL.revokeObjectURL(it.url);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- session end handler (from Header) ---
  const handleEnd = useCallback(() => {
    try {
      sessionStorage.removeItem(`uc_start_${sessionId}`);
    } catch (e) {}
    // TODO: add server cleanup if needed
    navigate("/", { replace: true });
  }, [navigate, sessionId]);

  // --- Add text to clipboard ---
  const handleAddText = () => {
    if (!newText || !newText.trim()) {
      setFeedback("Enter some text first");
      setTimeout(() => setFeedback(""), 1800);
      return;
    }
    const t = {
      id: `t_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      type: "text",
      content: newText.trim(),
      createdAt: Date.now(),
    };
    setItems((s) => [t, ...s]);
    setNewText("");
    setFeedback("Added text");
    setTimeout(() => setFeedback(""), 1500);
  };

  // --- File handling ---
  const handleFiles = (files) => {
    Array.from(files).forEach((file) => {
      if (file.size > MAX_BYTES) {
        setModal({ open: true, msg: `"${file.name}" is too large. Max file size is 25 MB.` });
        return;
      }
      const isImage = file.type.startsWith("image/");
      const url = URL.createObjectURL(file);
      const newItem = {
        id: `f_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        type: isImage ? "image" : "file",
        name: file.name,
        size: file.size,
        url,
        _objectUrl: true, // mark to revoke later
        createdAt: Date.now(),
      };
      setItems((s) => [newItem, ...s]);
      setFeedback("File added");
      setTimeout(() => setFeedback(""), 1500);
    });
  };

  const onFileInput = (e) => {
    handleFiles(e.target.files);
    e.currentTarget.value = null;
  };

  // drag & drop
  useEffect(() => {
    const el = dropRef.current;
    if (!el) return;

    const onDragOver = (ev) => {
      ev.preventDefault();
      el.classList.add("ring-2", "ring-indigo-600", "ring-opacity-30");
    };
    const onDragLeave = () => {
      el.classList.remove("ring-2", "ring-indigo-600", "ring-opacity-30");
    };
    const onDrop = (ev) => {
      ev.preventDefault();
      onDragLeave();
      const files = ev.dataTransfer?.files;
      if (files && files.length) handleFiles(files);
    };

    el.addEventListener("dragover", onDragOver);
    el.addEventListener("dragleave", onDragLeave);
    el.addEventListener("drop", onDrop);

    return () => {
      el.removeEventListener("dragover", onDragOver);
      el.removeEventListener("dragleave", onDragLeave);
      el.removeEventListener("drop", onDrop);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dropRef.current]);

  // copy text
  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setFeedback("Copied");
      setTimeout(() => setFeedback(""), 1200);
    } catch {
      setFeedback("Copy failed");
      setTimeout(() => setFeedback(""), 1200);
    }
  };

  const handleDownload = (it) => {
    try {
      const a = document.createElement("a");
      a.href = it.url;
      a.download = it.name || `download_${Date.now()}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error(err);
      setFeedback("Download failed");
      setTimeout(() => setFeedback(""), 1400);
    }
  };

  // group items
  const texts = items.filter((i) => i.type === "text");
  const images = items.filter((i) => i.type === "image");
  const files = items.filter((i) => i.type === "file");

  return (
    <div className="min-h-screen bg-[#0f1720] text-white">
      <Header sessionId={sessionId} onEnd={handleEnd} />

      <main className="p-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* LEFT: QR card */}
          <div className="space-y-4 md:col-span-1">
            <QRCodeCard sessionId={sessionId} />

            {/* small session meta card (optional) */}
            <div className="bg-[#0b1220] rounded-2xl p-4 text-sm text-white/70">
              <div className="font-medium mb-1">Session Info</div>
              <div className="bg-[#06101a] px-3 py-2 rounded text-sm font-mono break-all">{sessionId}</div>
              <div className="mt-3 text-xs text-white/50">Sessions expire in 15 minutes automatically.</div>
            </div>
          </div>

          {/* RIGHT: Main clipboard UI */}
          <div className="md:col-span-2 space-y-6">
            {/* Add Text card */}
            <div className="bg-[#0b1824] rounded-2xl p-5 shadow-inner">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="font-semibold mb-2">Add Text</div>
                  <textarea
                    value={newText}
                    onChange={(e) => setNewText(e.target.value)}
                    placeholder="Type or paste your text here..."
                    rows={4}
                    className="w-full resize-none rounded-xl bg-[#071123] placeholder-white/30 border border-white/5 p-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>

                <div className="flex-shrink-0 self-end">
                  <button
                    onClick={handleAddText}
                    className="bg-gradient-to-r from-indigo-500 to-indigo-400 px-5 py-2 rounded-full text-white font-semibold shadow-lg hover:opacity-95 transition"
                  >
                    Add to Clipboard
                  </button>
                </div>
              </div>
            </div>

            {/* File Upload + drag-drop */}
            <div
              ref={dropRef}
              className="bg-transparent rounded-2xl border-2 border-dashed border-white/6 p-6 flex items-center justify-center flex-col text-center text-white/60 min-h-[160px]"
            >
              <div className="mb-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M12 3v12" />
                  <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M21 15v4a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-4" />
                  <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M7 10l5-5 5 5" />
                </svg>
              </div>
              <div className="text-sm mb-2">Drag & drop a file here, or click to browse</div>
              <div className="text-xs mb-3">Max file size: 25MB</div>

              <div className="flex gap-3">
                <label
                  htmlFor="fileUpload"
                  className="px-4 py-2 rounded-full bg-white/6 hover:bg-white/8 cursor-pointer text-sm"
                >
                  Choose File
                </label>

                <input
                  id="fileUpload"
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={onFileInput}
                />
              </div>
            </div>

            {/* Clipboard Items header */}
            <div className="flex items-center gap-3">
              <div className="text-xl font-semibold">Clipboard Items</div>
              <div className="text-sm text-white/50">({items.length})</div>
              <div className="ml-auto text-sm text-white/60">{feedback}</div>
            </div>

            {/* Items list grouped by type */}
            <div className="space-y-4">
              {/* TEXTS */}
              {texts.length > 0 && (
                <section className="space-y-2">
                  <h4 className="text-sm text-white/70 font-medium">Texts</h4>
                  <div className="space-y-3">
                    {texts.map((t) => (
                      <TextCard key={t.id} item={t} onCopy={() => handleCopy(t.content)} />
                    ))}
                  </div>
                </section>
              )}

              {/* IMAGES */}
              {images.length > 0 && (
                <section className="space-y-2">
                  <h4 className="text-sm text-white/70 font-medium">Photos</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {images.map((it) => (
                      <div key={it.id} className="bg-white/4 rounded-xl overflow-hidden flex flex-col">
                        <img src={it.url} alt={it.name} className="w-full h-48 object-cover" />
                        <div className="p-3 flex items-center justify-between">
                          <div className="text-sm truncate">{it.name}</div>
                          <div className="flex items-center gap-2">
                            <button onClick={() => handleDownload(it)} className="px-3 py-1 rounded bg-indigo-600 text-sm">Download</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* FILES */}
              {files.length > 0 && (
                <section className="space-y-2">
                  <h4 className="text-sm text-white/70 font-medium">Files</h4>
                  <div className="space-y-2">
                    {files.map((it) => (
                      <div key={it.id} className="bg-white/4 rounded-xl p-3 flex items-center justify-between">
                        <div>
                          <div className="font-medium">{it.name}</div>
                          <div className="text-xs text-white/60">{formatBytes(it.size)}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => handleDownload(it)} className="px-3 py-1 rounded bg-indigo-600 text-sm">Download</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* empty state */}
              {items.length === 0 && (
                <div className="text-white/60">No clipboard items yet — add text or files above.</div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* File too large modal */}
      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setModal({ open: false, msg: "" })} />
          <div className="relative bg-slate-900 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-2">File too large</h3>
            <p className="text-sm text-white/70 mb-4">{modal.msg}</p>
            <div className="flex justify-end">
              <button onClick={() => setModal({ open: false, msg: "" })} className="px-4 py-2 rounded bg-indigo-600">OK</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* --------------------
   Small helper parts
   -------------------- */

function TextCard({ item, onCopy }) {
  const [expanded, setExpanded] = useState(false);
  const [collapsible, setCollapsible] = useState(false);
  const ref = useRef(null);

  // detect if longer than ~3 lines (accurate to layout width)
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const compute = () => {
      // create hidden clone to measure full height
      const clone = document.createElement("div");
      const style = getComputedStyle(el);
      clone.style.position = "absolute";
      clone.style.visibility = "hidden";
      clone.style.width = `${el.clientWidth}px`;
      clone.style.fontSize = style.fontSize;
      clone.style.lineHeight = style.lineHeight;
      clone.style.fontFamily = style.fontFamily;
      clone.style.fontWeight = style.fontWeight;
      clone.style.whiteSpace = "pre-wrap";
      clone.innerText = item.content;
      document.body.appendChild(clone);
      const fullHeight = clone.scrollHeight;
      const lineHeight = parseFloat(style.lineHeight) || 18;
      document.body.removeChild(clone);
      setCollapsible(fullHeight > lineHeight * 3 + 1);
    };

    compute();
    // re-compute on resize
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, [item.content]);

  return (
    <div className="bg-white/4 rounded-xl p-4">
      <div
        ref={ref}
        className="text-sm text-white/80"
        style={
          !expanded
            ? {
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }
            : {}
        }
      >
        {item.content}
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={onCopy} className="px-3 py-1 rounded bg-indigo-600 text-sm">Copy</button>
          {collapsible && (
            <button onClick={() => setExpanded((s) => !s)} className="text-sm text-white/70">
              {expanded ? "Show less" : "Show more"}
            </button>
          )}
        </div>
        <div className="text-xs text-white/50 font-mono">{new Date(item.createdAt || Date.now()).toLocaleTimeString()}</div>
      </div>
    </div>
  );
}

/* pretty bytes */
function formatBytes(bytes) {
  if (!bytes) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}
