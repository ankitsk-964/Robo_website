import { useState } from "react";
import { apiPost } from "../utils/api.js";
import styles from "./Contact.module.css";

export default function Contact() {
  const [status, setStatus] = useState({ msg: "", type: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ msg: "Sending...", type: "" });
    const fd = new FormData(e.target);
    try {
      await apiPost("/api/public/contact", Object.fromEntries(fd.entries()));
      e.target.reset();
      setStatus({ msg: "Message sent successfully. We'll get back to you shortly.", type: "success" });
    } catch {
      setStatus({ msg: "Failed to send message. Please try again.", type: "error" });
    }
  };

  return (
    <section className="section">
      <div className={`container ${styles.grid}`}>
        <div>
          <p className="eyebrow">Connect with us</p>
          <h1 className={styles.title}>Contact us</h1>
          <p className={styles.intro}>
            Have a project or a question? Reach out to our team and we'll respond as soon as possible.
          </p>
          <div className={styles.contactInfo}>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Email</span>
              <a href="mailto:contact@therobobattleground.com" className={styles.infoValue}>
                contact@therobobattleground.com
              </a>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Phone</span>
              <a href="tel:+91XXXXXXXXXX" className={styles.infoValue}>+91-XXXXXXXXXX</a>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Address</span>
              <span className={styles.infoValue}>REPLACE_WITH_YOUR_ADDRESS, Delhi, India</span>
            </div>
          </div>
        </div>

        <div className="form-card">
          <form onSubmit={handleSubmit} noValidate className={styles.form}>
            <div className="form-grid">
              <div className="field">
                <label htmlFor="name">Full name</label>
                <input id="name" name="name" type="text" required />
              </div>
              <div className="field">
                <label htmlFor="email">Email address</label>
                <input id="email" name="email" type="email" required />
              </div>
              <div className="field field-full">
                <label htmlFor="subject">Subject</label>
                <input id="subject" name="subject" type="text" required />
              </div>
              <div className="field field-full">
                <label htmlFor="message">Message</label>
                <textarea id="message" name="message" rows={6} required />
              </div>
            </div>
            <button type="submit" className="btn btn-primary">Send message</button>
            <p className={`form-status ${status.type}`}>{status.msg}</p>
          </form>
        </div>
      </div>
    </section>
  );
}