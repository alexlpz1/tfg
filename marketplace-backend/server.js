// server.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import os from 'os';
import fs from 'fs';
import multer from 'multer';

import authRoutes    from './routes/auth.js';
import productRoutes from './routes/products.js';
import commentRoutes from './routes/comments.js';
import cartRoutes    from './routes/cart.js';
import orderRoutes   from './routes/orders.js';

dotenv.config();
const app = express();

// — 1) Elegir carpeta de uploads según entorno
const isProd = process.env.NODE_ENV === 'production';
const UPLOAD_DIR = isProd
  ? path.join(os.tmpdir(), 'uploads')          // En Render: /tmp/uploads
  : path.join(path.resolve(), 'uploads');       // En local: ./uploads

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  console.log(`➡️ Directorio de uploads creado en ${UPLOAD_DIR}`);
} else {
  console.log(`ℹ️ Directorio de uploads existente en ${UPLOAD_DIR}`);
}

// — 2) Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB conectado'))
.catch(err => {
  console.error('❌ Error conectando a MongoDB:', err);
  process.exit(1);
});

// — 3) Middlewares
app.use(express.json());

const WHITELIST = [
  'http://localhost:5173',
  'https://verdant-alpaca-650339.netlify.app',
  'https://comforting-melba-633f57.netlify.app'
];
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || WHITELIST.includes(origin)) return cb(null, true);
    cb(new Error(`CORS: origen ${origin} no permitido`));
  }
}));

// — 4) Servir estáticos de uploads
app.use('/uploads', express.static(UPLOAD_DIR));

// — 5) Configurar Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename:    (req, file, cb) => {
    const ext  = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext)
                   .toLowerCase()
                   .replace(/[^a-z0-9]/g, '-');
    cb(null, `${name}-${Date.now()}${ext}`);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'Solo imágenes'));
    }
    cb(null, true);
  }
});

// — 6) Ruta de subida
app.post('/api/upload', (req, res) => {
  upload.single('file')(req, res, err => {
    if (err) {
      // Esto te mostrará en los logs el error completo de Multer o de tu filtro
      console.error('❌ Error en multer/upload:', err);
      const status = err instanceof multer.MulterError ? 400 : 500;
      return res
        .status(status)
        .json({ message: err.message, code: err.code, stack: err.stack });
    }

    // Si no hay archivo subido
    if (!req.file) {
      console.warn('⚠️ upload.single no devolvió req.file');
      return res.status(400).json({ message: 'No se subió ningún fichero' });
    }

    // Todo OK: construimos la URL
    const protocol = req.get('X-Forwarded-Proto') || req.protocol;
    const host     = process.env.API_URL || `${protocol}://${req.get('host')}`;
    const url      = `${host}/uploads/${req.file.filename}`;

    console.log('✅ Imagen subida correctamente:', url);
    res.json({ url });
  });

// — 7) Resto de rutas
app.use('/api/auth',     authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/cart',     cartRoutes);
app.use('/api/orders',   orderRoutes);

// — 8) Captura cualquier error (incluidos MulterError)
app.use((err, req, res, next) => {
  console.error('💥 Error capturado por middleware:', err);
  const status = err instanceof multer.MulterError ? 400 : (err.status || 500);
  res.status(status).json({ message: err.message });
});

// — 9) Arrancar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor arrancado en puerto ${PORT}`));
