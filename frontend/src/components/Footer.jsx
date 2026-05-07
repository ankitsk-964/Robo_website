import { Link } from "react-router-dom";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.shell}`}>
        <div>
          <p className={styles.brand}>The Robo Battle Ground</p>
          <p className={styles.copy}>Robotics solutions · Hardware solutions · Engineering programs</p>
        </div>
        <nav aria-label="Footer navigation" className={styles.nav}>
          <Link to="/about">About</Link>
          <Link to="/careers">Careers</Link>
          <Link to="/internships">Internships</Link>
          <Link to="/contact">Contact</Link>
        </nav>
      </div>
      <div className={`container ${styles.bottom}`}>
        <p>© {new Date().getFullYear()} The Robo Battle Ground. All rights reserved.</p>
      </div>
    </footer>
  );
}