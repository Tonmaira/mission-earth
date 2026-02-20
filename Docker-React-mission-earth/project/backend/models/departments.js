const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConn").sequelize;

const Departments = sequelize.define('Departments', {
    Id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    ShortName: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    FullName: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    Name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    CreateAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    UpdateAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      onUpdate: DataTypes.NOW
    },
    DeleteAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
}, {
    tableName: 'Departments',
    timestamps: false // Because you only have CreateAt
  });

module.exports = Departments;