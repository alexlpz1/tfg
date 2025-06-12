// server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db.js';

dotenv.config();
connectDB();

const app = express();

// Lista de orígenes permitidos
const whitelist = [
  'http://localhost:5173',
  'https://verdant-alpaca-650339.netlify.app'
];

app.use(cors({
  origin: (origin, callback) => {
    // permitir peticiones sin origin (p.ej. Postman) o si está en la whitelist
    if (!origin || whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Origen ${origin} no permitido por CORS`));
    }
  },
  methods: ['GET','POST','PUT','DELETE','OPTIONS']
}));

app.use(express.json());

// rutas...
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
// …

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
