import { motion } from 'framer-motion';
import { FiMapPin, FiMail, FiGithub, FiLinkedin } from 'react-icons/fi';
import { SiLeetcode } from 'react-icons/si';
import './about.css';

const About = () => {
  const fadeUp = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } };

  return (
    <main>
      <div className="page-hero">
        <div className="container">
          <motion.h1
            className="section-title"
            initial="hidden"
            animate="show"
            variants={fadeUp}
          >
            About Me
          </motion.h1>
          <div className="section-divider" />
          <motion.p
            className="section-subtitle"
            initial="hidden"
            animate="show"
            variants={fadeUp}
            transition={{ delay: 0.1 }}
          >
            Get to know me better — my journey, passion, and what drives me.
          </motion.p>
        </div>
      </div>

      <section className="section about-section">
        <div className="container">
          <div className="about-grid">

            {/* Left: Image + Info */}
            <motion.div
              className="about-left"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="about-image-card">
                <div className="about-avatar">
                  <span>HS</span>
                </div>
                <h2>Harshini SureshKumar</h2>
                <p className="about-title">CSE Student & Aspiring Full Stack Developer</p>
                <div className="about-info-list">
                  <div className="about-info-item">
                    <FiMapPin /> Tamil Nadu, India
                  </div>
                  <div className="about-info-item">
                    <FiMail /> harshinisvs48@gmail.com
                  </div>
                </div>
                <div className="about-socials">
                  <a href="https://github.com/Harshini-BS" target="_blank" rel="noreferrer">
                    <FiGithub />
                  </a>
                  <a href="https://www.linkedin.com/in/harshini-sureshkumar-39a5b5290" target="_blank" rel="noreferrer">
                    <FiLinkedin />
                  </a>
                  <a href="https://leetcode.com/u/Harshinisvs/" target="_blank" rel="noreferrer">
                    <SiLeetcode />
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Right: Content */}
            <div className="about-right">

              <motion.div
                className="about-block"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="about-block__tag">Introduction</div>
                <h3>Who I Am</h3>
                <p>
                  Hello! I'm Harshini SureshKumar, a Computer Science and Engineering student
                  with a genuine passion for programming, problem-solving, and emerging technologies.
                  I believe true learning comes not just from knowing a language, but from
                  understanding core concepts and applying them to solve real-world problems.
                </p>
                <p>
                  I enjoy collaborating with others and actively participate in both technical
                  and non-technical activities, which have strengthened my communication,
                  teamwork, and leadership skills. I am always eager to explore new technologies,
                  build innovative solutions, and grow continuously in the field of computer science.
                </p>
                <p>
                  I am particularly interested in <strong>Web Development</strong> — designing
                  and building full-stack applications that create meaningful user experiences
                  and solve practical problems.
                </p>
              </motion.div>

              <motion.div
                className="about-block"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                <div className="about-block__tag">Career Objective</div>
                <h3>What I'm Aiming For</h3>
                <p>
                  To leverage my technical foundation in Computer Science and my passion for
                  full-stack web development to contribute meaningfully to innovative teams.
                  I aim to build impactful, scalable, and user-centric digital products while
                  continuously enhancing my skills and knowledge in the ever-evolving technology landscape.
                </p>
              </motion.div>

              <motion.div
                className="about-block"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <div className="about-block__tag">Interests</div>
                <h3>What I Love</h3>
                <div className="interest-tags">
                  {[
                    'Web Development', 'Full Stack Development', 'UI/UX Design',
                    'Problem Solving', 'Open Source', 'IoT', 'Agile Development',
                    'Software Engineering', 'Competitive Coding'
                  ].map(tag => (
                    <span key={tag} className="badge badge-primary">{tag}</span>
                  ))}
                </div>
              </motion.div>

              <motion.div
                className="about-block"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <div className="about-block__tag">Education</div>
                <h3>Academic Background</h3>
                <div className="about-edu">
                  <div className="about-edu__icon">🎓</div>
                  <div>
                    <strong>B.E. Computer Science and Engineering</strong>
                    <p>Velalar College of Engineering and Technology</p>
                    <span className="badge badge-accent">Final Year (2023–2027)</span>
                  </div>
                </div>
                <div className="about-edu" style={{ marginTop: 16 }}>
                  <div className="about-edu__icon">🏫</div>
                  <div>
                    <strong>Higher Secondary Education (Maths & Computer Science)</strong>
                    <p>Saradha Vidhyalaya Matriculation Higher Secondary School</p>
                    <span className="badge badge-accent">2022 – 2023</span>
                  </div>
                </div>
              </motion.div>

            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default About;