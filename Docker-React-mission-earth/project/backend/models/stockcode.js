const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConn").sequelize;

const StockCode = sequelize.define(
  "StockCode",
  {
    Id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Code: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true, // important
    },
    EnglishName: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    ThaiName: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    Type: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    Activity: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    OPDPrice: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    IPDPrice: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    InterPrice: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "StockCode",
    schema: "dbo",
    timestamps: false,
  }
);

module.exports = StockCode;
