const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConn").sequelize;


const Formula = sequelize.define('Formula', {
  Id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  FormulaName: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  FormulaList: {
    type: DataTypes.TEXT,  // nvarchar(max) is fine
    allowNull: false,
  },
  Remark: {
    type: DataTypes.TEXT, // NVARCHAR(MAX) → TEXT
    allowNull: true,
  },
  CreatedBy: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  DeleteAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'Formula',
  timestamps: false,
});

module.exports = Formula;
