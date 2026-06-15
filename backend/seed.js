const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const { Skill, Project, Education, Profile } = require('./models/index');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio');
    console.log('✅ Connected to MongoDB');

    // Create Admin User
    const existingAdmin = await User.findOne({ email: 'harshinisvs48@gmail.com' });
    if (!existingAdmin) {
      await User.create({
        name: 'Harshini SureshKumar',
        email: 'harshinisvs48@gmail.com',
        password: 'Admin@123',
        role: 'admin'
      });
      console.log('✅ Admin user created');
      console.log('   Email: harshinisvs48@gmail.com');
      console.log('   Password: Admin@123');
      console.log('   ⚠️  CHANGE THE PASSWORD AFTER FIRST LOGIN!');
    } else {
      console.log('ℹ️  Admin user already exists');
    }

    // Seed Profile
    const existingProfile = await Profile.findOne();
    if (!existingProfile) {
      await Profile.create({
        name: 'Harshini SureshKumar',
        title: 'Computer Science & Engineering Student',
        subtitle: 'Aspiring Full Stack Developer',
        email: 'harshinisvs48@gmail.com',
        location: 'Tamil Nadu, India',
        github: 'https://github.com/Harshini-BS',
        linkedin: 'https://www.linkedin.com/in/harshini-sureshkumar-39a5b5290',
        leetcode: 'https://leetcode.com/u/Harshinisvs/',
        typingTexts: ['Full Stack Developer', 'CS Engineering Student', 'Problem Solver', 'Web Developer', 'Open Source Enthusiast'],
        bio: 'A Computer Science and Engineering student passionate about programming, problem-solving, and emerging technologies.',
        about: "Hello! I'm Harshini SureshKumar, a Computer Science and Engineering student passionate about programming, problem-solving, and emerging technologies. I believe true learning comes not just from knowing a language, but from understanding concepts and applying them to real-world problems. I am particularly interested in Web Development.",
        objective: 'To leverage my technical foundation in Computer Science and my passion for full-stack web development to contribute meaningfully to innovative teams, while continuously enhancing my skills in the ever-evolving technology landscape.'
      });
      console.log('✅ Profile seeded');
    }

    // Seed Skills
    const skillCount = await Skill.countDocuments();
    if (skillCount === 0) {
      const skills = [
        { name: 'React.js', category: 'Frontend', proficiency: 85, order: 1 },
        { name: 'HTML', category: 'Frontend', proficiency: 95, order: 2 },
        { name: 'CSS', category: 'Frontend', proficiency: 90, order: 3 },
        { name: 'JavaScript', category: 'Frontend', proficiency: 82, order: 4 },
        { name: 'Java', category: 'Programming Languages', proficiency: 80, order: 1 },
        { name: 'MongoDB', category: 'Database', proficiency: 78, order: 1 },
        { name: 'Git & GitHub', category: 'Tools', proficiency: 88, order: 1 },
        { name: 'Postman API', category: 'Tools', proficiency: 78, order: 2 },
        { name: 'Figma', category: 'Design', proficiency: 80, order: 1 },
        { name: 'Canva', category: 'Design', proficiency: 85, order: 2 },
        { name: 'Prototyping', category: 'Design', proficiency: 75, order: 3 },
        { name: 'Agile Methodology', category: 'Other', proficiency: 80, order: 1 },
        { name: 'Software Project Management', category: 'Other', proficiency: 75, order: 2 },
        { name: 'IoT', category: 'Other', proficiency: 70, order: 3 },
        { name: 'Active Learner', category: 'Soft Skills', proficiency: 95, order: 1 },
        { name: 'Collaborative Person', category: 'Soft Skills', proficiency: 90, order: 2 },
        { name: 'Problem Solving', category: 'Soft Skills', proficiency: 88, order: 3 },
        { name: 'Teamwork', category: 'Soft Skills', proficiency: 92, order: 4 },
      ];
      await Skill.insertMany(skills);
      console.log(`✅ ${skills.length} skills seeded`);
    }

    // Seed Projects
    const projectCount = await Project.countDocuments();
    if (projectCount === 0) {
      const projects = [
        {
          title: 'Campus Event Hub',
          description: 'Campus Event Hub is a centralized system designed to simplify event management in educational institutions. It allows administrators to create and manage events while enabling students to explore, register, and participate in various campus activities seamlessly.',
          technologies: ['Angular', 'Node.js', 'Express.js', 'MongoDB'],
          githubLink: 'https://github.com/Harshini-BS/Campus-Event-Hub',
          liveLink: '',
          category: 'Web Development',
          featured: true,
          order: 1
        },
        {
          title: 'MediBook – AI-Powered Healthcare Appointment Booking System',
          description: 'MediBook is a healthcare appointment system that helps users book, manage, and cancel hospital appointments with AI-based symptom guidance for selecting the right medical department.',
          technologies: ['MongoDB', 'Express.js', 'React.js', 'Node.js'],
          githubLink: 'https://github.com/Harshini-BS/MediBook-AI-Powered-Healthcare-Appointment-Booking-System',
          liveLink: '',
          category: 'Web Development',
          featured: true,
          order: 2
        },
        {
          title: 'UI/UX Design Portfolio',
          description: 'Designed modern and user-friendly UI/UX interfaces using Figma. Focused on creating intuitive user experiences, clean visual designs, and mobile-friendly interfaces through wireframes, prototypes, and high-fidelity mockups.',
          technologies: ['Figma'],
          githubLink: 'https://github.com/Harshini-BS/UI_UX-Design',
          liveLink: '',
          category: 'Design',
          featured: false,
          order: 3
        }
      ];
      await Project.insertMany(projects);
      console.log(`✅ ${projects.length} projects seeded`);
    }

    // Seed Education
    const eduCount = await Education.countDocuments();
    if (eduCount === 0) {
      await Education.create({
        degree: 'B.E. Computer Science and Engineering',
        institution: 'Velalar College of Engineering and Technology',
        year: 'Final Year (2021–2025)',
        grade: '',
        description: 'Pursuing Bachelor of Engineering in Computer Science with focus on full-stack development, data structures, algorithms, software engineering, and emerging technologies.',
        order: 1
      });
      console.log('✅ Education seeded');
    }

    console.log('\n🎉 Database seeding completed!');
    console.log('\n📋 Admin Login Credentials:');
    console.log('   URL:      http://localhost:3000/admin/login');
    console.log('   Email:    harshinisvs48@gmail.com');
    console.log('   Password: Admin@123');
    console.log('\n⚠️  Please change the default password after first login!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedData();