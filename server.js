import express from "express"; // Import the Express library to set up the server
import { config } from "dotenv"; // Import dotenv to load environment variables from .env file

import contactRoutes from "./routes/contactRoutes.js"; // Import routes for contact-related API endpoints
import { errorHandler } from "./middleware/errorHandler.js"; // Import custom error handling middleware
import { connectdb } from "./Config/dbConnection.js"; // Import function to connect to the database
import userRoutes from "./routes/userRoutes.js"; // Import routes for user-related API endpoints

// Load environment variables from the .env file
config();

// Connect to the database
connectdb();

// Define the port for the server to listen on
const port = process.env.PORT || 8000; // Use the PORT environment variable if defined, otherwise default to 8000

// Initialize the Express application
const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// Set up routes for contact-related endpoints
app.use("/api/contacts", contactRoutes);

// Set up routes for user-related endpoints
app.use("/api/users", userRoutes);

// Use custom error handling middleware for handling errors
app.use(errorHandler);

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
