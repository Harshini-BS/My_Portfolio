const express = require('express');
const router = express.Router();
const { profileController } = require('../controller/controllers');
const { protect } = require('../middleware/auth');
const { uploadProfileImage } = require('../middleware/upload');
router.get('/', profileController.get);
router.put('/', protect, uploadProfileImage.single('profileImage'), profileController.update);
module.exports = router;