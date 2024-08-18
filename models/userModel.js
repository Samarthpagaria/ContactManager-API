import mongoose from "mongoose"; // Import Mongoose library for MongoDB interactions

// Define the schema for the User model
const userSchema = mongoose.Schema(
  {
    // Username of the user
    username: {
      type: String, // Field type is String
      require: [true, "Please add the username."], // Field is required with a custom error message
    },
    // Email of the user
    email: {
      type: String, // Field type is String
      require: [true, "Please enter the email."], // Field is required with a custom error message
      unique: [true, "Email address already registered."], // Ensures email is unique across the collection
    },
    // Password of the user
    password: {
      type: String, // Field type is String
      require: [true, "Please enter the password."], // Field is required with a custom error message
    },
  },
  {
    // Options for schema
    timestamps: true, // Automatically add `createdAt` and `updatedAt` fields
  }
);

// Export the User model based on the userSchema
export const User = mongoose.model("User", userSchema);
