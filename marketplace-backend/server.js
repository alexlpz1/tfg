// server.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import multer from 'multer';
import { fileURLToPath } from 'url';

import authRoutes    from './routes/auth.js';
import productRoutes from './routes/products.js';
import commentRoutes from './routes/comments.js';
import cartRoutes    from './routes/cart.js';
import orderRoutes   from './routes/orders.js';

dotenv.config();

const app = express();

// ————————————————
// 1) Conexión a MongoDB
// ————————————————
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB conectado'))
.catch(err => {
  console.error('Error conectando a MongoDB:', err);
  process.exit(1);
});

// ————————————————
// 2) Middlewares
// ————————————————
// JSON
app.use(express.json());

// CORS: permite localhost y tus dominios en Netlify
const whitelist = [
  'http://localhost:5173',
  'https://verdant-alpaca-650339.netlify.app',
  'https://comforting-melba-633f57.netlify.app'
];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || whitelist.includes(origin)) {
      return callback(null, true);
    }
    callback(new Error(`CORS: origen ${origin} no permitido`));
  }
}));

// ————————————————
// 3) Carpeta __dirname para ESModules
// ————————————————
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ————————————————
// 4) Servir estático /uploads
// ————————————————
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ————————————————
// 5) Configuración de Multer
// ————————————————
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  // carpeta donde se guardan los ficheros
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, name + ext);
  }
});
const upload = multer({ storage });


app.post('/api/upload', upload.single('file'), (req, res) => {
  const host = process.env.API_URL || `${req.protocol}://${req.get('host')}`;
  res.json({ url: `${host}/uploads/${req.file.filename}` });
});



app.use('/api/auth',     authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/cart',     cartRoutes);
app.use('/api/orders',   orderRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor en puerto ${PORT}`);
});
