import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useTheme } from "../context/ThemeContext.jsx";
import styles from "./Navbar.module.css";

const links = [
  { to: "/",            label: "Home",        end: true },
  { to: "/about",       label: "About Us" },
  { to: "/careers",     label: "Careers" },
  { to: "/internships", label: "Internships" },
  { to: "/contact",     label: "Contact" },
  { to: "/admin",       label: "Admin" },
];

export default function Navbar() {
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={`container ${styles.shell}`}>
        <NavLink to="/" className={styles.brand} aria-label="The Robo Battle Ground">
          <svg className={styles.logo} viewBox="0 0 64 64" fill="none" aria-hidden="true">
            <circle cx="32" cy="32" r="24" stroke="currentColor" strokeWidth="3.5"/>
            <path d="M20 35L30 25L40 35L50 25" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M24 42H40" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round"/>
            <circle cx="16" cy="16" r="3" fill="currentColor"/>
            <circle cx="48" cy="16" r="3" fill="currentColor"/>
          </svg>
          <span className={styles.brandText}>
            <strong>The Robo</strong>
            <small>Battle Ground</small>
          </span>
        </NavLink>

        <nav aria-label="Main navigation">
          <button
            className={styles.toggle}
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-label="Toggle menu"
          >
            {open ? "✕" : "☰"}
          </button>

          <ul className={`${styles.links} ${open ? styles.open : ""}`} role="list">
            {links.map(({ to, label, end }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    `${styles.link} ${isActive ? styles.active : ""}`
                  }
                  onClick={() => setOpen(false)}
                >
                  {label}
                </NavLink>
              </li>
            ))}
            <li>
              <button
                className={`${styles.link} ${styles.themeBtn}`}
                onClick={toggle}
                aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              >
                {theme === "dark" ? "☀️" : "🌙"}
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}