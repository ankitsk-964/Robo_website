import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import Layout from "./components/Layout.js";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Careers from "./pages/Careers.jsx";
import Internships from "./pages/Internships.jsx";
import Contact from "./pages/Contact.jsx";
import Admin from "./pages/Admin.jsx";


export default function App() {
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