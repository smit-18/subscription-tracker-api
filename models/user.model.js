import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "User name is required"],
			trim: true,
			maxlength: [50, "User name cannot exceed 50 characters"],
			minlength: [2, "User name must be at least 2 characters long"],
		},
		email: {
			type: String,
			required: [true, "User email is required"],
			unique: true,
			trim: true,
			lowercase: true,
			match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please provide a valid email"],
		},
		password: {
			type: String,
			required: [true, "User password is required"],
			minlength: [6, "Password must be at least 6 characters long"],
		},
	},
	{ timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;