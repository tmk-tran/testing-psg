function fileFilter(req, file, cb) {
  const allowedTypes = ["application/pdf", "image/jpeg"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF and JPG files are allowed"));
  }
}

export default fileFilter;
