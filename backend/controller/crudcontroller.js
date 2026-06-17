// Generic factory for CRUD operations
const createCRUD = (Model, populateFields = '') => ({
  getAll: async (req, res) => {
    try {
      const { search, category, page = 1, limit = 100 } = req.query;
      let query = {};
      if (search) query.$or = [{ title: /search/i }, { name: /search/i }, { description: /search/i }];
      if (category && category !== 'all') query.category = category;
      let q = Model.find(query).sort({ order: 1, createdAt: -1 });
      if (populateFields) q = q.populate(populateFields);
      const items = await q.exec();
      res.json({ success: true, data: items, count: items.length });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  getOne: async (req, res) => {
    try {
      let q = Model.findById(req.params.id);
      if (populateFields) q = q.populate(populateFields);
      const item = await q.exec();
      if (!item) return res.status(404).json({ success: false, message: 'Not found' });
      res.json({ success: true, data: item });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  create: async (req, res) => {
    try {
      const item = await Model.create(req.body);
      res.status(201).json({ success: true, data: item, message: 'Created successfully' });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const item = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!item) return res.status(404).json({ success: false, message: 'Not found' });
      res.json({ success: true, data: item, message: 'Updated successfully' });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  delete: async (req, res) => {
    try {
      const item = await Model.findByIdAndDelete(req.params.id);
      if (!item) return res.status(404).json({ success: false, message: 'Not found' });
      res.json({ success: true, message: 'Deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
});

module.exports = createCRUD;



