const express = require('express');
const router = express.Router();
const createCRUD = require('../controller/crudcontroller');
const { Certificate } = require('../models/index');
const { protect } = require('../middleware/auth');
const { uploadImage } = require('../middleware/upload');
const crud = createCRUD(Certificate);
router.get('/', crud.getAll);
router.get('/:id', crud.getOne);
router.post('/', protect, uploadImage.single('image'), async (req, res) => {
  if (req.file) req.body.image = `/uploads/images/${req.file.filename}`;
  return crud.create(req, res);
});
router.put('/:id', protect, uploadImage.single('image'), async (req, res) => {
  if (req.file) req.body.image = `/uploads/images/${req.file.filename}`;
  return crud.update(req, res);
});
router.delete('/:id', protect, crud.delete);
module.exports = router;