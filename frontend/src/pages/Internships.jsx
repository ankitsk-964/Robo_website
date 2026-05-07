import { useState } from "react";
import { useFetch } from "../hooks/useFetch.js";
import { apiPost } from "../utils/api.js";
import styles from "./Internships.module.css";

export default function Internships() {
  const { data: internships, loading } = useFetch("/api/public/internships");
  const [status, setStatus] = useState({ msg: "", type: "" });
  const [selectedTrack, setSelectedTrack] = useState("");

  const handleApply = (title) => {
    setSelectedTrack(title);
    document.getElementById("applyForm")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ msg: "Submitting...", type: "" });
    const fd = new FormData(e.target);
    const payload = Object.fromEntries(fd.entries());
    try {
      await apiPost("/api/public/apply", payload);
      e.target.reset();
      setSelectedTrack("");
      setStatus({ msg: "Application submitted successfully! We will get back to you soon.", type: "success" });
    } catch (err) {
      setStatus({ msg: err.message || "Submission failed. Please try again.", type: "error" });
    }
  };

  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <p className="eyebrow">Student programs</p>
          <h1 className={styles.title}>Internship tracks</h1>
          <p>Hands-on internship programs for college students across robotics, embedded systems, CAD, and IoT.</p>
        </div>

        {loading ? (
          <div className={styles.grid}>
            {[1,2,3,4].map((i) => <div key={i} className="card"><div className="skeleton skeleton-heading" /><div className="skeleton skeleton-text" /></div>)}
          </div>
        ) : (
          <div className={styles.grid}>
            {internships?.map((item) => (
              <article key={item.id} className={`card fade-in ${styles.internCard}`}>
                <h2>{item.title}</h2>
                <div className={styles.meta}>
                  <span className="tag">{item.duration}</span>
                  <span className="tag">{item.mode}</span>
                </div>
                <p>{item.description}</p>
                <button
                  className="btn btn-primary"
                  onClick={() => handleApply(item.title)}
                >
                  Apply now
                </button>
              </article>
            ))}
          </div>
        )}

        {/* Application Form */}
        <div id="applyForm" className={`form-card ${styles.formSection}`}>
          <h2 className={styles.formTitle}>Apply for an internship</h2>
          <p className={styles.formSub}>Fill in your details below. College students can apply here for any available internship track.</p>

          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <div className="form-grid">
              <div className="field">
                <label htmlFor="studentName">Full name</label>
                <input id="studentName" name="studentName" type="text" required />
              </div>
              <div className="field">
                <label htmlFor="studentEmail">Email address</label>
                <input id="studentEmail" name="studentEmail" type="email" required />
              </div>
              <div className="field">
                <label htmlFor="studentPhone">Phone number</label>
                <input id="studentPhone" name="studentPhone" type="tel" required />
              </div>
              <div className="field">
                <label htmlFor="studentCollege">College / University</label>
                <input id="studentCollege" name="studentCollege" type="text" required />
              </div>
              <div className="field">
                <label htmlFor="studentDegree">Degree / Branch</label>
                <input id="studentDegree" name="studentDegree" type="text" required placeholder="B.Tech ECE, Diploma Mechanical, etc." />
              </div>
              <div className="field">
                <label htmlFor="internshipTrack">Internship field</label>
                <select id="internshipTrack" name="internshipTrack" required value={selectedTrack} onChange={(e) => setSelectedTrack(e.target.value)}>
                  <option value="">Select a track</option>
                  {internships?.map((i) => <option key={i.id} value={i.title}>{i.title}</option>)}
                </select>
              </div>
              <div className="field field-full">
                <label htmlFor="studentSkills">Skills / Tools</label>
                <input id="studentSkills" name="studentSkills" type="text" placeholder="Arduino, ROS, CAD, Python, C++, PCB, SolidWorks..." />
              </div>
              <div className="field field-full">
                <label htmlFor="studentStatement">Why do you want this internship?</label>
                <textarea id="studentStatement" name="studentStatement" rows={5} required />
              </div>
            </div>
            <button type="submit" className="btn btn-primary">Submit application</button>
            <p className={`form-status ${status.type}`}>{status.msg}</p>
          </form>
        </div>
      </div>
    </section>
  );
}