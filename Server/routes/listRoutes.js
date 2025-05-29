const express = require('express');
const router = express.Router();
const { createItem, getItems, updateItem, deleteItem } = require('../controllers/listController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected with auth middleware
router.use(protect);

router.post('/', createItem);
router.get('/', getItems);
router.put('/:id', updateItem);
router.delete('/:id', deleteItem);

module.exports = router; 