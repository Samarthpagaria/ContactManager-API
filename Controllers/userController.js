import express from "express"; // Importing the express library to create the API routes and handle HTTP requests
import asyncHandler from "express-async-handler"; // Importing express-async-handler to handle async errors in route handlers
import { User } from "../models/userModel.js"; // Importing the User model to interact with the User collection in the database
import bcrypt from "bcrypt"; // Importing bcrypt for hashing and comparing passwords
import jwt from "jsonwebtoken"; // Importing JSON Web Token for creating and verifying tokens

//@desc Register a User
//@route POST /api/users/register
//@access public
const registerUser = asyncHandler(async (req, res) => {
  // Extracting the necessary fields from the request body
  const { username, email, password } = req.body;

  // Check if all required fields are provided
  if (!username || !email || !password) {
    res.status(400); // Bad Request
    throw new Error("All the fields are mandatory");
  }

  // Check if the user already exists in the database by email
  const userAvailable = await User.findOne({ email });
  if (userAvailable) {
    res.status(400); // Bad Request
    throw new Error("User already registered");
  }

  // Hash the user's password before saving it to the database
  const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds
  console.log("Hashed password:", hashedPassword);

  // Create a new user with the provided details and hashed password
  const user = await User.create({
    username,
    email,
    password: hashedPassword,
  });

  // Logging the newly created user's details
  console.log(`User created: ${user}`);

  // If user creation is successful, send back the user's basic information
  if (user) {
    res
      .status(201)
      .json({ _id: user.id, username: user.username, email: user.email });
  } else {
    res.status(400); // Bad Request
    throw new Error("User data is not valid");
  }
});

//@desc Login a User
//@route POST /api/users/login
//@access public
const loginUser = asyncHandler(async (req, res) => {
  // Extracting email and password from the request body
  const { email, password } = req.body;

  // Check if both email and password are provided
  if (!email || !password) {
    res.status(400); // Bad Request
    throw new Error("All fields are mandatory!");
  }

  // Finding if the user exists in the database by email
  const user = await User.findOne({ email });

  // Compare the provided password with the hashed password in the database
  if (user && (await bcrypt.compare(password, user.password))) {
    // If the passwords match, create a JWT access token
    const accessToken = jwt.sign(
      {
        user: {
          username: user.username,
          email: user.email,
          id: user.id,
        },
      },
      process.env.ACCESS_TOKEN_SECRET, // Secret key from environment variables
      { expiresIn: "15m" } // Token expires in 15 minutes
    );

    // Log the token expiration time for debugging purposes
    const decodedToken = jwt.decode(accessToken);
    console.log("Token will expire at:", new Date(decodedToken.exp * 1000));

    // Send the access token back to the client
    res.status(200).json({ accessToken });
  } else {
    res.status(401); // Unauthorized
    throw new Error("Email or password not valid!");
  }
});

//@desc Get the current logged-in user's information
//@route GET /api/users/current
//@access private
const currentUser = asyncHandler(async (req, res) => {
  // Respond with the user's information attached to the request by the auth middleware
  res.json(req.user);
});

export { registerUser, loginUser, currentUser }; // Exporting the route handlers to be used in routes
