// const express = require('express');
// const router = express.Router();
// const { resumeController } = require('../controller/controllers');
// const { protect } = require('../middleware/auth');
// const { uploadResume } = require('../middleware/upload');
// router.get('/', resumeController.get);
// router.get('/download', resumeController.download);
// router.post('/', protect, uploadResume.single('resume'), resumeController.upload);
// router.delete('/', protect, resumeController.delete);
// module.exports = router;


// Updated resume route for Cloudinary
// Replace your backend/routes/resume.js with this

const express = require('express');
const router = express.Router();
const { resumeController } = require('../controller/controllers');
const { protect } = require('../middleware/auth');
const { uploadResume } = require('../middleware/upload');

router.get('/', resumeController.get);
router.get('/download', resumeController.download);
router.post('/', protect, uploadResume.single('resume'), resumeController.upload);
router.delete('/', protect, resumeController.delete);

module.exports = router;