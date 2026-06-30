import multer from 'multer';
import path from 'path';
import Database from '../Models/file_db.js';
import crypto from 'crypto';

// disk_storage

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./docs");
  },

  filename: (req, file, cb) => {
    crypto.randomBytes(16, (err, name) => {
      if (err) return cb(err);

      const fn =
        name.toString("hex") +
        path.extname(file.originalname);

      cb(null, fn);
    });
  }
});

const upload = multer({
  storage: fileStorage,
});

export default upload;