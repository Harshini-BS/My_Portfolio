const mongoose = require('mongoose');

// Project Model
const projectSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  technologies: [{ type: String, trim: true }],
  image: { type: String, default: '' },
  githubLink: { type: String, default: '' },
  liveLink: { type: String, default: '' },
  category: { type: String, default: 'Web Development' },
  featured: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
  order: { type: Number, default: 0 }
}, { timestamps: true });

// Skill Model
const skillSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: {
    type: String,
    enum: ['Programming Languages', 'Frontend', 'Backend', 'Database', 'Tools', 'Soft Skills', 'Design', 'Other'],
    default: 'Other'
  },
  proficiency: { type: Number, min: 0, max: 100, default: 80 },
  icon: { type: String, default: '' },
  order: { type: Number, default: 0 }
}, { timestamps: true });

// Certificate Model
const certificateSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  organization: { type: String, required: true, trim: true },
  date: { type: String, default: '' },
  image: { type: String, default: '' },
  credentialUrl: { type: String, default: '' },
  order: { type: Number, default: 0 }
}, { timestamps: true });

// Education Model
const educationSchema = new mongoose.Schema({
  degree: { type: String, required: true, trim: true },
  institution: { type: String, required: true, trim: true },
  year: { type: String, required: true },
  grade: { type: String, default: '' },
  description: { type: String, default: '' },
  order: { type: Number, default: 0 }
}, { timestamps: true });

// Experience Model
const experienceSchema = new mongoose.Schema({
  company: { type: String, required: true, trim: true },
  role: { type: String, required: true, trim: true },
  duration: { type: String, required: true },
  type: { type: String, enum: ['Internship', 'Full-time', 'Part-time', 'Freelance'], default: 'Internship' },
  responsibilities: [{ type: String }],
  technologies: [{ type: String }],
  description: { type: String, default: '' },
  order: { type: Number, default: 0 }
}, { timestamps: true });

// Achievement Model
const achievementSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  category: {
    type: String,
    enum: ['Award', 'Competition', 'Hackathon', 'Paper Presentation', 'Other'],
    default: 'Other'
  },
  description: { type: String, default: '' },
  date: { type: String, default: '' },
  organization: { type: String, default: '' },
  image: { type: String, default: '' },
  order: { type: Number, default: 0 }
}, { timestamps: true });

// Blog Model
const blogSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  content: { type: String, required: true },
  excerpt: { type: String, default: '' },
  category: { type: String, default: 'Technology' },
  tags: [{ type: String }],
  image: { type: String, default: '' },
  published: { type: Boolean, default: true },
  views: { type: Number, default: 0 },
  slug: { type: String, unique: true }
}, { timestamps: true });

blogSchema.pre('save', function(next) {
  if (!this.slug) {
    this.slug = this.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }
  next();
});

// Message Model
const messageSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  subject: { type: String, required: true, trim: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false }
}, { timestamps: true });

// Analytics Model
const analyticsSchema = new mongoose.Schema({
  date: { type: String, required: true, unique: true },
  visitors: { type: Number, default: 0 },
  pageViews: { type: Number, default: 0 },
  pages: { type: Map, of: Number, default: {} }
}, { timestamps: true });

// Testimonial Model
const testimonialSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  role: { type: String, default: '' },
  company: { type: String, default: '' },
  message: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5, default: 5 },
  image: { type: String, default: '' },
  approved: { type: Boolean, default: false },
  order: { type: Number, default: 0 }
}, { timestamps: true });

// Resume Model
const resumeSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  path: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Profile Model
const profileSchema = new mongoose.Schema({
  name: { type: String, default: 'Harshini SureshKumar' },
  title: { type: String, default: 'Computer Science & Engineering Student' },
  subtitle: { type: String, default: 'Aspiring Full Stack Developer' },
  bio: { type: String, default: '' },
  email: { type: String, default: 'harshinisvs48@gmail.com' },
  phone: { type: String, default: '' },
  location: { type: String, default: 'Tamil Nadu, India' },
  github: { type: String, default: 'https://github.com/Harshini-BS' },
  linkedin: { type: String, default: 'https://www.linkedin.com/in/harshini-sureshkumar-39a5b5290' },
  leetcode: { type: String, default: 'https://leetcode.com/u/Harshinisvs/' },
  profileImage: { type: String, default: '' },
  typingTexts: [{ type: String }],
  about: { type: String, default: '' },
  objective: { type: String, default: '' }
}, { timestamps: true });

module.exports = {
  Project: mongoose.model('Project', projectSchema),
  Skill: mongoose.model('Skill', skillSchema),
  Certificate: mongoose.model('Certificate', certificateSchema),
  Education: mongoose.model('Education', educationSchema),
  Experience: mongoose.model('Experience', experienceSchema),
  Achievement: mongoose.model('Achievement', achievementSchema),
  Blog: mongoose.model('Blog', blogSchema),
  Message: mongoose.model('Message', messageSchema),
  Analytics: mongoose.model('Analytics', analyticsSchema),
  Testimonial: mongoose.model('Testimonial', testimonialSchema),
  Resume: mongoose.model('Resume', resumeSchema),
  Profile: mongoose.model('Profile', profileSchema)
};