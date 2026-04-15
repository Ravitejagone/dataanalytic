const express = require('express');
const router = express.Router();
const datasetController = require('../controllers/datasetController');
const { protect } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

router.use(protect);

router.post('/upload', upload.single('file'), datasetController.uploadDataset);
router.get('/', datasetController.getAllDatasets);
router.get('/:id', datasetController.getDatasetById);
router.delete('/:id', datasetController.deleteDataset);

module.exports = router;
