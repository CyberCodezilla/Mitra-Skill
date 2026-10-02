import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Check, Download, Share2, Shield } from "lucide-react";
import { useApp } from "@/lib/app-context";
import { MOCK_TRADES } from "@/data/mockTrades";
import { CertificateCard } from "@/components/accord/CertificateCard";

export const Route = createFileRoute("/accord")({
  head: () => ({ meta: [{ title: "Parivaar Rozgar Patra — MitraSkill" }] }),
  component: Accord,
});
function Accord() {
  const { lang } = useApp();
  const [tradeId, setTradeId] = useState("AUTO_MECH_01");
  const [shared, setShared] = useState(false);
  const trade = MOCK_TRADES.find((item) => item.trade_id === tradeId)!;
  const hi = lang === "hi";
  useEffect(() => {
    const timeout = window.setTimeout(() => setShared(false), 2600);
    const canvas = document.createElement("canvas");
    canvas.className = "accord-confetti";
    canvas.setAttribute("aria-hidden", "true");
    document.body.appendChild(canvas);
    const context = canvas.getContext("2d");
    if (!context)
      return () => {
        window.clearTimeout(timeout);
        canvas.remove();
      };
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width * devicePixelRatio;
    canvas.height = height * devicePixelRatio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.scale(devicePixelRatio, devicePixelRatio);
    const colors = ["#E87722", "#138A62", "#F5C451", "#0F2942"];
    const pieces = Array.from({ length: 90 }, () => ({
      x: Math.random() * width,
      y: -Math.random() * height * 0.4,
      vx: (Math.random() - 0.5) * 3,
      vy: 2 + Math.random() * 4,
      size: 3 + Math.random() * 5,
      color: colors[Math.floor(Math.random() * colors.length)]!,
      rotation: Math.random() * 6,
    }));
    const start = performance.now();
    let frame = 0;
    const draw = (now: number) => {
      context.clearRect(0, 0, width, height);
      for (const piece of pieces) {
        piece.x += piece.vx;
        piece.y += piece.vy;
        piece.rotation += 0.07;
        context.save();
        context.translate(piece.x, piece.y);
        context.rotate(piece.rotation);
        context.fillStyle = piece.color;
        context.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size * 1.8);
        context.restore();
      }
      if (now - start < 2200) frame = requestAnimationFrame(draw);
      else canvas.remove();
    };
    frame = requestAnimationFrame(draw);
    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    return () => {
      window.clearTimeout(timeout);
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      canvas.remove();
    };
  }, []);
  const share = async () => {
    const message = hi
      ? "हमारे परिवार ने अमन के सुरक्षित भविष्य के लिए ऑटोमोटिव मेकाट्रॉनिक्स का चयन किया है। Parivaar Rozgar Patra: "
      : "Our family has chosen Automotive Mechatronics for Aman's future. Parivaar Rozgar Patra: ";
    const link = window.location.href;
    try {
      await navigator.clipboard.writeText(`${message}${link}`);
      setShared(true);
    } catch {
      window.open(
        `https://wa.me/?text=${encodeURIComponent(`${message}${link}`)}`,
        "_blank",
        "noopener,noreferrer",
      );
    }
  };
  return (
    <div className="mx-auto max-w-5xl px-4 pb-12 pt-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="text-sm font-semibold text-success">
            4. {hi ? "परिवार रोज़गार पत्र" : "Family Accord"} · {hi ? "पूरा हुआ" : "Completed"}{" "}
            <Check className="inline h-4 w-4" />
          </div>
          <h1 className="mt-2 text-2xl font-bold text-navy sm:text-3xl">
            {hi ? "परिवार की सहमति का प्रमाणपत्र" : "A milestone for the whole family"}
          </h1>
        </div>
        <span className="flex items-center gap-1 rounded-full bg-success/10 px-3 py-1.5 text-xs font-semibold text-success">
          <Shield className="h-4 w-4" /> {hi ? "प्रोटोटाइप प्रमाणपत्र" : "Prototype certificate"}
        </span>
      </div>
      <div className="mb-3 flex flex-wrap items-center gap-2 print:hidden">
        <span className="text-sm font-semibold text-muted-foreground">
          {hi ? "चयनित व्यवसाय:" : "Selected vocation:"}
        </span>
        {MOCK_TRADES.map((item) => (
          <button
            key={item.trade_id}
            onClick={() => setTradeId(item.trade_id)}
            aria-pressed={tradeId === item.trade_id}
            className={`rounded-full border px-3 py-1.5 text-sm font-semibold ${tradeId === item.trade_id ? "border-navy bg-navy text-white" : "bg-white text-navy"}`}
          >
            {lang === "hi" ? item.hindi_title : item.trade_name}
          </button>
        ))}
      </div>
      <CertificateCard trade={trade} lang={lang} />
      <div className="mt-5 flex flex-wrap justify-center gap-3 print:hidden">
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-xl bg-navy px-4 py-3 font-semibold text-white"
        >
          <Download className="h-4 w-4" />
          {hi ? "PDF प्रमाणपत्र डाउनलोड करें" : "Download PDF Certificate"}
        </button>
        <button
          onClick={share}
          className="inline-flex items-center gap-2 rounded-xl border border-success px-4 py-3 font-semibold text-success"
        >
          <Share2 className="h-4 w-4" />
          {shared ? (
            <>
              <Check className="h-4 w-4" />
              {hi ? "संदेश कॉपी हुआ" : "Message copied"}
            </>
          ) : hi ? (
            "WhatsApp पर साझा करें"
          ) : (
            "Share via WhatsApp"
          )}
        </button>
        <Link
          to="/admin"
          className="inline-flex items-center gap-2 rounded-xl border bg-white px-4 py-3 font-semibold text-navy"
        >
          🛡️ {hi ? "एडमिन टेलीमेट्री देखें" : "View Admin Telemetry"} →
        </Link>
      </div>
      <p className="mt-3 text-center text-xs text-muted-foreground print:hidden">
        {hi
          ? "साझा करने पर संदेश और इस पेज का लिंक कॉपी होगा।"
          : "Sharing copies a prefilled message and this page link."}
      </p>
    </div>
  );
}
