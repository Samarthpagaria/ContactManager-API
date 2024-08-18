import mongoose from "mongoose"; // Import Mongoose library for MongoDB interactions

// Define the schema for the Contact model
const contactSchema = mongoose.Schema(
  {
    // Reference to the User who owns this contact
    user_id: {
      type: mongoose.Schema.Types.ObjectId, // MongoDB ObjectId type for referencing other documents
      require: true, // Field is required
      ref: "User", // Reference to the User model (for population)
    },
    // Name of the contact
    name: {
      type: String, // Field type is String
      required: [true, "Please enter the contact name."], // Field is required with a custom error message
    },
    // Email of the contact
    email: {
      type: String, // Field type is String
      required: [true, "Please enter the contact email."], // Field is required with a custom error message
    },
    // Phone number of the contact
    phone: {
      type: String, // Field type is String
      required: [true, "Please enter the contact phone number."], // Field is required with a custom error message
    },
  },
  {
    // Options for schema
    timestamps: true, // Automatically add `createdAt` and `updatedAt` fields
  }
);

// Export the Contact model based on the contactSchema
export const Contact = mongoose.model("Contact", contactSchema);
