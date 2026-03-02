import express from 'express';
import { Song, SongRequest } from '../models/index.js';

const router = express.Router();

// Helper to parse query params
const parseQueryParams = (query) => {
  const { sort, filter, ...rest } = query;
  
  let where = {};
  let order = [['createdAt', 'DESC']];
  
  // Parse filter - expects JSON string like: {"status":"pending"}
  if (filter) {
    try {
      const filterObj = JSON.parse(filter);
      where = { ...where, ...filterObj };
    } catch (e) {
      console.warn('Invalid filter JSON:', filter);
    }
  }
  
  // Parse sort - expects string like: "-created_date" or "title"
  if (sort) {
    const sortField = sort.replace(/^-/, '');
    const sortOrder = sort.startsWith('-') ? 'DESC' : 'ASC';
    // Map base44 field names to DB field names
    const fieldMap = {
      'created_date': 'createdAt',
      'play_count': 'playCount',
      'is_available': 'isAvailable',
      'song_id': 'songId',
      'requester_name': 'requesterName'
    };
    const dbField = fieldMap[sortField] || sortField;
    order = [[dbField, sortOrder]];
  }
  
  return { where, order, ...rest };
};

// ============ SONG ROUTES ============

// GET /api/entities/Song - List songs
router.get('/Song', async (req, res) => {
  try {
    const { where, order } = parseQueryParams(req.query);
    const songs = await Song.findAll({ where, order });
    res.json(songs);
  } catch (error) {
    console.error('Error listing songs:', error);
    res.status(500).json({ error: 'Failed to list songs' });
  }
});

// GET /api/entities/Song/:id - Get single song
router.get('/Song/:id', async (req, res) => {
  try {
    const song = await Song.findByPk(req.params.id);
    if (!song) {
      return res.status(404).json({ error: 'Song not found' });
    }
    res.json(song);
  } catch (error) {
    console.error('Error getting song:', error);
    res.status(500).json({ error: 'Failed to get song' });
  }
});

// POST /api/entities/Song - Create song
router.post('/Song', async (req, res) => {
  try {
    const song = await Song.create(req.body);
    res.status(201).json(song);
  } catch (error) {
    console.error('Error creating song:', error);
    res.status(500).json({ error: 'Failed to create song' });
  }
});

// PUT /api/entities/Song/:id - Update song
router.put('/Song/:id', async (req, res) => {
  try {
    const song = await Song.findByPk(req.params.id);
    if (!song) {
      return res.status(404).json({ error: 'Song not found' });
    }
    await song.update(req.body);
    res.json(song);
  } catch (error) {
    console.error('Error updating song:', error);
    res.status(500).json({ error: 'Failed to update song' });
  }
});

// DELETE /api/entities/Song/:id - Delete song
router.delete('/Song/:id', async (req, res) => {
  try {
    const song = await Song.findByPk(req.params.id);
    if (!song) {
      return res.status(404).json({ error: 'Song not found' });
    }
    await song.destroy();
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting song:', error);
    res.status(500).json({ error: 'Failed to delete song' });
  }
});

// ============ SONG REQUEST ROUTES ============

// GET /api/entities/SongRequest - List requests
router.get('/SongRequest', async (req, res) => {
  try {
    const { where, order } = parseQueryParams(req.query);
    const requests = await SongRequest.findAll({ where, order });
    res.json(requests);
  } catch (error) {
    console.error('Error listing requests:', error);
    res.status(500).json({ error: 'Failed to list requests' });
  }
});

// GET /api/entities/SongRequest/:id - Get single request
router.get('/SongRequest/:id', async (req, res) => {
  try {
    const request = await SongRequest.findByPk(req.params.id);
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }
    res.json(request);
  } catch (error) {
    console.error('Error getting request:', error);
    res.status(500).json({ error: 'Failed to get request' });
  }
});

// POST /api/entities/SongRequest - Create request
router.post('/SongRequest', async (req, res) => {
  try {
    const songRequest = await SongRequest.create(req.body);
    res.status(201).json(songRequest);
  } catch (error) {
    console.error('Error creating request:', error);
    res.status(500).json({ error: 'Failed to create request' });
  }
});

// PUT /api/entities/SongRequest/:id - Update request
router.put('/SongRequest/:id', async (req, res) => {
  try {
    const songRequest = await SongRequest.findByPk(req.params.id);
    if (!songRequest) {
      return res.status(404).json({ error: 'Request not found' });
    }
    await songRequest.update(req.body);
    res.json(songRequest);
  } catch (error) {
    console.error('Error updating request:', error);
    res.status(500).json({ error: 'Failed to update request' });
  }
});

// DELETE /api/entities/SongRequest/:id - Delete request
router.delete('/SongRequest/:id', async (req, res) => {
  try {
    const songRequest = await SongRequest.findByPk(req.params.id);
    if (!songRequest) {
      return res.status(404).json({ error: 'Request not found' });
    }
    await songRequest.destroy();
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting request:', error);
    res.status(500).json({ error: 'Failed to delete request' });
  }
});

export default router;
