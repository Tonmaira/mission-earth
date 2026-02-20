const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConn").sequelize;


const Eventlog = sequelize.define('Eventlog', {
  Id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  RowId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  Action: {
    type: DataTypes.TEXT,  // nvarchar(max) is fine
    allowNull: false,
  },
  Remark: {
    type: DataTypes.TEXT, // NVARCHAR(MAX) → TEXT
    allowNull: true,
  },
  CreateAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  CreatedBy: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
}, {
  tableName: 'Eventlog',
  timestamps: false,
});

Eventlog.associate = (models) => {
  // Eventlog.belongsTo(models.RightVerify, { foreignKey: 'RowId', targetKey: 'Id', as: 'RowIdd' });
  Eventlog.belongsTo(models.Staffs, { foreignKey: 'CreatedBy', targetKey: 'UserId', as: 'Staff' });
};

// Associations (use this outside when models are being initialized)
// Eventlog.associate = (models) => {
//   Eventlog.belongsTo(models.Departments, { foreignKey: 'Dept', as: 'Department' });
// };

module.exports = Eventlog;
