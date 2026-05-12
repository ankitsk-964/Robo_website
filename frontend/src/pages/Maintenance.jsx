// src/pages/Maintenance.jsx  (or wherever your pages live)
// Drop this file into your project and wire it up in App.jsx (see below)

export default function Maintenance() {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: "#0d1b2a",
      color: "#e0e6f0",
      fontFamily: "'Segoe UI', sans-serif",
      textAlign: "center",
      padding: "2rem",
    }}>
      <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🔧</div>
      <h1 style={{ fontSize: "2.5rem", fontWeight: 700, marginBottom: "0.5rem", color: "#ffffff" }}>
        Under Maintenance
      </h1>
      <p style={{ fontSize: "1.1rem", color: "#94a3b8", maxWidth: "480px", lineHeight: 1.7 }}>
        We're performing scheduled maintenance to improve your experience.
        We'll be back online shortly. Thank you for your patience.
      </p>
      <div style={{
        marginTop: "2.5rem",
        padding: "0.75rem 2rem",
        background: "#1e3a5f",
        borderRadius: "999px",
        fontSize: "0.9rem",
        color: "#7dd3fc",
        letterSpacing: "0.05em",
      }}>
        The Robo Battle Ground
      </div>
    </div>
  );
}