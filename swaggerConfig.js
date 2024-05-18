const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Applicants API',
    version: '1.0.0',
    description: 'API documentation for the Applicants API',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Development server',
    },
  ],
};

const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ['./Server.js'],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
