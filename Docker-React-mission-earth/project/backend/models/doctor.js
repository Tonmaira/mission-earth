const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConn").sequelize;

const DOC_MASTER = sequelize.define('DOC_MASTER', {
  Doctor: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true
  },
  LocalName: DataTypes.STRING,
  EnglishName: DataTypes.STRING,
  // Add other fields here
}, {
  tableName: 'DOC_MASTER',
  timestamps: false
});


module.exports = DOC_MASTER;