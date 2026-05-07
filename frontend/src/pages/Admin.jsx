import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useFetch } from "../hooks/useFetch.js";
import { apiPost, apiDelete, apiPatch } from "../utils/api.js";
import styles from "./Admin.module.css";

export default function Admin() {
  const { isAdmin, checking, login, logout } = useAuth();
  const [loginError, setLoginError] = useState("");
  const [activeTab, setActiveTab] = useState("clients");

  if (checking) return <div className={`section container ${styles.checking}`}><p>Checking session...</p></div>;

  if (!isAdmin) return <AdminLogin onLogin={login} error={loginError} setError={setLoginError} />;

  return (
    <section className="section">
      <div className="container">
        <div className={styles.toolbar}>
          <div>
            <p className="eyebrow">Operations</p>
            <h1 className={styles.title}>Admin panel</h1>
          </div>
          <button className="btn btn-secondary" onClick={logout}>Logout</button>
        </div>

        <div className="tabs" role="tablist">
          {["clients","careers","internships","applications","messages"].map((tab) => (
            <button
              key={tab}
              className={`tab-btn ${activeTab === tab ? "active" : ""}`}
              role="tab"
              aria-selected={activeTab === tab}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className={styles.tabContent}>
          {activeTab === "clients"      && <ClientsTab />}
          {activeTab === "careers"      && <CareersTab />}
          {activeTab === "internships"  && <InternshipsTab />}
          {activeTab === "applications" && <ApplicationsTab />}
          {activeTab === "messages"     && <MessagesTab />}
        </div>
      </div>
    </section>
  );
}

function AdminLogin({ onLogin, error, setError }) {
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await onLogin(e.target.username.value, e.target.password.value);
    } catch {
      setError("Invalid username or password.");
    }
  };

  return (
    <section className="section">
      <div className={`container ${styles.loginWrap}`}>
        <div className="form-card">
          <p className="eyebrow">Restricted area</p>
          <h1 className={styles.title}>Admin login</h1>
          <form onSubmit={handleSubmit} noValidate className={styles.form}>
            <div className="field">
              <label htmlFor="username">Username</label>
              <input id="username" name="username" type="text" required autoComplete="username" />
            </div>
            <div className="field">
              <label htmlFor="password">Password</label>
              <input id="password" name="password" type="password" required autoComplete="current-password" />
            </div>
            <button type="submit" className="btn btn-primary">Sign in</button>
            {error && <p className="form-status error">{error}</p>}
          </form>
        </div>
      </div>
    </section>
  );
}

function ClientsTab() {
  const { data: clients, loading, refetch } = useFetch("/api/admin/clients");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    try {
      await apiPost("/api/admin/clients", Object.fromEntries(fd.entries()));
      e.target.reset(); setStatus("Client saved."); refetch();
    } catch { setStatus("Save failed."); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this client?")) return;
    try { await apiDelete(`/api/admin/clients/${id}`); refetch(); }
    catch { alert("Delete failed."); }
  };

  return (
    <div className={styles.twoCol}>
      <div className="form-card">
        <h2 className={styles.panelTitle}>Add client</h2>
        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <div className="field"><label>Client name</label><input name="name" required /></div>
          <div className="field"><label>Industry</label><input name="industry" required /></div>
          <div className="field"><label>Summary</label><textarea name="summary" rows={4} required /></div>
          <button className="btn btn-primary" type="submit">Save client</button>
          <p className="form-status">{status}</p>
        </form>
      </div>
      <div>
        <h2 className={styles.panelTitle}>Client records</h2>
        <div className={styles.listGrid}>
          {loading ? <p>Loading...</p> : clients?.map((c) => (
            <div key={c.id} className="list-item">
              <div className="list-item-header">
                <strong>{c.name}</strong>
                <div className="inline-actions">
                  <button className="btn btn-danger" onClick={() => handleDelete(c.id)}>Delete</button>
                </div>
              </div>
              <span className="tag">{c.industry}</span>
              <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)" }}>{c.summary}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CareersTab() {
  const { data: careers, loading, refetch } = useFetch("/api/admin/careers");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    try {
      await apiPost("/api/admin/careers", Object.fromEntries(fd.entries()));
      e.target.reset(); setStatus("Career opening saved."); refetch();
    } catch { setStatus("Save failed."); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this opening?")) return;
    try { await apiDelete(`/api/admin/careers/${id}`); refetch(); }
    catch { alert("Delete failed."); }
  };

  return (
    <div className={styles.twoCol}>
      <div className="form-card">
        <h2 className={styles.panelTitle}>Add opening</h2>
        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <div className="field"><label>Job title</label><input name="title" required /></div>
          <div className="field"><label>Location</label><input name="location" required /></div>
          <div className="field"><label>Employment type</label><input name="employment_type" required placeholder="Full-time, Part-time..." /></div>
          <div className="field"><label>Experience level</label><input name="experience_level" required placeholder="1+ years, Fresher..." /></div>
          <div className="field"><label>Description</label><textarea name="description" rows={4} required /></div>
          <button className="btn btn-primary" type="submit">Save opening</button>
          <p className="form-status">{status}</p>
        </form>
      </div>
      <div>
        <h2 className={styles.panelTitle}>Current openings</h2>
        <div className={styles.listGrid}>
          {loading ? <p>Loading...</p> : careers?.map((c) => (
            <div key={c.id} className="list-item">
              <div className="list-item-header">
                <strong>{c.title}</strong>
                <button className="btn btn-danger" onClick={() => handleDelete(c.id)}>Delete</button>
              </div>
              <div style={{ display:"flex", gap:"8px", flexWrap:"wrap" }}>
                <span className="tag">{c.location}</span>
                <span className="tag">{c.employment_type}</span>
              </div>
              <p style={{ fontSize:"var(--text-sm)", color:"var(--color-text-muted)" }}>{c.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function InternshipsTab() {
  const { data: internships, loading, refetch } = useFetch("/api/admin/internships");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    try {
      await apiPost("/api/admin/internships", Object.fromEntries(fd.entries()));
      e.target.reset(); setStatus("Internship track saved."); refetch();
    } catch { setStatus("Save failed."); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this internship track?")) return;
    try { await apiDelete(`/api/admin/internships/${id}`); refetch(); }
    catch { alert("Delete failed."); }
  };

  return (
    <div className={styles.twoCol}>
      <div className="form-card">
        <h2 className={styles.panelTitle}>Add internship track</h2>
        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <div className="field"><label>Track title</label><input name="title" required /></div>
          <div className="field"><label>Duration</label><input name="duration" required placeholder="8-12 weeks" /></div>
          <div className="field"><label>Mode</label><input name="mode" required placeholder="On-site / Hybrid" /></div>
          <div className="field"><label>Description</label><textarea name="description" rows={4} required /></div>
          <button className="btn btn-primary" type="submit">Save track</button>
          <p className="form-status">{status}</p>
        </form>
      </div>
      <div>
        <h2 className={styles.panelTitle}>Internship tracks</h2>
        <div className={styles.listGrid}>
          {loading ? <p>Loading...</p> : internships?.map((i) => (
            <div key={i.id} className="list-item">
              <div className="list-item-header">
                <strong>{i.title}</strong>
                <button className="btn btn-danger" onClick={() => handleDelete(i.id)}>Delete</button>
              </div>
              <div style={{ display:"flex", gap:"8px" }}>
                <span className="tag">{i.duration}</span>
                <span className="tag">{i.mode}</span>
              </div>
              <p style={{ fontSize:"var(--text-sm)", color:"var(--color-text-muted)" }}>{i.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ApplicationsTab() {
  const { data: apps, loading, refetch } = useFetch("/api/admin/applications");

  const updateStatus = async (id, status) => {
    try { await apiPatch(`/api/admin/applications/${id}/status`, { status }); refetch(); }
    catch { alert("Update failed."); }
  };

  const statusColors = { new: "", reviewing: "tag-warning", accepted: "tag-success", rejected: "tag-error" };

  return (
    <div>
      <h2 className={styles.panelTitle}>Internship applications ({apps?.length || 0})</h2>
      <div className={styles.listGrid}>
        {loading ? <p>Loading...</p> : !apps?.length ? <p style={{ color:"var(--color-text-muted)" }}>No applications yet.</p> : apps.map((a) => (
          <div key={a.id} className="list-item">
            <div className="list-item-header">
              <strong>{a.student_name}</strong>
              <div className="inline-actions">
                <span className={`tag ${statusColors[a.status] || ""}`}>{a.status}</span>
                {a.status === "new" && <button className="btn btn-secondary" style={{ fontSize:"var(--text-xs)", minHeight:"36px", padding:"0.5rem 0.8rem" }} onClick={() => updateStatus(a.id, "reviewing")}>Review</button>}
                {a.status === "reviewing" && (
                  <>
                    <button className="btn btn-primary" style={{ fontSize:"var(--text-xs)", minHeight:"36px" }} onClick={() => updateStatus(a.id, "accepted")}>Accept</button>
                    <button className="btn btn-danger" style={{ fontSize:"var(--text-xs)", minHeight:"36px" }} onClick={() => updateStatus(a.id, "rejected")}>Reject</button>
                  </>
                )}
              </div>
            </div>
            <div style={{ display:"flex", gap:"8px", flexWrap:"wrap" }}>
              <span className="tag">{a.internship_track}</span>
              <span className="tag">{a.student_college}</span>
            </div>
            <div className="list-item-body">
              {[["Email", a.student_email], ["Phone", a.student_phone], ["Degree", a.student_degree], ["Skills", a.student_skills || "—"], ["Statement", a.student_statement]].map(([k, v]) => (
                <p key={k}><strong>{k}:</strong> {v}</p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MessagesTab() {
  const { data: messages, loading } = useFetch("/api/admin/messages");

  return (
    <div>
      <h2 className={styles.panelTitle}>Contact messages ({messages?.length || 0})</h2>
      <div className={styles.listGrid}>
        {loading ? <p>Loading...</p> : !messages?.length ? <p style={{ color:"var(--color-text-muted)" }}>No messages yet.</p> : messages.map((m) => (
          <div key={m.id} className="list-item">
            <div className="list-item-header">
              <strong>{m.name}</strong>
              <span className="tag">{m.subject}</span>
            </div>
            <div className="list-item-body">
              <p><strong>Email:</strong> {m.email}</p>
              <p><strong>Message:</strong> {m.message}</p>
              <p style={{ fontSize:"var(--text-xs)", color:"var(--color-text-faint)", marginTop:"8px" }}>
                {new Date(m.created_at).toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}