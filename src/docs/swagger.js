const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Fitness Tracker API',
      version: '1.0.0',
      description: 'A comprehensive API for fitness and meal tracking',
      contact: {
        name: 'API Support',
        email: 'support@fitnesstracker.com'
      }
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production' 
          ? 'https://your-api-domain.com' 
          : `http://localhost:${process.env.PORT || 3000}`,
        description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            email: { type: 'string', format: 'email' },
            name: { type: 'string' },
            daily_goal: { type: 'number' },
            created_at: { type: 'string', format: 'date-time' }
          }
        },
        UserRegistration: {
          type: 'object',
          required: ['name', 'email', 'password', 'daily_goal'],
          properties: {
            name: { type: 'string', minLength: 2, maxLength: 50 },
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 6 },
            daily_goal: { type: 'number', minimum: 0 }
          }
        },
        UserLogin: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string' }
          }
        },
        Meal: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            user_id: { type: 'string', format: 'uuid' },
            meal_type_id: { type: 'string', format: 'uuid' },
            meal_date: { type: 'string', format: 'date' },
            name: { type: 'string' },
            notes: { type: 'string' },
            total_calories: { type: 'number' },
            total_protein: { type: 'number' },
            total_carbs: { type: 'number' },
            total_fat: { type: 'number' }
          }
        },
        Food: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            brand: { type: 'string' },
            serving_size: { type: 'number' },
            calories_per_serving: { type: 'number' },
            protein_per_serving: { type: 'number' },
            carbs_per_serving: { type: 'number' },
            fat_per_serving: { type: 'number' },
            category: { type: 'string' }
          }
        },
        Workout: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            user_id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            workout_date: { type: 'string', format: 'date' },
            duration_minutes: { type: 'integer' },
            total_calories_burned: { type: 'number' },
            notes: { type: 'string' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string' }
          }
        },
        Success: {
          type: 'object',
          properties: {
            message: { type: 'string' }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: [__dirname + '/../routes/*.js', __dirname + '/../controllers/*.js'],
};

const specs = swaggerJSDoc(options);
module.exports = specs; 