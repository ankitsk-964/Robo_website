import styles from "./About.module.css";

const FIRM = {
  name: "The Robo Battle Ground",
  address: "REPLACE_WITH_FULL_ADDRESS, Delhi, India",
  gstin: "REPLACE_WITH_GSTIN",
  msme: "REPLACE_WITH_MSME_REGISTRATION_NUMBER",
  email: "contact@therobobattleground.com",
  phone: "+91-XXXXXXXXXX",
};

export default function About() {
  return (
    <section className="section">
      <div className={`container ${styles.grid}`}>
        <div>
          <p className="eyebrow">About the firm</p>
          <h1 className={styles.title}>Company details</h1>
          <p className={styles.intro}>
            The Robo Battle Ground is an engineering firm specializing in robotics solutions,
            hardware solutions, automation systems, and embedded technology. We work with
            businesses, institutions, and innovation programs to deliver reliable, practical
            engineering outcomes.
          </p>
        </div>

        <div className={`card ${styles.detailCard}`}>
          <dl className={styles.dl}>
            {[
              ["Firm name",                 FIRM.name],
              ["Address",                   FIRM.address],
              ["GSTIN",                     FIRM.gstin],
              ["MSME registration number",  FIRM.msme],
              ["Email",                     FIRM.email, `mailto:${FIRM.email}`],
              ["Phone",                     FIRM.phone, `tel:${FIRM.phone}`],
            ].map(([label, value, href]) => (
              <div key={label} className={styles.row}>
                <dt>{label}</dt>
                <dd>
                  {href ? <a href={href} className={styles.link}>{value}</a> : value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className={`container ${styles.missionGrid}`}>
        {[
          { h: "Our mission", p: "To build reliable, practical robotics and hardware solutions that enable businesses and institutions to move faster through engineering." },
          { h: "Our approach", p: "We combine hands-on engineering expertise with structured processes to deliver systems that work in the real world, not just on paper." },
          { h: "Student programs", p: "We believe in building the next generation of engineers through meaningful internship programs across robotics, embedded systems, CAD, and IoT." },
        ].map(({ h, p }) => (
          <article key={h} className={`card fade-in ${styles.missionCard}`}>
            <h2>{h}</h2>
            <p>{p}</p>
          </article>
        ))}
      </div>
    </section>
  );
}