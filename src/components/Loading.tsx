import React from "react";

type LoadingProps = {
  message?: string;
  size?: number;
  showLogo?: boolean;
  fullScreen?: boolean;
  transparentBackground?: boolean;
};

export default function Loading({
  message = "Loading...",
  size = 96,
  showLogo = true,
  fullScreen = true,
  transparentBackground = false,
}: LoadingProps) {

  return (
    <div
      aria-busy="true"
      role="status"
      className={`${
        fullScreen ? "fixed inset-0" : "relative"
      } z-50 flex items-center justify-center p-6`
    }
    >
      {/* dimmed, blurred backdrop */}
      <div
        className={`absolute inset-0 ${
          transparentBackground ? "bg-[rgba(7,19,39,0.32)]" : "bg-[rgba(7,19,39,0.6)]"
        } backdrop-blur-lg`}
        aria-hidden
      />

      {/* centered glass card */}
      <div className="relative max-w-md w-full mx-4">
        <div
          className="flex flex-col items-center gap-4 p-6 rounded-2xl"
          style={{
            background: "linear-gradient(180deg, rgba(13,27,42,0.8), rgba(9,18,30,0.75))",
            border: "1px solid rgba(22,50,74,0.6)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.6)",
            color: "var(--hospital-text)",
          }}
        >
          {/* optional small logo */}
          {showLogo && (
            <div className="flex items-center gap-3">
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <rect width="24" height="24" rx="6" fill="url(#g)" />
                <path d="M7 12h10M12 7v10" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" opacity="0.95" />
                <defs>
                  <linearGradient id="g" x1="0" x2="1">
                    <stop offset="0" stopColor="var(--hospital-primary)" />
                    <stop offset="1" stopColor="var(--hospital-accent)" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="text-lg font-semibold">Hospital UI</div>
            </div>
          )}

          {/* spinner + text */}
          <div className="flex flex-col items-center gap-3">
            <svg
              width={size}
              height={size}
              viewBox="0 0 50 50"
              className="animate-spin-slow"
              aria-hidden
            >
              <defs>
                <linearGradient id="sg" x1="0" x2="1">
                  <stop offset="0" stopColor="var(--hospital-primary)" />
                  <stop offset="1" stopColor="var(--hospital-accent)" />
                </linearGradient>
              </defs>

              <circle
                cx="25"
                cy="25"
                r="20"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="6"
                fill="none"
              />

              <path
                d="M45 25a20 20 0 0 1-20 20"
                stroke="url(#sg)"
                strokeWidth="6"
                strokeLinecap="round"
                fill="none"
              />
            </svg>

            <div className="text-center">
              <div className="text-sm text-[var(--hospital-subtle)]">{message}</div>
              <div className="mt-1 text-xs text-[var(--hospital-subtle)] opacity-80">Please wait — this may take a moment</div>
            </div>
          </div>

          {/* subtle footer note */}
          <div className="text-[var(--hospital-subtle)] text-xs mt-2">Secure · HIPAA-aware · {new Date().getFullYear()}</div>
        </div>
      </div>

      <style jsx>{`
        .animate-spin-slow {
          animation: spin 1.6s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
