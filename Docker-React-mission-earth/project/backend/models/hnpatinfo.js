const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConn").sequelize;

const HN_PAT_INFO = sequelize.define('HN_PAT_INFO', {
  VisitDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  VN: {
    type: DataTypes.STRING(20),
    allowNull: true,
    primaryKey: true 
  },
  HN: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  RightCode: {
    type: DataTypes.STRING(6),
    allowNull: true
  },
  VisitCode: {
    type: DataTypes.STRING(4),
    allowNull: true
  },
  VisitCodeName: {
    type: DataTypes.STRING(1000),
    allowNull: true
  },
  BirthDateTime: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  IDcard: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  Passport: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  CardETC: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  NationalityCode: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  Gender: {
    type: DataTypes.STRING(1),
    allowNull: true
  },
  InitialName: {
    type: DataTypes.STRING(1000),
    allowNull: true
  },
  FirstName: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  LastName: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  PrescriptionNo: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  Doctor: {
    type: DataTypes.STRING(14),
    allowNull: true
  },
  Clinic: {
    type: DataTypes.STRING(8),
    allowNull: true
  },
  // --- Vitalsign fields ---
  // bmi: {
  //   type: DataTypes.DECIMAL(5,2),
  //   allowNull: true
  // },
  // HC: {
  //   type: DataTypes.DECIMAL(5,2),
  //   allowNull: true
  // },
  // Ht: {
  //   type: DataTypes.DECIMAL(5,2),
  //   allowNull: true
  // },
  // tc: {
  //   type: DataTypes.DECIMAL(5,2),
  //   allowNull: true
  // },
  // p: {
  //   type: DataTypes.DECIMAL(5,2),
  //   allowNull: true
  // },
  // r: {
  //   type: DataTypes.DECIMAL(5,2),
  //   allowNull: true
  // },
  // bps: {
  //   type: DataTypes.DECIMAL(5,2),
  //   allowNull: true
  // },
  // bpd: {
  //   type: DataTypes.DECIMAL(5,2),
  //   allowNull: true
  // },
  // o2sat: {
  //   type: DataTypes.DECIMAL(5,2),
  //   allowNull: true
  // },
  // ps: {
  //   type: DataTypes.DECIMAL(5,2),
  //   allowNull: true
  // }
}, {
  tableName: 'HN_PAT_INFO',
  timestamps: false,
});

module.exports = HN_PAT_INFO;
