"use client";

import { useEffect } from "react";

/** Last-resort boundary if the root layout itself fails. It must render its own <html> and <body>. */
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[global error]", error);
  }, [error]);

  return (
    <html lang="en-IN">
      <body style={{ fontFamily: "system-ui, sans-serif", margin: 0, background: "#ffffff", color: "#172033" }}>
        <main style={{ maxWidth: 560, margin: "15vh auto", padding: "0 1.5rem" }}>
          <h1 style={{ color: "#0a2a57", fontSize: "1.75rem" }}>HKBK College of Engineering</h1>
          <p>The website is temporarily unavailable. Please try again in a moment.</p>
          <button
            type="button"
            onClick={reset}
            style={{ marginTop: "1rem", padding: "0.6rem 1rem", borderRadius: 6, border: 0, background: "#123e7c", color: "#fff", fontWeight: 600, cursor: "pointer" }}
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
