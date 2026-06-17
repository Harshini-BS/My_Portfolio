const { Project, Blog, Message, Analytics, Profile, Resume } = require('../models/index');
const path = require('path');
const fs = require('fs');

// ===== PROJECT CONTROLLER =====
exports.projectController = {
  getAll: async (req, res) => {
    try {
      const { search, category, tech } = req.query;
      let query = {};
      if (search) query.$or = [{ title: { $regex: search, $options: 'i' } }, { description: { $regex: search, $options: 'i' } }];
      if (category && category !== 'all') query.category = category;
      if (tech) query.technologies = { $in: [new RegExp(tech, 'i')] };
      const projects = await Project.find(query).sort({ featured: -1, order: 1, createdAt: -1 });
      res.json({ success: true, data: projects, count: projects.length });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  getOne: async (req, res) => {
    try {
      const project = await Project.findById(req.params.id);
      if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
      project.views += 1;
      await project.save();
      res.json({ success: true, data: project });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  create: async (req, res) => {
    try {
      const data = { ...req.body };
      // if (req.file) data.image = `/uploads/images/${req.file.filename}`;
      if (req.file) data.image = req.file.path || req.file.secure_url; // Cloudinary returns secure_url
      if (data.technologies && typeof data.technologies === 'string') data.technologies = data.technologies.split(',').map(t => t.trim());
      const project = await Project.create(data);
      res.status(201).json({ success: true, data: project, message: 'Project created' });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },
  update: async (req, res) => {
    try {
      const data = { ...req.body };
      // if (req.file) data.image = `/uploads/images/${req.file.filename}`;
      if (req.file) data.image = req.file.path || req.file.secure_url; // Cloudinary returns secure_url
      if (data.technologies && typeof data.technologies === 'string') data.technologies = data.technologies.split(',').map(t => t.trim());
      const project = await Project.findByIdAndUpdate(req.params.id, data, { new: true });
      if (!project) return res.status(404).json({ success: false, message: 'Not found' });
      res.json({ success: true, data: project, message: 'Project updated' });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },
  delete: async (req, res) => {
    try {
      const project = await Project.findByIdAndDelete(req.params.id);
      if (!project) return res.status(404).json({ success: false, message: 'Not found' });
      res.json({ success: true, message: 'Project deleted' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};



// ===== MESSAGE CONTROLLER =====
exports.messageController = {
  create: async (req, res) => {
    try {
      const { name, email, subject, message } = req.body;
      if (!name || !email || !subject || !message) return res.status(400).json({ success: false, message: 'All fields are required' });
      const msg = await Message.create({ name, email, subject, message });
      res.status(201).json({ success: true, data: msg, message: 'Message sent successfully!' });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },
  getAll: async (req, res) => {
    try {
      const messages = await Message.find().sort({ createdAt: -1 });
      res.json({ success: true, data: messages, count: messages.length });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  markRead: async (req, res) => {
    try {
      const msg = await Message.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
      res.json({ success: true, data: msg });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  delete: async (req, res) => {
    try {
      await Message.findByIdAndDelete(req.params.id);
      res.json({ success: true, message: 'Message deleted' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

// ===== ANALYTICS CONTROLLER =====
exports.analyticsController = {
  trackVisit: async (req, res) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const page = req.body.page || '/';
      let analytics = await Analytics.findOne({ date: today });
      if (!analytics) analytics = new Analytics({ date: today, visitors: 0, pageViews: 0 });
      analytics.visitors += 1;
      analytics.pageViews += 1;
      analytics.pages.set(page, (analytics.pages.get(page) || 0) + 1);
      await analytics.save();
      res.json({ success: true, message: 'Visit tracked' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  getStats: async (req, res) => {
    try {
      const { Project, Skill, Certificate, Blog, Message } = require('../models/index');
      const [projects, skills, certificates, blogs, messages, unreadMessages, analytics] = await Promise.all([
        Project.countDocuments(),
        Skill.countDocuments(),
        Certificate.countDocuments(),
        Blog.countDocuments(),
        Message.countDocuments(),
        Message.countDocuments({ read: false }),
        Analytics.find().sort({ date: -1 }).limit(30)
      ]);
      const totalVisitors = analytics.reduce((sum, a) => sum + a.visitors, 0);
      const totalPageViews = analytics.reduce((sum, a) => sum + a.pageViews, 0);
      res.json({ success: true, data: { projects, skills, certificates, blogs, messages, unreadMessages, totalVisitors, totalPageViews, recentAnalytics: analytics } });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

// ===== RESUME CONTROLLER =====
// exports.resumeController = {
//   upload: async (req, res) => {
//     try {
//       if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
//       await Resume.deleteMany({});
//       const resume = await Resume.create({
//         filename: req.file.filename,
//         originalName: req.file.originalname,
//         path: `/uploads/resumes/${req.file.filename}`
//       });
//       res.json({ success: true, data: resume, message: 'Resume uploaded successfully' });
//     } catch (error) {
//       res.status(500).json({ success: false, message: error.message });
//     }
//   },
//   get: async (req, res) => {
//     try {
//       const resume = await Resume.findOne().sort({ createdAt: -1 });
//       res.json({ success: true, data: resume });
//     } catch (error) {
//       res.status(500).json({ success: false, message: error.message });
//     }
//   },
//   download: async (req, res) => {
//     try {
//       const resume = await Resume.findOne().sort({ createdAt: -1 });
//       if (!resume) return res.status(404).json({ success: false, message: 'No resume found' });
//       const filePath = path.join(__dirname, '../uploads/resumes', resume.filename);
//       if (!fs.existsSync(filePath)) return res.status(404).json({ success: false, message: 'File not found' });
//       res.download(filePath, resume.originalName);
//     } catch (error) {
//       res.status(500).json({ success: false, message: error.message });
//     }
//   },
//   delete: async (req, res) => {
//     try {
//       await Resume.deleteMany({});
//       res.json({ success: true, message: 'Resume deleted' });
//     } catch (error) {
//       res.status(500).json({ success: false, message: error.message });
//     }
//   }
// };


exports.resumeController = {
  upload: async (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
      await Resume.deleteMany({});
      const resume = await Resume.create({
        filename: req.file.filename || req.file.public_id,
        originalName: req.file.originalname,
        path: req.file.path || req.file.secure_url, // Cloudinary returns secure_url
      });
      res.json({ success: true, data: resume, message: 'Resume uploaded successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  get: async (req, res) => {
    try {
      const resume = await Resume.findOne().sort({ createdAt: -1 });
      res.json({ success: true, data: resume });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  download: async (req, res) => {
    try {
      const resume = await Resume.findOne().sort({ createdAt: -1 });
      if (!resume) return res.status(404).json({ success: false, message: 'No resume found' });
      // Redirect to Cloudinary URL
      res.redirect(resume.path);
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  delete: async (req, res) => {
    try {
      await Resume.deleteMany({});
      res.json({ success: true, message: 'Resume deleted' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

// ===== PROFILE CONTROLLER =====
// exports.profileController = {
//   get: async (req, res) => {
//     try {
//       let profile = await Profile.findOne();
//       if (!profile) profile = await Profile.create({});
//       res.json({ success: true, data: profile });
//     } catch (error) {
//       res.status(500).json({ success: false, message: error.message });
//     }
//   },
//   update: async (req, res) => {
//     try {
//       const data = { ...req.body };
//       if (req.file) data.profileImage = `/uploads/profile/${req.file.filename}`;
//       if (data.typingTexts && typeof data.typingTexts === 'string') data.typingTexts = data.typingTexts.split(',').map(t => t.trim());
//       let profile = await Profile.findOne();
//       if (!profile) profile = await Profile.create(data);
//       else { Object.assign(profile, data); await profile.save(); }
//       res.json({ success: true, data: profile, message: 'Profile updated' });
//     } catch (error) {
//       res.status(400).json({ success: false, message: error.message });
//     }
//   }
// };


exports.profileController = {
  get: async (req, res) => {
    try {
      let profile = await Profile.findOne();
      if (!profile) profile = await Profile.create({});
      res.json({ success: true, data: profile });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  update: async (req, res) => {
    try {
      const data = { ...req.body };
      // Cloudinary returns secure_url
      if (req.file) data.profileImage = req.file.path || req.file.secure_url;
      if (data.typingTexts && typeof data.typingTexts === 'string') {
        data.typingTexts = data.typingTexts.split(',').map(t => t.trim());
      }
      let profile = await Profile.findOne();
      if (!profile) profile = await Profile.create(data);
      else { Object.assign(profile, data); await profile.save(); }
      res.json({ success: true, data: profile, message: 'Profile updated' });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
};
 

// ===== GITHUB CONTROLLER =====
exports.githubController = {
  getRepos: async (req, res) => {
    try {
      const username = process.env.GITHUB_USERNAME || 'Harshini-BS';
      const headers = { 'Accept': 'application/vnd.github.v3+json' };
      if (process.env.GITHUB_TOKEN) headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
      const https = require('https');
      const options = {
        hostname: 'api.github.com',
        path: `/users/${username}/repos?sort=updated&per_page=20`,
        method: 'GET',
        headers: { ...headers, 'User-Agent': 'Portfolio-App' }
      };
      const apiReq = https.request(options, (apiRes) => {
        let data = '';
        apiRes.on('data', chunk => data += chunk);
        apiRes.on('end', () => {
          try {
            const repos = JSON.parse(data);
            const filtered = Array.isArray(repos) ? repos.filter(r => !r.fork).map(r => ({
              id: r.id, name: r.name, description: r.description, url: r.html_url,
              stars: r.stargazers_count, forks: r.forks_count, language: r.language,
              topics: r.topics, updatedAt: r.updated_at
            })) : [];
            res.json({ success: true, data: filtered });
          } catch (e) {
            res.status(500).json({ success: false, message: 'Failed to parse GitHub data' });
          }
        });
      });
      apiReq.on('error', () => res.status(500).json({ success: false, message: 'GitHub API error' }));
      apiReq.end();
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};


