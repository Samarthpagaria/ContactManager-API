import express from "express";
// Initialize the router
const router = express.Router(); // Create a new router object to define routes

import {
  createContact,
  deleteContact,
  getContact,
  getContacts,
  updateContact,
} from "../Controllers/contactController.js"; // Import controller functions for handling contact operations

import { validateToken } from "../middleware/validateTokenHandler.js"; // Import middleware to validate JWT tokens

// Middleware to validate the token for all routes below
router.use(validateToken);

// Route to get all contacts or create a new contact
// This defines two routes:
// 1. GET /api/contacts - Retrieves all contacts for the authenticated user
// 2. POST /api/contacts - Creates a new contact for the authenticated user
router.route("/").get(getContacts);
router.route("/").post(createContact);

// You can combine the above two routes into a single line:
// router.route("/").get(getContacts).post(createContact);

// Routes to get, update, or delete a specific contact by ID
// This defines three routes:
// 1. GET /api/contacts/:id - Retrieves a specific contact by ID
// 2. PUT /api/contacts/:id - Updates a specific contact by ID
// 3. DELETE /api/contacts/:id - Deletes a specific contact by ID
router.route("/:id").get(getContact);
router.route("/:id").put(updateContact);
router.route("/:id").delete(deleteContact);

// You can combine the above three routes into a single line:
// router.route("/:id").get(getContact).put(updateContact).delete(deleteContact);

// Export the router so it can be used in other parts of the application
export default router;
