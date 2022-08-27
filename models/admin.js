// Requiring module
const mongoose = require("mongoose");

// User Modal Schema
const adminSchema = new mongoose.Schema(
	{
		name: { type: String, default: null },
		email: { type: String, unique: true },
		password: { type: String },
		token: { type: String },
	},
	{ strict: false }
);

// Creating model object
const Admin = mongoose.model("admin", adminSchema);

// Exporting our model object
module.exports = {
	Admin,
};
