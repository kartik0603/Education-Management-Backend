require("dotenv").config();
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
        title: "Educational Management API Documentation",
        version: "1.0.0",
        description: "Comprehensive documentation for all project API endpoints",
    },
    servers: [
        {
            url:
                process.env.NODE_ENV === "production"
                    ? process.env.PROD_BASE_URL || "https://education-management-backend.onrender.com/api"
                    : process.env.DEV_BASE_URL || "http://localhost:5000/api",
            description:
                process.env.NODE_ENV === "production"
                    ? "Production Server"
                    : "Development Server",
        },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
            },
        },
        schemas: {
            User: {
                type: "object",
                required: ["name", "email", "password", "role"],
                properties: {
                    name: {
                        type: "string",
                        description: "User's name",
                    },
                    email: {
                        type: "string",
                        description: "User's unique email",
                    },
                    password: {
                        type: "string",
                        description: "Hashed user password",
                    },
                    role: {
                        type: "string",
                        description: "Role of the user",
                        enum: ["Admin", "Teacher", "Student"],
                    },
                },
                example: {
                    name: "John Doe",
                    email: "john.doe@example.com",
                    password: "hashedpassword123",
                    role: "Teacher",
                },
            },
            LoginRequest: {
                type: "object",
                required: ["email", "password"],
                properties: {
                    email: {
                        type: "string",
                        description: "User's email",
                    },
                    password: {
                        type: "string",
                        description: "User's password",
                    },
                },
            },
            ForgetPasswordRequest: {
                type: "object",
                required: ["email"],
                properties: {
                    email: {
                        type: "string",
                        description: "User's email to send reset link",
                    },
                },
            },
            ResetPasswordRequest: {
                type: "object",
                required: ["password"],
                properties: {
                    password: {
                        type: "string",
                        description: "New password for the user",
                    },
                },
            },
            Course: {
                type: "object",
                properties: {
                    title: {
                        type: "string",
                        description: "The title of the course",
                    },
                    description: {
                        type: "string",
                        description: "The description of the course",
                    },
                    createdAt: {
                        type: "string",
                        format: "date-time",
                        description: "The date and time when the course was created",
                    },
                    updatedAt: {
                        type: "string",
                        format: "date-time",
                        description: "The date and time when the course was last updated",
                    },
                    instructor: {
                        type: "string",
                        description: "The instructor of the course",
                    },
                },
                required: ["title", "description"],
            },


        },
    },
};

const options = {
    swaggerDefinition,
    apis: [
    "./routes/course.route.js",  
    "./controllers/*.js",
    "./models/*.js",
    "./middleware/*.js",
],
};

const swaggerSpec = swaggerJSDoc(options);

const setupSwagger = (app) => {
    console.log(swaggerSpec);
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    console.log(
        `Swagger UI available at ${
            process.env.NODE_ENV === "production"
                ? process.env.PROD_BASE_URL + "/api-docs"
                : "http://localhost:5000/api-docs"
        }`
    );
};

module.exports = setupSwagger;
