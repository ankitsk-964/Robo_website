import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import Layout from "./components/Layout.jsx";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Careers from "./pages/Careers.jsx";
import Internships from "./pages/Internships.jsx";
import Contact from "./pages/Contact.jsx";
import Admin from "./pages/Admin.jsx";
import Maintenance from "./pages/Maintenance.jsx";

const BASE = import.meta.env.VITE_API_BASE ?? "";

function useMaintenance() {
  const [maintenance, setMaintenance] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    fetch(`${BASE}/api/public/maintenance`)
      .then((r) => r.json())
      .then((d) => setMaintenance(d.maintenance === true))
      .catch(() => setMaintenance(false))
      .finally(() => setChecked(true));
  }, []);

  return { maintenance, checked };
}

export default function App() {
  const { maintenance, checked } = useMaintenance();

  // ✅ Show a blank/spinner until we know maintenance status
  // This prevents the normal site flashing before maintenance page appears
  if (!checked) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "#0d1b2a", // match your site's background color
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        {/* Optional: small spinner */}
        <div style={{
          width: "32px",
          height: "32px",
          border: "3px solid #1e3a5f",
          borderTop: "3px solid #4f98a3",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite"
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // Maintenance is confirmed ON
  if (maintenance) {
    return (
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<Maintenance />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    );
  }

  // Normal site
  return (
    <ThemeProvider>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="careers" element={<Careers />} />
            <Route path="internships" element={<Internships />} />
            <Route path="contact" element={<Contact />} />
            <Route path="admin" element={<Admin />} />
          </Route>
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}