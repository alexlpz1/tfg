// server.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import { fileURLToPath } from 'url';

import authRoutes    from './routes/auth.js';
import productRoutes from './routes/products.js';
import commentRoutes from './routes/comments.js';
import cartRoutes    from './routes/cart.js';
import orderRoutes   from './routes/orders.js';

dotenv.config();
const app = express();

// ==== 0) Obtener __dirname en ES-Modules ====
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// ==== 1) Asegurarnos de que existe uploads/ ====
const UPLOAD_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  console.log('➡️  Directorio uploads/ creado en', UPLOAD_DIR);
}

// ==== 2) Conexión a MongoDB ====
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB conectado'))
.catch(err => {
  console.error('❌ Error conectando a MongoDB:', err);
  process.exit(1);
});

// ==== 3) Middlewares ====
app.use(express.json());

// 3.a) CORS — permitimos localhost y tus dominios de Netlify/Render
// …
const WHITELIST = [
  'http://localhost:5173',
  'https://verdant-alpaca-650339.netlify.app',
  'https://comforting-melba-633f57.netlify.app',
  'https://marketplacelpz.netlify.app'    // ← Añade aquí tu nuevo dominio
];

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || WHITELIST.includes(origin)) return cb(null, true);
    cb(new Error(`CORS: origen ${origin} no permitido`));
  }
}));


// ==== 4) Servir estáticos desde /api/uploads ====
app.use('/api/uploads', express.static(UPLOAD_DIR));

// ==== 5) Configurar Multer para subir archivos ====
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
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'Sólo se permiten imágenes'));
    }
    cb(null, true);
  }
});

// ==== 6) Ruta para subir la imagen ====
app.post('/api/upload', (req, res) => {
  upload.single('file')(req, res, err => {
    if (err) {
      console.error('❌ Error en multer/upload:', err);
      const status = err instanceof multer.MulterError ? 400 : 500;
      return res
        .status(status)
        .json({ message: err.message, code: err.code });
    }
    if (!req.file) {
      console.warn('⚠️ multer no devolvió req.file');
      return res.status(400).json({ message: 'No se subió ningún fichero' });
    }

    // Construimos la URL pública apuntando a /api/uploads
    const host     = process.env.API_URL || `${req.protocol}://${req.get('host')}`;
    const fileUrl  = `${host}/api/uploads/${req.file.filename}`;

    console.log('✅ Imagen subida:', fileUrl);
    res.json({ url: fileUrl });
  });
});

// ==== 7) Resto de rutas de tu API ====
app.use('/api/auth',     authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/cart',     cartRoutes);
app.use('/api/orders',   orderRoutes);

// ==== 8) Middleware global de errores ====
app.use((err, req, res, next) => {
  console.error('💥 Error inesperado:', err);
  const status = err.status || 500;
  res.status(status).json({ message: err.message });
});

// ==== 9) Arrancar servidor ====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor en puerto ${PORT}`));
