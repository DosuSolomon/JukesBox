import express from 'express';
import { User } from '../models/index.js';

const router = express.Router();

// Mock user for development (in production, this would validate against a real auth system)
const MOCK_USER = {
  id: '00000000-0000-0000-0000-000000000001',
  email: 'artist@jukesbox.com',
  name: 'Demo Artist',
  role: 'artist'
};

// Login route (mock)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // In development, accept any login
    // In production, validate credentials
    let user = await User.findOne({ where: { email } });
    
    if (!user && process.env.NODE_ENV !== 'production') {
      // Create user if doesn't exist in development
      user = await User.create({
        email,
        name: email.split('@')[0],
        password, // In production, hash this!
        role: 'artist'
      });
    }
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Update last login
    user.lastLogin = new Date();
    await user.save();
    
    // Return mock token and user info
    res.json({
      token: `mock_token_${Date.now()}`,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get current user
router.get('/me', async (req, res) => {
  try {
    // Check for mock token or Authorization header
    const authHeader = req.headers.authorization;
    
    // Return mock user for development
    if (process.env.NODE_ENV !== 'production' || authHeader?.startsWith('Bearer mock_')) {
      return res.json({
        id: MOCK_USER.id,
        email: MOCK_USER.email,
        name: MOCK_USER.name,
        role: MOCK_USER.role,
        isAuthenticated: true
      });
    }
    
    // In production, validate the token and fetch user
    res.status(401).json({ error: 'Not authenticated' });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

// Register route
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    
    const user = await User.create({
      email,
      password, // In production, hash this!
      name,
      role: 'user'
    });
    
    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

export default router;
