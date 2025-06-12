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

// Ajusta CORS para permitir tu front desplegado y localhost durante desarrollo
app.use(cors({
  origin: [
    process.env.FRONTEND_URL,           
    'http://localhost:5173'             
  ]
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
