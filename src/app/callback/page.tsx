"use client";

import { useEffect, useState } from "react";

export default function CallbackPage() {
  const [status, setStatus] = useState("Exchanging code...");

  useEffect(() => {
    async function exchangeCode() {
      const url = new URL(window.location.href);
      const code = url.searchParams.get("code");
      if (!code) {
        setStatus("No authorization code found");
        return;
      }

      const res = await fetch("/api/auth/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      const data = await res.json();
      if (data.access_token) {
        localStorage.setItem("oracle_token", data.access_token);
        setStatus("Token acquired ✅ You can now access patients/appointments.");
      } else {
        setStatus("Failed to get token: " + JSON.stringify(data));
      }
    }
    exchangeCode();
  }, []);

  return <div>{status}</div>;
}
