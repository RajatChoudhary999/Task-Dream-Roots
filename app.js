const express = require("express");
const app = express();
const bodyParser = require("body-parser");
let Port = process.env.PORT || 3000;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const dotenv = require("dotenv");

// const news = require("./functions/news");
// const weather = require("./functions/weather");

//Mongoose Schema, connection and functionality
const { User } = require("./models/user");
const { Admin } = require("./models/admin");
const mongoose = require("mongoose");
const URI = "mongodb://localhost:27017/dreamRoots";

dotenv.config();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Connecting to database
mongoose.connect(
	URI,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
	},
	(err) => {
		if (err) throw err;
		console.log("Connected to MongoDB!!!");
	}
);
// ---------------------------------------------------------

//Routers
app.get("/", async (req, res) => {
	res.send("Hello World");
});

app.post("/add_user_details", async (req, res) => {
	const newUser = req.body;

	//Validate user input
	if (!(newUser.name && newUser.email)) {
		return res.status(400).send("Name and email is required");
	}

	//Check if user already exist
	let ifEmailExist = await User.findOne({ email: newUser.email });
	if (ifEmailExist) {
		return res.status(409).send("User Already Exist. Please Login");
	}

	//Add user details
	const user = await User.create({
		name: newUser.name,
		age: newUser.age,
		email: newUser.email,
		city: newUser.city,
		phone: newUser.phone,
	});

	res.status(201).send("Details Added Successfully");
});

app.post("/create_admin", async (req, res) => {
	const newAdmin = req.body;

	//Validate Admin input
	if (
		!(newAdmin.name && newAdmin.email && newAdmin.password && newAdmin.secret)
	) {
		return res.status(400).send("All input is required");
	}

	if (newAdmin.secret !== process.env.SECRET_KEY) {
		return res.status(400).send("Secret Key Doesn't match");
	}

	//Check if Admin already exist
	let ifEmailExist = await Admin.findOne({ email: newAdmin.email });
	if (ifEmailExist) {
		return res
			.status(409)
			.send("Admin with name or email Already Exist. Please Login");
	}

	//Encrypting Admin password
	encryptedPassword = await bcrypt.hash(newAdmin.password, 10);

	//Create new Admin
	const admin = await Admin.create({
		name: newAdmin.name,
		email: newAdmin.email,
		password: encryptedPassword,
	});

	res.status(201).send(admin);
});

app.post("/admin_login", async (req, res) => {
	try {
		//Getting Admin
		const { email, password } = req.body;

		//Validate user input
		if (!(email && password)) {
			return res.status(400).send("All input is required");
		}

		//Validate if admin exists in our database
		const admin = await Admin.findOne({ email });
		if (!admin) {
			return res.status(404).send("Admin Not Found with this email");
		}

		//Checking the password
		let checkPassword = await bcrypt.compare(password, admin.password);
		if (!checkPassword) {
			return res.status(400).send("Incorrect Password");
		}

		//Creating token
		const token = jwt.sign(email, process.env.TOKEN_KEY);

		//Saving the token in the db
		await Admin.updateOne(
			{ email: email },
			{ $set: { token: token } },
			{ multi: true }
		);

		//saving admin token
		admin.token = token;

		return res.status(200).json(admin);
	} catch (err) {
		console.log(err);
	}
});

app.post("/admin_logout", async (req, res) => {
	let { token, email } = req.body;

	//Check if token is passed in request header
	if (!(token && email)) {
		return res.status(400).send("Please Enter token and email");
	}

	//Check if token matches or not
	let tokenExist = await Admin.findOne({ token: token });
	if (!tokenExist) {
		return res.status(400).send("Invalid Token");
	}

	let deleteToken = await Admin.updateMany(
		{ email: email },
		{ $unset: { token: "" } }
	);
	if (!deleteToken) {
		return res.status(400).json("Invalid Token");
	}

	return res.status(200).json("Successfully are logged out");
});

app.get("/get_users", async (req, res) => {
	let token = req.body.token;

	//Check if token is passed in request header
	if (!token) {
		return res.status(400).send("Please Enter token");
	}

	//Check if the token exists in db
	const tokenExist = await Admin.findOne({ token });
	if (!tokenExist) {
		return res.status(400).send("Invalid token");
	}

	let users = await User.find({});

	return res.send(users);
});

app.listen(Port, () => {
	console.log(`Server Running on Port ${Port}`);
});
