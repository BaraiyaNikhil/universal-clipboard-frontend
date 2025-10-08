import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import QRCodeCard from "../components/QRCodeCard";

const MAX_BYTES = 25 * 1024 * 1024;

export default function Clipboard() {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [newText, setNewText] = useState("");
  const [activeTab, setActiveTab] = useState("text");
  const [modal, setModal] = useState({ open: false, msg: "" });
  const [feedback, setFeedback] = useState("");
  const dropRef = useRef(null);
  const fileInputRef = useRef(null);

  // sample welcome
  useEffect(() => {
    setItems([
      {
        id: `t_${Date.now()}`,
        type: "text",
        content:
          "Welcome to your Universal Clipboard session! Share the QR to sync across devices.",
        createdAt: Date.now(),
      },
    ]);
  }, []);

  // --- session end handler ---
  const handleEnd = () => {
    try {
      sessionStorage.removeItem(`uc_start_${sessionId}`);
    } catch (e) {}
    navigate("/", { replace: true });
  };

  // --- add text ---
  const handleAddText = () => {
    if (!newText.trim()) {
      setFeedback("Type something first");
      setTimeout(() => setFeedback(""), 1400);
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
    setTimeout(() => setFeedback(""), 1200);
    setActiveTab("text");
  };

  // --- file handling ---
  const handleFiles = (fileList) => {
    const files = Array.from(fileList || []);
    files.forEach((file) => {
      if (file.size > MAX_BYTES) {
        setModal({
          open: true,
          msg: `"${file.name}" is too large. Maximum allowed is 25 MB.`,
        });
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
        _objectUrl: true,
        createdAt: Date.now(),
      };
      setItems((s) => [newItem, ...s]);
      setActiveTab(isImage ? "image" : "file");
      setFeedback("File added");
      setTimeout(() => setFeedback(""), 1200);
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

  // cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      items.forEach((it) => {
        if (it._objectUrl && it.url) URL.revokeObjectURL(it.url);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setFeedback("Copied");
      setTimeout(() => setFeedback(""), 1000);
    } catch {
      setFeedback("Copy failed");
      setTimeout(() => setFeedback(""), 1000);
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
      setTimeout(() => setFeedback(""), 1000);
    }
  };

  // filters + counts
  const texts = items.filter((i) => i.type === "text");
  const images = items.filter((i) => i.type === "image");
  const files = items.filter((i) => i.type === "file");

  return (
    <div className="min-h-screen bg-[#0b1220] text-white flex flex-col">
      <Header sessionId={sessionId} onEnd={handleEnd} />

      <main className="p-6 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* LEFT: QR + session */}
          <QRCodeCard sessionId={sessionId} />
          {/* RIGHT: main */}
          <section className="md:col-span-2 space-y-6">
            {/* Add Text */}
            <div className="bg-[#0f172a] p-5 rounded-2xl shadow-md">
              <div className="flex flex-col gap-4 items-end">
                <div className="w-full">
                  <div className="font-semibold mb-2">Add Text</div>
                  <textarea
                    value={newText}
                    onChange={(e) => setNewText(e.target.value)}
                    placeholder="Type or paste your text here..."
                    rows={4}
                    className="w-full bg-[#071723] text-white/90 rounded-xl p-4 resize-none border border-white/5 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>

                <div>
                  <button
                    onClick={handleAddText}
                    className="bg-gradient-to-r from-indigo-500 to-indigo-400 px-5 py-2 rounded-full text-white font-semibold shadow-lg hover:opacity-95 transition"
                  >
                    Add to Clipboard
                  </button>
                </div>
              </div>

              <div className="mt-3 text-sm text-white/60">{feedback}</div>
            </div>

            {/* File upload */}
            <div
              ref={dropRef}
              className="bg-[#0f172a] p-6 rounded-2xl border border-dashed border-white/10 flex flex-col items-center justify-center text-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-white/40 mb-2"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 16V4m0 12l3-3m-3 3l-3-3M6 20h12"
                />
              </svg>
              <p className="text-white/70 mb-1">
                Drag & drop a file here, or click to browse
              </p>
              <p className="text-xs text-white/50 mb-3">Max file size: 25MB</p>

              <div className="flex gap-3">
                <label className="cursor-pointer bg-white/5 hover:bg-white/10 px-4 py-2 rounded-md text-sm inline-flex items-center gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={onFileInput}
                    className="hidden"
                  />
                  Choose file
                </label>
              </div>
            </div>

            {/* Clipboard Items: tabs + lists */}
            <div className="bg-[#0f172a] p-5 rounded-2xl shadow-md">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <h4 className="font-semibold text-white flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    viewBox="0 -960 960 960"
                    fill="#F3F3F3"
                  >
                    <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h167q11-35 43-57.5t70-22.5q40 0 71.5 22.5T594-840h166q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560h-80v120H280v-120h-80v560Zm280-560q17 0 28.5-11.5T520-800q0-17-11.5-28.5T480-840q-17 0-28.5 11.5T440-800q0 17 11.5 28.5T480-760Z" />
                  </svg>
                  Clipboard Items
                  <span className="text-sm text-white/60 ml-1">
                    ({items.length})
                  </span>
                </h4>

                {/* tabs */}
                <div className="flex gap-2 overflow-x-auto py-1">
                  <Tab
                    label={`Texts (${texts.length})`}
                    active={activeTab === "text"}
                    onClick={() => setActiveTab("text")}
                  />
                  <Tab
                    label={`Photos (${images.length})`}
                    active={activeTab === "image"}
                    onClick={() => setActiveTab("image")}
                  />
                  <Tab
                    label={`Files (${files.length})`}
                    active={activeTab === "file"}
                    onClick={() => setActiveTab("file")}
                  />
                </div>
              </div>

              <div className="mt-4">
                {activeTab === "text" && (
                  <div className="space-y-3">
                    {texts.length === 0 ? (
                      <div className="text-white/50 py-6 text-center">
                        No text items yet.
                      </div>
                    ) : (
                      texts.map((t) => (
                        <TextRow
                          key={t.id}
                          item={t}
                          onCopy={() => handleCopy(t.content)}
                        />
                      ))
                    )}
                  </div>
                )}

                {activeTab === "image" && (
                  <div className="space-y-3">
                    {images.length === 0 ? (
                      <div className="text-white/50 py-6 text-center">
                        No photos yet.
                      </div>
                    ) : (
                      images.map((it) => (
                        <ImageRow
                          key={it.id}
                          item={it}
                          onDownload={() => handleDownload(it)}
                        />
                      ))
                    )}
                  </div>
                )}

                {activeTab === "file" && (
                  <div className="space-y-3">
                    {files.length === 0 ? (
                      <div className="text-white/50 py-6 text-center">
                        No files yet.
                      </div>
                    ) : (
                      files.map((it) => (
                        <FileRow
                          key={it.id}
                          item={it}
                          onDownload={() => handleDownload(it)}
                        />
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* modal for file-too-large */}
      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setModal({ open: false, msg: "" })}
          />
          <div className="relative bg-slate-900 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-2">File too large</h3>
            <p className="text-sm text-white/70 mb-4">{modal.msg}</p>
            <div className="flex justify-end">
              <button
                onClick={() => setModal({ open: false, msg: "" })}
                className="px-4 py-2 rounded bg-indigo-600"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* -------------------------
   Small helper components
   ------------------------- */

function Tab({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-md text-sm font-medium transition whitespace-nowrap ${
        active ? "bg-indigo-600 text-white" : "text-white/70 hover:bg-white/5"
      }`}
    >
      {label}
    </button>
  );
}

/* Text row with show more / less */
function TextRow({ item, onCopy }) {
  const [expanded, setExpanded] = useState(false);
  const [collapsible, setCollapsible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const compute = () => {
      const clone = document.createElement("div");
      const style = getComputedStyle(el);
      clone.style.position = "absolute";
      clone.style.visibility = "hidden";
      clone.style.width = `${el.clientWidth}px`;
      clone.style.fontSize = style.fontSize;
      clone.style.lineHeight = style.lineHeight;
      clone.style.fontFamily = style.fontFamily;
      clone.style.whiteSpace = "pre-wrap";
      clone.innerText = item.content;
      document.body.appendChild(clone);
      const fullHeight = clone.scrollHeight;
      const lineHeight = parseFloat(style.lineHeight) || 18;
      document.body.removeChild(clone);
      setCollapsible(fullHeight > lineHeight * 3 + 1);
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, [item.content]);

  return (
    <div className="bg-[#071723] rounded-lg p-4 flex flex-col">
      <div
        ref={ref}
        className="text-sm text-white/90 break-words"
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
          <button
            onClick={onCopy}
            className="px-3 py-1 rounded bg-indigo-600 text-sm"
          >
            Copy
          </button>
          {collapsible && (
            <button
              onClick={() => setExpanded((s) => !s)}
              className="text-sm text-white/70"
            >
              {expanded ? "Show less" : "Show more"}
            </button>
          )}
        </div>
        <div className="text-xs text-white/50 font-mono">
          {new Date(item.createdAt || Date.now()).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}

/* Image row (vertical list with thumbnail on the left on wider screens) */
function ImageRow({ item, onDownload }) {
  return (
    <div className="bg-[#071723] rounded-lg p-3 flex items-center gap-3">
      <img
        src={item.url}
        alt={item.name}
        className="h-16 w-20 object-cover rounded-md flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm truncate">
          {item.name || "Image"}
        </div>
        <div className="text-xs text-white/60">
          {new Date(item.createdAt || Date.now()).toLocaleTimeString()}
        </div>
      </div>
      <div className="flex-shrink-0">
        <button
          onClick={onDownload}
          className="px-3 py-1 rounded bg-indigo-600 text-sm"
        >
          Download
        </button>
      </div>
    </div>
  );
}

/* File row */
function FileRow({ item, onDownload }) {
  return (
    <div className="bg-[#071723] rounded-lg p-3 flex items-center justify-between">
      <div className="flex items-center gap-3 min-w-0">
        <div className="h-10 w-10 rounded-md bg-white/5 flex items-center justify-center flex-shrink-0">
          📎
        </div>
        <div className="min-w-0">
          <div className="font-medium text-sm truncate">{item.name}</div>
          <div className="text-xs text-white/60">{formatBytes(item.size)}</div>
        </div>
      </div>
      <div>
        <button
          onClick={onDownload}
          className="px-3 py-1 rounded bg-indigo-600 text-sm"
        >
          Download
        </button>
      </div>
    </div>
  );
}

/* util */
function formatBytes(bytes) {
  if (!bytes && bytes !== 0) return "";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  if (bytes === 0) return "0 B";
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}
