// Main file for multer config
const multer = require("multer");

const storage = multer.memoryStorage(); // keeps files in memory

// Accept only PDF and JPG
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["application/pdf", "image/jpeg"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // accept file
  } else {
    cb(new Error("Only PDF and JPG files are allowed"), false); // reject file
  }
};

const upload = multer({ storage: storage, fileFilter });

module.exports = { upload };
