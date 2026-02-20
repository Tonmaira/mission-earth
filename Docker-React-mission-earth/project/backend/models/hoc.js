const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConn").sequelize;


const HOC = sequelize.define('HOC', {
  Id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  Status: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 1,
  },
  HN: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  VN: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  FullName: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  // insuranceType: {
  //   type: DataTypes.STRING(100),
  //   allowNull: true,
  // },
  // insuranceCompany: {
  //   type: DataTypes.STRING(100),
  //   allowNull: true,
  // },
  // ContractParty: {
  //   type: DataTypes.STRING(100),
  //   allowNull: true,
  // },
  Dept: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  FormData: {
    type: DataTypes.TEXT,  // nvarchar(max) is fine
    allowNull: false,
  },
  // RightList: {
  //   type: DataTypes.TEXT, // NVARCHAR(MAX) → TEXT
  //   allowNull: true,
  // },
  CreateAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  AcceptAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  VerifyAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  UpdateAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  DeleteAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  CreatedBy: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  UserType: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  Remark: {
    type: DataTypes.TEXT, // NVARCHAR(MAX) → TEXT
    allowNull: true,
  },
}, {
  tableName: 'HOC',
  timestamps: false,
});

// Associations (use this outside when models are being initialized)
HOC.associate = (models) => {
  HOC.belongsTo(models.Departments, { foreignKey: 'Dept', as: 'Department' });
  HOC.belongsTo(models.Staffs, { foreignKey: 'CreatedBy', targetKey: 'UserId', as: 'Staff' });
};

module.exports = HOC;
