const multer = require('multer');

const storage = multer.memoryStorage(); // Store the file in memory buffer

const upload = multer({ storage: storage , limits: { fileSize: 500 * 1024 }});

module.exports = upload;
