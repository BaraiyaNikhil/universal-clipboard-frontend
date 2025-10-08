import { useNavigate } from "react-router-dom";
import copy from "../assets/copy.png";
import encrypted from "../assets/encrypted.png";
import mobile from "../assets/mobile.png";
import shareIcon from "../assets/share.png";
import clipboard from "../assets/content_paste.png";

export default function Home() {
  const navigate = useNavigate();

  const features = [
    {
      img: copy,
      title: "Instant Sync",
      desc:
        "Copy on one device, paste on another. Real-time synchronization across all connected devices.",
    },
    {
      img: encrypted,
      title: "Private & Secure",
      desc:
        "Your data is end-to-end encrypted and auto-deletes after 15 minutes. No permanent storage.",
    },
    {
      img: mobile,
      title: "QR Code Connect",
      desc:
        "Scan a QR code to instantly join a session from any device. No login required.",
    },
  ];

  const steps = [
    {
      id: "01",
      title: "Create a Session",
      desc: "Click 'Create Session' to generate a unique shareable link and QR code.",
    },
    {
      id: "02",
      title: "Share or Scan",
      desc: "Share the link or scan the QR code on your other devices to join the session.",
    },
    {
      id: "03",
      title: "Copy & Paste",
      desc: "Add text or files from any device and access them instantly on all connected devices.",
    },
  ];

  // ✅ Generates unique session ID and navigates to clipboard page
  const handleCreateSession = () => {
    const sessionId = Math.random().toString(36).substring(2, 10);
    navigate(`/clipboard/${sessionId}`);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#06123e] to-[#040c29] text-white">
      {/* HERO */}
      <section
        id="clipboard_start"
        className="flex flex-col items-center text-center pt-20 pb-16 px-6"
      >
        <div className="inline-flex items-center gap-2 rounded-2xl px-4 py-2 bg-indigo-500/10 border border-indigo-600 text-indigo-300 text-sm font-semibold mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-indigo-200"
            viewBox="0 -960 960 960"
            fill="currentColor"
            aria-hidden
          >
            <path d="m422-232 207-248H469l29-227-185 267h139l-30 208ZM320-80l40-280H160l360-520h80l-40 320h240L400-80h-80Zm151-390Z" />
          </svg>
          Fast, Secure, Universal
        </div>

        <h1 className="text-5xl md:text-6xl lg:text-8xl font-extrabold leading-tight">
          Your Clipboard,
        </h1>

        <h2 className="text-5xl md:text-6xl lg:text-8xl font-extrabold bg-gradient-to-r from-indigo-500 to-teal-400 bg-clip-text text-transparent overflow-visible pb-1 leading-[1.02] mb-5">
          Everywhere
        </h2>

        <p className="max-w-2xl text-sm md:text-lg text-white/70 mb-2">
          Share text seamlessly across all your devices. No signup required.
        </p>
        <p className="text-sm md:text-lg text-white/60 mb-6">Just scan, paste, and go.</p>

        <div className="flex gap-4 items-center justify-center">
          {/* ✅ Create session navigates to /clipboard/:id */}
          <button
            onClick={handleCreateSession}
            type="button"
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 transition rounded-full px-5 py-2.5 text-sm md:text-base font-semibold focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-400"
            aria-label="Create session"
          >
            Create Session
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 -960 960 960"
              fill="currentColor"
              aria-hidden
            >
              <path d="M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z" />
            </svg>
          </button>

          <a href="#how-it-works">
          <button
            type="button"
            className="rounded-full px-5 py-2.5 text-sm md:text-base bg-white/10 hover:bg-white/20 transition font-semibold focus:outline-none focus-visible:ring-4 focus-visible:ring-white/20"
            aria-label="Learn more"
          >
            Learn More
          </button>
          </a>
        </div>

        <p className="mt-6 text-sm text-white/50">
          Sessions expire in 15 minutes. No account needed.
        </p>
      </section>

      {/* FEATURES */}
      <section id="features" className="px-6 pb-16">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-3">
            Simple. Fast. Secure
          </h3>
          <p className="text-center text-white/60 max-w-2xl mx-auto mb-8">
            Everything you need to share content across devices, nothing you don't.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ img, title, desc }, i) => (
              <article
                key={i}
                className="bg-white/6 hover:bg-white/10 transition rounded-2xl p-6 flex flex-col items-center text-center shadow-sm"
                aria-labelledby={`feature-${i}-title`}
              >
                <img
                  src={img}
                  alt={`${title} icon`}
                  loading="lazy"
                  className="h-14 w-14 object-contain mb-4"
                />
                <h4
                  id={`feature-${i}-title`}
                  className="text-lg font-semibold mb-2"
                >
                  {title}
                </h4>
                <p className="text-sm text-white/70">{desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section
        id="how-it-works"
        className="bg-gradient-to-b from-[#071024] via-[#061325] to-[#08162b] py-16 px-6"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-4xl md:text-5xl font-extrabold leading-snug overflow-visible pb-1">
            How It Works
          </h3>
          <p className="text-white/60 mt-3 max-w-xl mx-auto">
            Three simple steps to universal clipboard sharing
          </p>
        </div>

        <div className="max-w-4xl mx-auto mt-10 space-y-6">
          {steps.map((s) => (
            <article
              key={s.id}
              tabIndex={0}
              className="flex items-center gap-6 bg-white/5 hover:bg-white/7 transition rounded-[18px] p-6 md:p-8 shadow-inner"
              aria-labelledby={`step-${s.id}-title`}
            >
              <div className="flex-none">
                <div className="h-14 w-14 rounded-lg flex items-center justify-center bg-gradient-to-br from-indigo-400 to-teal-300 text-white font-semibold text-sm">
                  {s.id}
                </div>
              </div>

              <div className="flex-1">
                <h4 id={`step-${s.id}-title`} className="text-xl font-semibold">
                  {s.title}
                </h4>
                <p className="text-white/60 mt-1">{s.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mx-auto mb-6 w-14 h-14 flex items-center justify-center rounded-full">
            <img src={shareIcon} alt="Share icon" />
          </div>

          <h3 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight mb-3">
            Ready to sync your clipboard?
          </h3>
          <p className="text-white/60 mb-8">
            Create your first session and start sharing across devices instantly.
          </p>

          <button
            onClick={handleCreateSession}
            type="button"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-indigo-500 to-indigo-400 px-8 py-3 rounded-full text-white font-semibold shadow-lg hover:scale-[1.01] transition transform focus-visible:ring-4 focus-visible:ring-indigo-400"
          >
            Get Started Now
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 12h14M12 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/6 py-6">
        <div className="max-w-6xl mx-auto px-6 text-center text-white/60 text-sm flex items-center justify-center gap-3">
          <img src={clipboard} alt="Clipboard" />
          Universal Clipboard • Secure & Private
        </div>
      </footer>
    </main>
  );
}
