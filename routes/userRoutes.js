import express from "express"; // Import the Express library for routing
import {
  currentUser,
  loginUser,
  registerUser,
} from "../Controllers/userController.js"; // Import controller functions
import { validateToken } from "../middleware/validateTokenHandler.js"; // Import middleware to validate tokens

// Initialize the router
const router = express.Router();

// Route to register a new user
// Endpoint: POST /api/users/register
// Calls the registerUser function from the userController
router.post("/register", registerUser);

// Route to login a user
// Endpoint: POST /api/users/login
// Calls the loginUser function from the userController
router.post("/login", loginUser);

// Route to get the current user's information
// Endpoint: GET /api/users/current
// Uses the validateToken middleware to ensure the user is authenticated
// Calls the currentUser function from the userController
router.get("/current", validateToken, currentUser);

// Export the router to use it in other parts of the application
export default router;
