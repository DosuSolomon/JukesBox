import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const AppLog = sequelize.define('AppLog', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    field: 'user_id',
    allowNull: true
  },
  action: {
    type: DataTypes.STRING,
    allowNull: false
  },
  entityType: {
    type: DataTypes.STRING,
    field: 'entity_type',
    allowNull: true
  },
  entityId: {
    type: DataTypes.UUID,
    field: 'entity_id',
    allowNull: true
  },
  metadata: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: {}
  },
  ipAddress: {
    type: DataTypes.STRING,
    field: 'ip_address',
    allowNull: true
  },
  userAgent: {
    type: DataTypes.STRING,
    field: 'user_agent',
    allowNull: true
  }
}, {
  tableName: 'app_logs',
  timestamps: true,
  underscored: true
});

export default AppLog;
