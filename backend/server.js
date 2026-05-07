import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import session from "express-session";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import pkg from "pg";
import { z } from "zod";
import connectPgSimple from "connect-pg-simple";
import cors from "cors";

dotenv.config();

const { Pool } = pkg;


const app = express();
const port = Number(process.env.PORT || 4000);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    require:            true,
    rejectUnauthorized: false,   // Neon uses Let's Encrypt — safe to leave false
  },
  max:                10,        // Neon free tier has a connection limit
  idleTimeoutMillis:  30000,
  connectionTimeoutMillis: 5000,
});

app.set("trust proxy", 1);

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:"],
      connectSrc: ["'self'"],
      objectSrc: ["'none'"],
      frameAncestors: ["'self'"],
      baseUri: ["'self'"],
      formAction: ["'self'"]
    }
  },
  crossOriginEmbedderPolicy: false
}));



app.use(cors({
  origin:      process.env.ALLOWED_ORIGIN,
  credentials: true,               // allows cookies to be sent cross-origin
}));

app.use(cookieParser());
app.use(express.json({ limit: "250kb" }));
app.use(express.urlencoded({ extended: true, limit: "250kb" }));

const PgSession = connectPgSimple(session);
app.use(session({
  name:   "trbg.sid",
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: new PgSession({
    pool,
    tableName: "user_sessions",
    createTableIfMissing: true,   // auto-creates the sessions table in Neon
  }),
  cookie: {
    httpOnly: true,
    sameSite: "none",             // required for cross-origin (Vercel ↔ Render)
    secure:   true,               // required for sameSite: "none"
    maxAge:   1000 * 60 * 60 * 8
  }
}));

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false
});

app.use(globalLimiter);

const contactSchema = z.object({
  name: z.string().min(2).max(150),
  email: z.string().email().max(150),
  subject: z.string().min(2).max(200),
  message: z.string().min(5).max(5000)
});

const internshipApplicationSchema = z.object({
  studentName: z.string().min(2).max(150),
  studentEmail: z.string().email().max(150),
  studentPhone: z.string().min(7).max(30),
  studentCollege: z.string().min(2).max(150),
  studentDegree: z.string().min(2).max(150),
  internshipTrack: z.string().min(2).max(150),
  studentSkills: z.string().max(1000).optional().or(z.literal("")),
  studentStatement: z.string().min(10).max(5000)
});

const loginSchema = z.object({
  username: z.string().min(3).max(100),
  password: z.string().min(8).max(200)
});

const clientSchema = z.object({
  name: z.string().min(2).max(150),
  industry: z.string().min(2).max(120),
  summary: z.string().min(5).max(1500)
});

function requireAdmin(req, res, next) {
  if (req.session?.isAdmin) return next();
  return res.status(401).json({ error: "Unauthorized" });
}

function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

app.get("/api/public/clients", asyncHandler(async (_req, res) => {
  const { rows } = await pool.query(
    "SELECT id, name, industry, summary FROM clients ORDER BY id DESC"
  );
  res.json(rows);
}));

app.get("/api/public/careers", asyncHandler(async (_req, res) => {
  const { rows } = await pool.query(
    `SELECT id, title, location, employment_type AS type, experience_level AS experience, description
     FROM career_openings
     WHERE is_active = TRUE
     ORDER BY id DESC`
  );
  res.json(rows);
}));

app.get("/api/public/internships", asyncHandler(async (_req, res) => {
  const { rows } = await pool.query(
    `SELECT id, title, duration, mode, description
     FROM internships
     WHERE is_active = TRUE
     ORDER BY id DESC`
  );
  res.json(rows);
}));

app.post("/api/public/contact", asyncHandler(async (req, res) => {
  const parsed = contactSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });

  const { name, email, subject, message } = parsed.data;
  await pool.query(
    `INSERT INTO contact_messages (name, email, subject, message)
     VALUES ($1, $2, $3, $4)`,
    [name, email, subject, message]
  );

  res.status(201).json({ ok: true });
}));

app.post("/api/public/internships/apply", asyncHandler(async (req, res) => {
  const parsed = internshipApplicationSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });

  const {
    studentName,
    studentEmail,
    studentPhone,
    studentCollege,
    studentDegree,
    internshipTrack,
    studentSkills,
    studentStatement
  } = parsed.data;

  await pool.query(
    `INSERT INTO internship_applications
     (student_name, student_email, student_phone, student_college, student_degree, internship_track, student_skills, student_statement)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [studentName, studentEmail, studentPhone, studentCollege, studentDegree, internshipTrack, studentSkills || null, studentStatement]
  );

  res.status(201).json({ ok: true });
}));

app.post("/api/admin/login", authLimiter, asyncHandler(async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid credentials" });

  const usernameMatch = parsed.data.username === process.env.ADMIN_USERNAME;
  const passwordMatch = await bcrypt.compare(parsed.data.password, process.env.ADMIN_PASSWORD_HASH);

  if (!usernameMatch || !passwordMatch) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  req.session.isAdmin = true;
  req.session.adminUser = parsed.data.username;
  res.json({ ok: true });
}));

app.post("/api/admin/logout", requireAdmin, (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("trbg.sid");
    res.json({ ok: true });
  });
});

// Session check — used by frontend to restore admin state on page refresh
app.get("/api/admin/session", (req, res) => {
  res.json({ isAdmin: req.session?.isAdmin === true });
});

app.get("/api/admin/clients", requireAdmin, asyncHandler(async (_req, res) => {
  const { rows } = await pool.query("SELECT id, name, industry, summary FROM clients ORDER BY id DESC");
  res.json(rows);
}));

app.post("/api/admin/clients", requireAdmin, asyncHandler(async (req, res) => {
  const parsed = clientSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });

  const { name, industry, summary } = parsed.data;
  const { rows } = await pool.query(
    `INSERT INTO clients (name, industry, summary)
     VALUES ($1, $2, $3)
     RETURNING id, name, industry, summary`,
    [name, industry, summary]
  );

  res.status(201).json(rows[0]);
}));

app.delete("/api/admin/clients/:id", requireAdmin, asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: "Invalid id" });

  await pool.query("DELETE FROM clients WHERE id = $1", [id]);
  res.json({ ok: true });
}));

app.get("/api/admin/applications", requireAdmin, asyncHandler(async (_req, res) => {
  const { rows } = await pool.query(
    `SELECT id, student_name, student_email, student_phone, student_college, student_degree,
            internship_track, student_skills, student_statement, status, created_at
     FROM internship_applications
     ORDER BY created_at DESC`
  );
  res.json(rows);
}));

app.get("/api/admin/messages", requireAdmin, asyncHandler(async (_req, res) => {
  const { rows } = await pool.query(
    `SELECT id, name, email, subject, message, created_at
     FROM contact_messages
     ORDER BY created_at DESC`
  );
  res.json(rows);
}));


// ── Admin: Careers ──────────────────────────────────────────
app.get("/api/admin/careers", requireAdmin, asyncHandler(async (_req, res) => {
  const { rows } = await pool.query(
    `SELECT id, title, location, employment_type, experience_level, description, is_active
     FROM career_openings ORDER BY id DESC`
  );
  res.json(rows);
}));

app.post("/api/admin/careers", requireAdmin, asyncHandler(async (req, res) => {
  const schema = z.object({
    title:            z.string().min(2).max(150),
    location:         z.string().min(2).max(120),
    employment_type:  z.string().min(2).max(80),
    experience_level: z.string().min(2).max(80),
    description:      z.string().min(5).max(3000),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });

  const { title, location, employment_type, experience_level, description } = parsed.data;
  const { rows } = await pool.query(
    `INSERT INTO career_openings (title, location, employment_type, experience_level, description)
     VALUES ($1,$2,$3,$4,$5) RETURNING *`,
    [title, location, employment_type, experience_level, description]
  );
  res.status(201).json(rows[0]);
}));

app.delete("/api/admin/careers/:id", requireAdmin, asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: "Invalid id" });
  await pool.query("DELETE FROM career_openings WHERE id = $1", [id]);
  res.json({ ok: true });
}));

// ── Admin: Internships ───────────────────────────────────────
app.get("/api/admin/internships", requireAdmin, asyncHandler(async (_req, res) => {
  const { rows } = await pool.query(
    `SELECT id, title, duration, mode, description, is_active
     FROM internships ORDER BY id DESC`
  );
  res.json(rows);
}));

app.post("/api/admin/internships", requireAdmin, asyncHandler(async (req, res) => {
  const schema = z.object({
    title:       z.string().min(2).max(150),
    duration:    z.string().min(2).max(80),
    mode:        z.string().min(2).max(80),
    description: z.string().min(5).max(3000),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });

  const { title, duration, mode, description } = parsed.data;
  const { rows } = await pool.query(
    `INSERT INTO internships (title, duration, mode, description)
     VALUES ($1,$2,$3,$4) RETURNING *`,
    [title, duration, mode, description]
  );
  res.status(201).json(rows[0]);
}));

app.delete("/api/admin/internships/:id", requireAdmin, asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: "Invalid id" });
  await pool.query("DELETE FROM internships WHERE id = $1", [id]);
  res.json({ ok: true });
}));

// ── Admin: Update application status ────────────────────────
app.patch("/api/admin/applications/:id/status", requireAdmin, asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: "Invalid id" });

  const schema = z.object({
    status: z.enum(["new", "reviewing", "accepted", "rejected"])
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid status" });

  await pool.query(
    "UPDATE internship_applications SET status = $1 WHERE id = $2",
    [parsed.data.status, id]
  );
  res.json({ ok: true });
}));


// ✅ ADD THIS instead — API-only 404
app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});