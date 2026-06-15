const express = require('express');
const router = express.Router();
const { messageController } = require('../controller/controllers');
const { protect } = require('../middleware/auth');
router.post('/', messageController.create);
router.get('/', protect, messageController.getAll);
router.put('/:id/read', protect, messageController.markRead);
router.delete('/:id', protect, messageController.delete);
module.exports = router;