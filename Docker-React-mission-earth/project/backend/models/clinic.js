const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConn").sequelize;

const QUEUE_CLINIC_NAME = sequelize.define('QUEUE_CLINIC_NAME', {
    ClinicCode: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true
  },
  ClinicNameThai: DataTypes.STRING,
  ClinicNameEng: DataTypes.STRING,
  // Add other fields here
}, {
  tableName: 'QUEUE_CLINIC_NAME',
  timestamps: false
});


module.exports = QUEUE_CLINIC_NAME;