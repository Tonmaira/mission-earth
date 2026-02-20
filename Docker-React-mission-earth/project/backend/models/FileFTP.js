const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConn").sequelize;

const FileFTP = sequelize.define('FileFTP', {
  Id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  OrderIdd: {
    type: DataTypes.TEXT, // This is actually a foreign key to Department Id
    allowNull: false
  },
  Idd: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  FileName: {
    type: DataTypes.TEXT, // This is actually a foreign key to Department Id
    allowNull: true
  },
  Date: {
    type: DataTypes.STRING(8),
    allowNull: true
  },
  CreateAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  UpdateAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  DeleteAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
}, {
  tableName: 'FileFTP',
  timestamps: false
});

// Associations (use this outside when models are being initialized)
// FileFTP.associate = (models) => {
//   FileFTP.belongsTo(models.RightVerify, { foreignKey: 'Idd', as: 'RightId' });
// };

module.exports = FileFTP;
