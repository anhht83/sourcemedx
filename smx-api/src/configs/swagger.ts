import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import { Express } from 'express'
import { config } from './config'

// ✅ Define Swagger options
const swaggerOptions: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SourceMedX API',
      version: '1.0.0',
      description: 'API documentation for the SourceMedX platform',
    },
    servers: [
      {
        url: `http://localhost:${config.port}`, // ⚡ Change this in production
        description: 'Local development server',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT', // Defines JWT as the authentication method
        },
      },
    },
    // security: [{BearerAuth: []}], // Requires authentication by default
  },
  apis:
    config.nodeEnv === 'development'
      ? ['./src/**/*.ts', './src/application/**/*.ts']
      : ['./src/**/*.js', './src/application/**/*.js'], // Include API documentation from routes & controllers
}

// ✅ Generate Swagger documentation
const swaggerSpec = swaggerJSDoc(swaggerOptions)

/**
 * ✅ Function to setup Swagger UI
 */
export function setupSwagger(app: Express) {
  app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
  console.log(
    `Swagger Docs available at: http://localhost:${config.port}/swagger`,
  )
}
