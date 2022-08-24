const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();

//Return Next Five Days Array
function getDates() {
	let dateArray = [];

	var day = new Date();
	dateArray.push(day);

	for (let i = 0; i < 4; i++) {
		var nextDay = new Date(day);
		nextDay.setDate(day.getDate() + 1);
		dateArray.push(nextDay);
		day = nextDay;
	}

	return dateArray;
}

//Return Unix Date Array
function getUnixDates(dates) {
	let unixtimeArray = [];
	for (let i = 0; i < dates.length; i++) {
		var unixtime = dates[i].getTime() / 1000;
		unixtimeArray.push(unixtime);
	}
	return unixtimeArray;
}

//Desired output date conversion
function getNormalDates(dates) {
	let normalDates = [];
	for (let i = 0; i < dates.length; i++) {
		dates[i] += "";
		let result = dates[i].substr(0, 16);
		normalDates.push(result);
	}
	return normalDates;
}

async function getReport(dates, normalDates) {
	try {
		let responseData = [];
		for (let i = 0; i < dates.length; i++) {
			var config = {
				method: "get",
				url: `https://api.openweathermap.org/data/2.5/weather?q=chandigarh&units=metric&dt=${dates[i]}&appid=${process.env.WEATHER_API_KEY}`,
			};

			let response = await axios(config);
			let data = response.data;

			responseData.push({
				date: normalDates[i],
				main: data.weather[0].main,
				Temp: data.main.temp,
			});
		}
		let result = {
			count: 5,
			unit: "Metric",
			location: "Bangalore",
			data: responseData,
		};

		return result;
	} catch (error) {
		console.log(error);
	}
}

async function getWeatherReport() {
	try {
		let dates = getDates(); //Getting Dates for current day to next Five Days
		let unixDates = getUnixDates(dates); //Converting dates to Unix TimeStamp
		let normalDates = getNormalDates(dates); //Desired Date for the output
		let weatherDataReport = await getReport(unixDates, normalDates);
		return weatherDataReport;
	} catch (error) {
		console.log(error);
	}
}

module.exports = {
	getWeatherReport,
};
