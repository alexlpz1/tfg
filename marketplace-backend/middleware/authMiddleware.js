// src/middleware/auth.js
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token = null;
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }
  if (!token) {
    return res.status(401).json({ message: 'No token, autorización denegada' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // O bien cargas el usuario completo:
    // req.user = await User.findById(decoded.id).select('-password');
    // O solo guardas el id si no necesitas más datos:
    req.user = { _id: decoded.id };
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: 'Token no válido' });
  }
};
