const Sequelize = require('sequelize');
require('dotenv').config();

// First database connection
const sequelize = new Sequelize(
  process.env.DB_NAME || 'default_db',
  process.env.DB_USER || 'default_user',
  process.env.DB_PASSWORD || 'default_pass', {
    host: process.env.DB_SERVER || 'localhost',
    dialect: 'mssql',
    pool: {
      max: 5, // Maximum number of connection in pool
      min: 0, // Minimum number of connection in pool
      acquire: 900000, // The maximum time, in milliseconds, that pool will try to get connection before throwing error
      idle: 10000 // The maximum time, in milliseconds, that a connection can be idle before being released
    },
    dialectOptions: {
      options: {
        requestTimeout: 900000, // Timeout in milliseconds
        encrypt: false,
      }
    },
    logging: false, // Disable query logging
  }
);

// Connect to the first database
async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log('Connected to SQL Server for the first database');
  } catch (err) {
    console.error('Error connecting to SQL Server for the first database', err);
    process.exit(1);
  }
}

module.exports = {
  Sequelize, // Export the Sequelize object
  sequelize, // Export the first sequelize instance
  connectDB, // Export the first database connection function
};
