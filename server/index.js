import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sequelize } from './config/database.js';
import authRoutes from './routes/auth.js';
import entityRoutes from './routes/entities.js';
import logRoutes from './routes/logs.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration - allow frontend domain
const corsOptions = {
  origin: [
    'https://temitopeserentainer.onrender.com',
    'https://temitopeserentainer.base44.app',
    'https://jukesbox.onrender.com',
    'https://jukesbox.base44.app',
    'http://localhost:5173',
    'http://localhost:3000'
  ],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/entities', entityRoutes);
app.use('/api/logs', logRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Sync database and start server
async function startServer() {
  try {
    // Sync models (use { force: true } to reset tables)
    await sequelize.sync({ alter: true });
    console.log('Database synchronized successfully');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Export for Vercel
export default app;

// Start server if not in serverless environment
if (process.env.VERCEL !== 'true') {
  startServer();
}
