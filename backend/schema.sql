CREATE TABLE IF NOT EXISTS clients (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  industry VARCHAR(120) NOT NULL,
  summary TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS career_openings (
  id SERIAL PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  location VARCHAR(120) NOT NULL,
  employment_type VARCHAR(80) NOT NULL,
  experience_level VARCHAR(80) NOT NULL,
  description TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS internships (
  id SERIAL PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  duration VARCHAR(80) NOT NULL,
  mode VARCHAR(80) NOT NULL,
  description TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS internship_applications (
  id SERIAL PRIMARY KEY,
  student_name VARCHAR(150) NOT NULL,
  student_email VARCHAR(150) NOT NULL,
  student_phone VARCHAR(30) NOT NULL,
  student_college VARCHAR(150) NOT NULL,
  student_degree VARCHAR(150) NOT NULL,
  internship_track VARCHAR(150) NOT NULL,
  student_skills TEXT,
  student_statement TEXT NOT NULL,
  status VARCHAR(40) DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL,
  subject VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO clients (name, industry, summary)
VALUES
('Astra Manufacturing', 'Industrial Automation', 'Prototype integration and robotics workflow support.'),
('Circuit Forge Labs', 'Embedded Systems', 'Hardware validation and controller support.')
ON CONFLICT DO NOTHING;

INSERT INTO career_openings (title, location, employment_type, experience_level, description)
VALUES
('Robotics Engineer', 'Delhi / On-site', 'Full-time', '2+ years', 'Work on robotics integration, actuator systems, control logic, testing, and deployment support.'),
('Embedded Hardware Engineer', 'Delhi / Hybrid', 'Full-time', '1+ years', 'Support controller boards, embedded electronics, debugging, schematics review, and hardware bring-up.')
ON CONFLICT DO NOTHING;

INSERT INTO internships (title, duration, mode, description)
VALUES
('Robotics Internship', '8-12 weeks', 'On-site / Hybrid', 'Learn robotics fundamentals, integration, sensor interfacing, system assembly, and testing workflows.'),
('Embedded Systems Internship', '8-12 weeks', 'On-site / Hybrid', 'Work on microcontrollers, serial protocols, firmware basics, debugging, and hardware-software integration.')
ON CONFLICT DO NOTHING;