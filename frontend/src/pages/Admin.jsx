import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useFetch } from "../hooks/useFetch.js";
import { apiPost, apiDelete, apiPatch } from "../utils/api.js";
import styles from "./Admin.module.css";

const BASE = import.meta.env.VITE_API_BASE ?? "";

export default function Admin() {
  const { isAdmin, checking, login, logout } = useAuth();
  const [loginError, setLoginError] = useState("");
  const [activeTab, setActiveTab] = useState("clients");

  // ── Maintenance Mode State ──────────────────────────────────
  const [maintenance, setMaintenance] = useState(false);
  const [maintenanceLoading, setMaintenanceLoading] = useState(false);
  const [maintenanceMsg, setMaintenanceMsg] = useState("");

  // Fetch current maintenance status when admin logs in
  useEffect(() => {
    if (!isAdmin) return;
    fetch(`${BASE}/api/admin/maintenance`, { credentials: "include" })
      .then((r) => r.json())
      .then((d) => setMaintenance(d.maintenance ?? false))
      .catch(() => {});
  }, [isAdmin]);

  const toggleMaintenance = async () => {
    setMaintenanceLoading(true);
    setMaintenanceMsg("");
    try {
      const res = await fetch(`${BASE}/api/admin/maintenance`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ maintenance: !maintenance }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setMaintenance(data.maintenance);
      setMaintenanceMsg(
        data.maintenance
          ? "✅ Maintenance mode ON — visitors now see the maintenance page."
          : "✅ Maintenance mode OFF — site is live."
      );
    } catch (err) {
      setMaintenanceMsg("❌ " + err.message);
    } finally {
      setMaintenanceLoading(false);
      setTimeout(() => setMaintenanceMsg(""), 4000);
    }
  };
  // ────────────────────────────────────────────────────────────

  // Existing data hooks
  const { data: clients, refetch: refetchClients } = useFetch(`${BASE}/api/admin/clients`);
  const { data: careers, refetch: refetchCareers } = useFetch(`${BASE}/api/admin/careers`);
  const { data: internships, refetch: refetchInternships } = useFetch(`${BASE}/api/admin/internships`);
  const { data: apps, refetch: refetchApps } = useFetch(`${BASE}/api/admin/applications`);
  const { data: messages } = useFetch(`${BASE}/api/admin/messages`);

  if (checking) return <div className={styles.loading}>Checking session...</div>;

  if (!isAdmin) {
    return (
      <div className={styles.loginWrap}>
        <h2>Operations</h2>
        <p>Restricted area</p>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setLoginError("");
            const fd = new FormData(e.target);
            try {
              await login(fd.get("username"), fd.get("password"));
            } catch {
              setLoginError("Invalid username or password.");
            }
          }}
        >
          <input name="username" placeholder="Username" autoComplete="username" required />
          <input name="password" type="password" placeholder="Password" autoComplete="current-password" required />
          {loginError && <p className={styles.error}>{loginError}</p>}
          <button type="submit">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      <header className={styles.header}>
        <h1>Admin Panel</h1>
        <button onClick={logout} className={styles.logoutBtn}>Logout</button>
      </header>

      {/* ── Maintenance Mode Banner ── */}
      <div className={`${styles.maintenanceBanner} ${maintenance ? styles.maintenanceOn : styles.maintenanceOff}`}>
        <div className={styles.maintenanceInfo}>
          <span className={styles.maintenanceIcon}>{maintenance ? "🔧" : "🟢"}</span>
          <div>
            <strong>{maintenance ? "Maintenance Mode is ON" : "Site is Live"}</strong>
            <p>
              {maintenance
                ? "Visitors are seeing the maintenance page. Only admins can access the site."
                : "Your site is fully accessible to all visitors."}
            </p>
          </div>
        </div>
        <button
          onClick={toggleMaintenance}
          disabled={maintenanceLoading}
          className={maintenance ? styles.btnTurnOff : styles.btnTurnOn}
        >
          {maintenanceLoading
            ? "Updating..."
            : maintenance
            ? "Turn Off Maintenance"
            : "Enable Maintenance Mode"}
        </button>
        {maintenanceMsg && <p className={styles.maintenanceToast}>{maintenanceMsg}</p>}
      </div>

      {/* ── Tabs ── */}
      <nav className={styles.tabs}>
        {["clients", "careers", "internships", "applications", "messages"].map((tab) => (
          <button
            key={tab}
            className={activeTab === tab ? styles.activeTab : styles.tab}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </nav>

      {/* ── Clients Tab ── */}
      {activeTab === "clients" && (
        <section className={styles.section}>
          <h2>Clients</h2>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const fd = new FormData(e.target);
              await apiPost(`/api/admin/clients`, {
                name: fd.get("name"),
                industry: fd.get("industry"),
                summary: fd.get("summary"),
              });
              e.target.reset();
              refetchClients();
            }}
          >
            <input name="name" placeholder="Client name" required />
            <input name="industry" placeholder="Industry" required />
            <textarea name="summary" placeholder="Summary" required />
            <button type="submit">Add Client</button>
          </form>
          {!clients ? (
            <p>Loading...</p>
          ) : (
            clients.map((c) => (
              <div key={c.id} className={styles.card}>
                <strong>{c.name}</strong> — {c.industry}
                <p>{c.summary}</p>
                <button onClick={async () => { await apiDelete(`/api/admin/clients/${c.id}`); refetchClients(); }}>
                  Delete
                </button>
              </div>
            ))
          )}
        </section>
      )}

      {/* ── Careers Tab ── */}
      {activeTab === "careers" && (
        <section className={styles.section}>
          <h2>Careers</h2>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const fd = new FormData(e.target);
              await apiPost(`/api/admin/careers`, {
                title: fd.get("title"),
                location: fd.get("location"),
                employment_type: fd.get("employment_type"),
                experience_level: fd.get("experience_level"),
                description: fd.get("description"),
              });
              e.target.reset();
              refetchCareers();
            }}
          >
            <input name="title" placeholder="Job title" required />
            <input name="location" placeholder="Location" required />
            <input name="employment_type" placeholder="Employment type (e.g. Full-time)" required />
            <input name="experience_level" placeholder="Experience level (e.g. Mid-level)" required />
            <textarea name="description" placeholder="Description" required />
            <button type="submit">Add Career</button>
          </form>
          {!careers ? (
            <p>Loading...</p>
          ) : (
            careers.map((c) => (
              <div key={c.id} className={styles.card}>
                <strong>{c.title}</strong> — {c.location}
                <p>{c.description}</p>
                <button onClick={async () => { await apiDelete(`/api/admin/careers/${c.id}`); refetchCareers(); }}>
                  Delete
                </button>
              </div>
            ))
          )}
        </section>
      )}

      {/* ── Internships Tab ── */}
      {activeTab === "internships" && (
        <section className={styles.section}>
          <h2>Internships</h2>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const fd = new FormData(e.target);
              await apiPost(`/api/admin/internships`, {
                title: fd.get("title"),
                duration: fd.get("duration"),
                mode: fd.get("mode"),
                description: fd.get("description"),
              });
              e.target.reset();
              refetchInternships();
            }}
          >
            <input name="title" placeholder="Internship title" required />
            <input name="duration" placeholder="Duration (e.g. 3 months)" required />
            <input name="mode" placeholder="Mode (e.g. Remote)" required />
            <textarea name="description" placeholder="Description" required />
            <button type="submit">Add Internship</button>
          </form>
          {!internships ? (
            <p>Loading...</p>
          ) : (
            internships.map((i) => (
              <div key={i.id} className={styles.card}>
                <strong>{i.title}</strong> — {i.mode} · {i.duration}
                <p>{i.description}</p>
                <button onClick={async () => { await apiDelete(`/api/admin/internships/${i.id}`); refetchInternships(); }}>
                  Delete
                </button>
              </div>
            ))
          )}
        </section>
      )}

      {/* ── Applications Tab ── */}
      {activeTab === "applications" && (
        <section className={styles.section}>
          <h2>Internship Applications</h2>
          {!apps ? (
            <p>Loading...</p>
          ) : !apps.length ? (
            <p>No applications yet.</p>
          ) : (
            apps.map((a) => (
              <div key={a.id} className={styles.card}>
                {Object.entries(a).map(([k, v]) => (
                  <p key={k}><strong>{k}:</strong> {String(v)}</p>
                ))}
                <select
                  value={a.status}
                  onChange={async (e) => {
                    await apiPatch(`/api/admin/applications/${a.id}/status`, { status: e.target.value });
                    refetchApps();
                  }}
                >
                  {["new", "reviewing", "accepted", "rejected"].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            ))
          )}
        </section>
      )}

      {/* ── Messages Tab ── */}
      {activeTab === "messages" && (
        <section className={styles.section}>
          <h2>Contact Messages</h2>
          {!messages ? (
            <p>Loading...</p>
          ) : !messages.length ? (
            <p>No messages yet.</p>
          ) : (
            messages.map((m) => (
              <div key={m.id} className={styles.card}>
                <p><strong>Email:</strong> {m.email}</p>
                <p><strong>Message:</strong> {m.message}</p>
                <p>{new Date(m.created_at).toLocaleString("en-IN")}</p>
              </div>
            ))
          )}
        </section>
      )}
    </div>
  );
}