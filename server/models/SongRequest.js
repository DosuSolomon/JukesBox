import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const SongRequest = sequelize.define('SongRequest', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  songId: {
    type: DataTypes.UUID,
    field: 'song_id',
    allowNull: false
  },
  songTitle: {
    type: DataTypes.STRING,
    field: 'song_title',
    allowNull: false
  },
  requesterName: {
    type: DataTypes.STRING,
    field: 'requester_name',
    allowNull: false
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'playing', 'completed', 'rejected'),
    defaultValue: 'pending'
  },
  priority: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  playedAt: {
    type: DataTypes.DATE,
    field: 'played_at',
    allowNull: true
  }
}, {
  tableName: 'song_requests',
  timestamps: true,
  underscored: true
});

export default SongRequest;
