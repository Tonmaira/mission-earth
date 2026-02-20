const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConn").sequelize;


const Medlog = sequelize.define('medlog', {
  Id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  AN: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  CreateAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'medlog',
  timestamps: false,
});

module.exports = Medlog;
