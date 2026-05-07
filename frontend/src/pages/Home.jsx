import { Link } from "react-router-dom";
import { useFetch } from "../hooks/useFetch.js";
import styles from "./Home.module.css";

export default function Home() {
  const { data: clients, loading } = useFetch("/api/public/clients");

  return (
    <>
      {/* Hero */}
      <section className={`section ${styles.hero}`}>
        <div className={`container ${styles.heroGrid}`}>
          <div className={styles.heroCopy}>
            <p className="eyebrow">Engineering systems for the next generation</p>
            <h1 className={styles.heroTitle}>
              Robotics-first solutions for smart hardware and real-world automation.
            </h1>
            <p className={styles.heroText}>
              The Robo Battle Ground builds robotics solutions, hardware solutions, prototype systems,
              embedded integrations, and engineering support for businesses, institutions, and innovation programs.
            </p>
            <div className={styles.heroActions}>
              <Link to="/contact"     className="btn btn-primary">Talk to our team</Link>
              <Link to="/internships" className="btn btn-secondary">Explore internships</Link>
            </div>
          </div>

          <div className={styles.heroPanel} aria-label="System visualization">
            <div className={styles.signalBar}>
              <span className={styles.dot} />
              <span>System active</span>
            </div>
            <div className={styles.rings}>
              <div className={`${styles.ring} ${styles.ringA}`} />
              <div className={`${styles.ring} ${styles.ringB}`} />
              <div className={`${styles.ring} ${styles.ringC}`} />
              <div className={styles.chip}>TRBG</div>
            </div>
            <div className={styles.miniCards}>
              <div className={styles.miniCard}>
                <h2>Automation</h2>
                <p>Embedded control, actuator logic, sensor fusion.</p>
              </div>
              <div className={styles.miniCard}>
                <h2>Hardware</h2>
                <p>Board integration, diagnostics, field devices.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">What we do</p>
            <h2>Core services</h2>
            <p>A focused set of engineering capabilities for robotics, hardware, and automation.</p>
          </div>
          <div className={styles.servicesGrid}>
            {[
              { title: "Robotics Solutions",    desc: "Design, integration, prototyping, and deployment of robotics systems for industrial, academic, and applied innovation." },
              { title: "Hardware Solutions",    desc: "Electronic hardware design support, embedded devices, controller boards, test setups, and engineering validation." },
              { title: "Automation Support",    desc: "Workflow automation, controls strategy, hardware-software interfacing, and operational optimization." },
              { title: "Prototype Development", desc: "Rapid system mockups, proof-of-concept builds, lab validation, and demonstration-ready engineering assets." },
            ].map((s) => (
              <article key={s.title} className={`card fade-in ${styles.serviceCard}`}>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Clients */}
      <section className={`section ${styles.clientsSection}`}>
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">Trusted network</p>
            <h2>Clients &amp; collaborators</h2>
          </div>
          <div className={styles.clientsGrid}>
            {loading ? (
              [1,2,3,4].map((i) => (
                <div key={i} className="card">
                  <div className="skeleton skeleton-text" style={{ width: "40%" }} />
                  <div className="skeleton skeleton-heading" />
                  <div className="skeleton skeleton-text" />
                </div>
              ))
            ) : clients?.length ? (
              clients.map((c) => (
                <article key={c.id} className={`card fade-in ${styles.clientCard}`}>
                  <span className="tag">{c.industry}</span>
                  <h3>{c.name}</h3>
                  <p>{c.summary}</p>
                </article>
              ))
            ) : (
              <p style={{ color: "var(--color-text-muted)" }}>No clients listed yet.</p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}