// Requiring module
const mongoose = require("mongoose");

// User Modal Schema
const userSchema = new mongoose.Schema(
	{
		name: { type: String, default: null },
		age: { type: String, default: null },
		email: { type: String, unique: true },
		city: { type: String },
		phone: { type: String },
	},
	{ strict: false }
);

// Creating model object
const User = mongoose.model("user", userSchema);

// Exporting our model object
module.exports = {
	User,
};
