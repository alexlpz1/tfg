// src/middleware/upload.js
import multer from 'multer';
import path from 'path';

// Carpeta donde guardarás las imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  }
});

// Filtro para solo imágenes
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) cb(null, true);
  else cb(new Error('Solo imágenes'), false);
};

export const upload = multer({ storage, fileFilter, limits: { fileSize: 5_000_000 } });
