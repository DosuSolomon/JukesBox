import { sequelize } from '../config/database.js';
import User from './User.js';
import Song from './Song.js';
import SongRequest from './SongRequest.js';
import AppLog from './AppLog.js';

// Define associations
User.hasMany(Song, { foreignKey: 'createdBy', as: 'songs' });
Song.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

Song.hasMany(SongRequest, { foreignKey: 'songId', as: 'requests' });
SongRequest.belongsTo(Song, { foreignKey: 'songId', as: 'song' });

User.hasMany(SongRequest, { foreignKey: 'requesterId', as: 'requests' });
SongRequest.belongsTo(User, { foreignKey: 'requesterId', as: 'requester' });

export {
  sequelize,
  User,
  Song,
  SongRequest,
  AppLog
};
