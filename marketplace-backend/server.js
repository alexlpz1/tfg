import express   from 'express';
import dotenv    from 'dotenv';
import cors      from 'cors';
import { connectDB } from './config/db.js';

import authRoutes    from './routes/auth.js';
import productRoutes from './routes/products.js';
import commentRoutes from './routes/comments.js';
import cartRoutes    from './routes/cart.js';
import orderRoutes   from './routes/orders.js';

dotenv.config();
connectDB();

const app = express();

// CORS: permite tu frontend
const FRONTEND = process.env.FRONTEND_URL || 'http://localhost:5173';
app.use(cors({
  origin: FRONTEND,
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: true
}));
app.options('*', cors());

app.use(express.json());

// Monta las rutas
app.use('/api/auth',     authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/cart',     cartRoutes);
app.use('/api/orders',   orderRoutes);

app.get('/', (req, res) => res.send('API del Marketplace funcionando'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
