import express from 'express';
import { AppLog } from '../models/index.js';

const router = express.Router();

// POST /api/logs/user-activity - Log user activity
router.post('/user-activity', async (req, res) => {
  try {
    const { userId, action, entityType, entityId, metadata } = req.body;
    
    const log = await AppLog.create({
      userId,
      action,
      entityType,
      entityId,
      metadata: metadata || {},
      ipAddress: req.ip || req.connection?.remoteAddress,
      userAgent: req.headers['user-agent']
    });
    
    res.status(201).json(log);
  } catch (error) {
    console.error('Error logging activity:', error);
    res.status(500).json({ error: 'Failed to log activity' });
  }
});

// GET /api/logs - Get logs (with optional filters)
router.get('/', async (req, res) => {
  try {
    const { userId, action, limit = 100 } = req.query;
    
    const where = {};
    if (userId) where.userId = userId;
    if (action) where.action = action;
    
    const logs = await AppLog.findAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit)
    });
    
    res.json(logs);
  } catch (error) {
    console.error('Error fetching logs:', error);
    res.status(500).json({ error: 'Failed to fetch logs' });
  }
});

export default router;
