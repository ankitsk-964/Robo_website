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

  // Wait for maintenance check before rendering anything (prevents flicker)
  if (!checked) return null;

  // If maintenance is ON, show maintenance page to everyone except /admin
  // Admin route is always accessible so you can turn it back off
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