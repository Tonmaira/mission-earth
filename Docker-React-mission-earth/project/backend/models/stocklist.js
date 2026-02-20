const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConn").sequelize;

const STOCK_LIST = sequelize.define('STOCK_LIST', {
  StockCode: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true
  },
  // LocalName: DataTypes.STRING,
  Name: DataTypes.STRING,
  SKMasterFixSalesPriceType: DataTypes.TINYINT,
  UnitPrice1: DataTypes.FLOAT,
  // Add other fields here
}, {
  tableName: 'STOCK_LIST',
  timestamps: false
});


module.exports = STOCK_LIST;