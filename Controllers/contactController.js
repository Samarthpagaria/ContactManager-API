import asyncHandler from "express-async-handler"; // Middleware to handle async operations and error handling
import { Contact } from "../models/contactModel.js"; // Import the Contact model

//@desc Get all the contacts
//@route GET /api/contacts
//@access private
const getContacts = asyncHandler(async (req, res) => {
  // Fetch all contacts that belong to the logged-in user (identified by req.user.id)
  const contacts = await Contact.find({ user_id: req.user.id });
  // Respond with the list of contacts
  res.status(200).json(contacts);
});

//@desc Get a contact
//@route GET /api/contacts/:id
//@access private
const getContact = asyncHandler(async (req, res) => {
  // Fetch a single contact by its ID (provided in the URL as req.params.id)
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    // If no contact is found, respond with a 404 status and an error message
    res.status(404);
    throw new Error("Contact not found.");
  }
  // If the contact is found, respond with the contact details
  res.status(200).json(contact);
});

//@desc Create New contacts
//@route POST /api/contacts
//@access private
const createContact = asyncHandler(async (req, res) => {
  console.log("The request body is:", req.body); // Log the request body for debugging purposes
  const { name, email, phone } = req.body;
  // Check if all required fields (name, email, phone) are provided
  if (!name || !email || !phone) {
    res.status(400);
    throw new Error("All fields are mandatory!"); // If not, respond with a 400 status and an error message
  }
  // Create a new contact with the provided data and associate it with the logged-in user (req.user.id)
  const contact = await Contact.create({
    name,
    email,
    phone,
    user_id: req.user.id,
  });
  // Respond with the created contact details
  res.status(201).json(contact);
});

//@desc Update a contact
//@route PUT /api/contacts/:id
//@access private
const updateContact = asyncHandler(async (req, res) => {
  // Fetch the contact to be updated by its ID (provided in the URL as req.params.id)
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    // If no contact is found, respond with a 404 status and an error message
    res.status(404);
    throw new Error("Contact not found.");
  }

  // Check if the logged-in user is the owner of the contact
  if (contact.user_id.toString() !== req.user.id) {
    res.status(403);
    throw new Error("User does not have permission to update other contacts.");
  }

  // Update the contact with the data provided in the request body (req.body)
  const updatedContact = await Contact.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true } // The { new: true } option returns the updated contact
  );
  // Respond with the updated contact details
  res.status(200).json(updatedContact);
});

//@desc Delete a contact
//@route DELETE /api/contacts/:id
//@access private
const deleteContact = asyncHandler(async (req, res) => {
  // Fetch the contact to be deleted by its ID (provided in the URL as req.params.id)
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    // If no contact is found, respond with a 404 status and an error message
    res.status(404);
    throw new Error("Contact not found.");
  }

  // Ensure the user has permission to delete the contact
  if (contact.user_id.toString() !== req.user.id) {
    res.status(403);
    throw new Error("User does not have permission to delete this contact.");
  }

  // Delete the contact
  await Contact.deleteOne({ _id: contact._id });
  // Respond with the details of the deleted contact
  res.status(200).json(contact);
});

export { getContacts, getContact, createContact, updateContact, deleteContact };
