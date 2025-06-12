// server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db.js';

// Importa aquí todas tus rutas
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import commentRoutes from './routes/comments.js';
import cartRoutes from './routes/cart.js';
import orderRoutes from './routes/orders.js';

dotenv.config();
connectDB();

const app = express();

const whitelist = [
  'http://localhost:5173',                       // para dev
  'https://comforting-melba-633f57.netlify.app', // tu Netlify
  'https://verdant-alpaca-650339.netlify.app'    // (otros deploys que uses)
];

app.use(cors({
  origin: (origin, callback) => {
    // permitir solicitudes sin origin (p.ej: Postman)
    if (!origin) return callback(null, true);
    if (whitelist.includes(origin)) {
      return callback(null, true);
    }
    callback(new Error(`Origin ${origin} not allowed by CORS`));
  }
}));

app.use(express.json());

// Monta las rutas
app.use('/api/auth',    authRoutes);
app.use('/api/products',productRoutes);
app.use('/api/comments',commentRoutes);
app.use('/api/cart',    cartRoutes);
app.use('/api/orders',  orderRoutes);

app.get('/', (req, res) => res.send('API del Marketplace funcionando'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
