// server.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes.js';        // ajusta la ruta si la tienes distinta
import productRoutes from './routes/productRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
// … importa el resto de tus rutas (orders, users, etc.)

dotenv.config();

const app = express();

// 1) Conexión a MongoDB
const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB conectado'))
.catch(err => {
  console.error('Error conectando a MongoDB:', err);
  process.exit(1);
});

// 2) Middlewares
app.use(express.json());

// 2.a) CORS — permite tu front en Netlify y localhost
const whitelist = [
  'https://verdant-alpaca-650339.netlify.app',
  'https://comforting-melba-633f57.netlify.app',
  'http://localhost:5173'
];
app.use(cors({
  origin: (origin, callback) => {
    // si no hay origin (herramientas como Postman), permitir
    if (!origin) return callback(null, true);
    if (whitelist.includes(origin)) {
      return callback(null, true);
    }
    callback(new Error(`CORS: origen ${origin} no permitido`));
  }
}));

// 3) Rutas
app.use('/api/auth',    authRoutes);
app.use('/api/products',productRoutes);
app.use('/api/comments',commentRoutes);
app.use('/api/cart',    cartRoutes);
app.use('/api/orders',  orderRoutes);

// 4) Arrancar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor en puerto ${PORT}`);
});
