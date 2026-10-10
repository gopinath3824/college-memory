const express = require('express');
const router  = express.Router();
const multer  = require('multer');
const { uploadMemory, getMemories, likeMemory } = require('../controllers/memoryController');

// Use diskStorage to save images locally
const path = require('path');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload  = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed.'), false);
    }
    cb(null, true);
  }
});

router.post('/upload-memory', upload.single('photo'), uploadMemory);
router.get('/memories',        getMemories);
router.post('/like-memory',    likeMemory);

module.exports = router;
