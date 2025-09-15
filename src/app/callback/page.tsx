"use client";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function CallbackPage() {
  const params = useSearchParams();
  const code = params.get("code");

  useEffect(() => {
    if (code) {
      fetch("/api/auth", {
        method: "POST",
        body: JSON.stringify({ code }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.access_token) {
            localStorage.setItem("ehr_token", data.access_token);
            window.location.href = "/";
          }
        });
    }
  }, [code]);

  return <p>Processing login...</p>;
}
