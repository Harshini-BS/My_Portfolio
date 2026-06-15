const express = require('express');
const router = express.Router();
const { githubController } = require('../controller/controllers');
router.get('/repos', githubController.getRepos);
module.exports = router;