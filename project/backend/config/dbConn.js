const Sequelize = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_SERVER || 'mssql',
    port: process.env.DB_PORT || 1433,
    dialect: 'mssql',
    pool: {
      max: 5,
      min: 0,
      acquire: 900000,
      idle: 10000
    },
    dialectOptions: {
      options: {
        requestTimeout: 900000,
        encrypt: false, // ถ้าไม่ได้ใช้ Azure
        trustServerCertificate: true // สำคัญเวลา run ใน docker
      }
    },
    logging: false,
  }
);

async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log('Connected to SQL Server successfully');
  } catch (err) {
    console.error('Error connecting to SQL Server', err);
    process.exit(1);
  }
}

module.exports = {
  Sequelize,
  sequelize,
  connectDB,
};