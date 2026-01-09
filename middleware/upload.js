const multer = require("multer");
const path = require("path");

// storage function

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");// uploads/ is relative path (Look in the current folder, not in root direc)
  },
  // error first fn. where 1st arg is for error, set to null in case of no error 
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));// path.extname extracts the original file's extension
  }
});
// cb is a error-first callback fn. where its first arg will be passes the err. hence error is handled before proceeding to rest of func. a similar approach of try-catch used in node  



// file filter function(only images allowed)

const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/jpg", "image/png"];

  if (allowed.includes(file.mimetype)) {
    cb(null, true);// no error and file is accept (error, acceptBoolean)
  } else {
    cb(new Error("Only JPG, JPEG, PNG are allowed"), false);
  }
};


module.exports = multer({ storage, fileFilter });
