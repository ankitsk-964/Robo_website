import { useFetch } from "../hooks/useFetch.js";
import styles from "./Careers.module.css";

export default function Careers() {
  const { data: jobs, loading } = useFetch("/api/public/careers");

  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <p className="eyebrow">Work with us</p>
          <h1 className={styles.title}>Current openings</h1>
          <p>Join our engineering team and work on real robotics and hardware challenges.</p>
        </div>

        {loading ? (
          <div className={styles.grid}>
            {[1,2,3].map((i) => (
              <div key={i} className="card">
                <div className="skeleton skeleton-heading" />
                <div className="skeleton skeleton-text" style={{ width: "60%" }} />
                <div className="skeleton skeleton-text" />
                <div className="skeleton skeleton-text" style={{ width: "80%" }} />
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.grid}>
            {jobs?.map((job) => (
              <article key={job.id} className={`card fade-in ${styles.jobCard}`}>
                <h2>{job.title}</h2>
                <div className={styles.meta}>
                  <span className="tag">{job.location}</span>
                  <span className="tag">{job.type}</span>
                  <span className="tag">{job.experience}</span>
                </div>
                <p>{job.description}</p>
                <a href="/contact" className="btn btn-secondary">Apply via contact</a>
              </article>
            ))}
            {!jobs?.length && <p className={styles.empty}>No openings at the moment. Check back soon.</p>}
          </div>
        )}
      </div>
    </section>
  );
}