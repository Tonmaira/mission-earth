const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConn").sequelize;

const Staff = sequelize.define('Staffs', {
    Id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      UserId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
      },
      Name: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      Dept: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      UserType: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      Role: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      Password: {
        type: DataTypes.STRING(255),
        allowNull: false
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
    tableName: 'Staffs',
    timestamps: false // Because you only have CreateAt
  });

module.exports = Staff;