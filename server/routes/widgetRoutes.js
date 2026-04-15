const express = require('express');
const router = express.Router();
const widgetController = require('../controllers/widgetController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', widgetController.createWidget);
router.put('/:id', widgetController.updateWidget);
router.delete('/:id', widgetController.deleteWidget);

module.exports = router;
