const express = require("express");
const app = express();
const bodyParser = require("body-parser");
let Port = process.env.PORT || 3000;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const dotenv = require("dotenv");

const news = require("./news");
const weather = require("./weather");

//Mongoose connection and functionality
const { User } = require("./model");
const mongoose = require("mongoose");
const URI = "mongodb://localhost:27017/task";

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

app.get("/signup", async (req, res) => {
	const newUser = req.body;

	//Validate user input
	if (!(newUser.name && newUser.email && newUser.password)) {
		return res.status(400).send("All input is required");
	}

	//Check if user already exist
	let ifEmailExist = await User.findOne({ email: newUser.email });
	if (ifEmailExist) {
		return res.status(409).send("User Already Exist. Please Login");
	}

	//Encrypting user password
	encryptedPassword = await bcrypt.hash(newUser.password, 10);

	const user = await User.create({
		name: newUser.name,
		email: newUser.email,
		password: encryptedPassword,
	});

	res.status(201).send(user);
});

app.get("/login", async (req, res) => {
	try {
		//Getting User
		const { email, password } = req.body;

		//Validate user input
		if (!(email && password)) {
			return res.status(400).send("All input is required");
		}

		//Validate if user exists in our database
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(404).send("User Not Found with this email");
		}

		//Checking the password
		let checkPassword = await bcrypt.compare(password, user.password);
		if (!checkPassword) {
			return res.status(400).send("Incorrect Password");
		}

		//Creating token
		const token = jwt.sign(email, process.env.TOKEN_KEY);

		//Saving the token in the db
		await User.updateOne(
			{ email: email },
			{ $set: { token: token } },
			{ multi: true }
		);

		//saving user token
		user.token = token;

		return res.status(200).json(user);
	} catch (err) {
		console.log(err);
	}
});

app.get("/logout", async (req, res) => {
	let { token, email } = req.body;

	//Check if token is passed in request header
	if (!(token && email)) {
		return res.status(400).send("Please Enter token and email");
	}

	let deleteToken = await User.updateMany(
		{ email: email },
		{ $unset: { token: "" } }
	);
	if (!deleteToken) {
		return res.status(400).json("Invalid Token");
	}

	return res.status(200).json("You are logged out");
});

app.get("/news", async (req, res) => {
	let token = req.body.token;

	//Check if token is passed in request header
	if (!token) {
		return res.status(400).send("Please Enter token");
	}

	//Check if the token exists in db
	const tokenExist = await User.findOne({ token });
	if (!tokenExist) {
		return res.status(400).send("Invalid token");
	}

	let topic = req.query.search;
	if (!topic) {
		return res.status(400).send("Please Enter the topic as query params");
	}

	let newsReport = await news.getNews(topic);

	return res.send(newsReport);
});

//Weather Report Route Does not need Authentication
app.get("/weather", async (req, res) => {
	let weatherReport = await weather.getWeatherReport();
	return res.send(weatherReport);
});

app.listen(Port, () => {
	console.log(`Server Running on Port ${Port}`);
});
