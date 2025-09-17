"use client";

export default function Header() {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-40 h-16"
      style={{
        backdropFilter: "blur(6px)",
        borderBottom: "1px solid var(--hospital-border)",
        background: "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(0,0,0,0.03))",
      }}
    >
      <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-center">
        <div className="text-sm font-medium text-[var(--hospital-text)]">EHR • Hospital</div>
      </div>
    </header>
  );
}
