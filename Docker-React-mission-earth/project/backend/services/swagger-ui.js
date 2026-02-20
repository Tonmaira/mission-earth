const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');

// Import your additional Swagger definitions
const userOperations = require('../routes/swagger-model'); // Import the userOperations object


const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Node JS Admit Room Reserver',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: [path.join(__dirname, '../routes/*.js')],
};

const swaggerSpec = swaggerJsdoc(options);

// Merge the additional Swagger definitions directly
swaggerSpec.paths = {
    ...(swaggerSpec.paths || {}),
    ...(userOperations.paths || {}), // Include the paths defined in userOperations
  };
  
  // Merge the additional Swagger schemas/components
  swaggerSpec.components = {
    ...(swaggerSpec.components || {}),
    ...(userOperations.components || {}), // Include the components defined in userOperations
  };

  
module.exports = { swaggerSpec };
