import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Song = sequelize.define('Song', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  artist: {
    type: DataTypes.STRING,
    allowNull: false
  },
  album: {
    type: DataTypes.STRING,
    allowNull: true
  },
  genre: {
    type: DataTypes.STRING,
    allowNull: true
  },
  duration: {
    type: DataTypes.INTEGER, // Duration in seconds
    allowNull: true
  },
  coverUrl: {
    type: DataTypes.STRING,
    field: 'cover_url',
    allowNull: true
  },
  isAvailable: {
    type: DataTypes.BOOLEAN,
    field: 'is_available',
    defaultValue: true
  },
  playCount: {
    type: DataTypes.INTEGER,
    field: 'play_count',
    defaultValue: 0
  },
  createdBy: {
    type: DataTypes.UUID,
    field: 'created_by',
    allowNull: true
  }
}, {
  tableName: 'songs',
  timestamps: true,
  underscored: true
});

export default Song;
