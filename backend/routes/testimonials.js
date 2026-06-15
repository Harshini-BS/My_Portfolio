const express = require('express');
const router = express.Router();
const createCRUD = require('../controller/crudController');
const { Testimonial } = require('../models/index');
const { protect } = require('../middleware/auth');
const crud = createCRUD(Testimonial);
router.get('/', async (req, res) => {
  try {
    const items = await Testimonial.find({ approved: true }).sort({ order: 1 });
    res.json({ success: true, data: items });
  } catch(e) { res.status(500).json({ success: false, message: e.message }); }
});
router.get('/all', protect, crud.getAll);
router.post('/', crud.create);
router.put('/:id', protect, crud.update);
router.delete('/:id', protect, crud.delete);
module.exports = router;