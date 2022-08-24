const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();

async function getNews(topic) {
	try {
		var config = {
			method: "get",
			url: `https://newsapi.org/v2/everything?pageSize=10&language=en&q=${topic}&from=2022-08-22&sortBy=publishedAt&apiKey=${process.env.NEWS_API_KEY}`,
		};

		let response = await axios(config);
		let data = response.data;
		let responseData = [];

		for (let i = 0; i < data.articles.length; i++) {
			responseData.push({
				headline: data.articles[i].title,
				link: data.articles[i].url,
			});
		}
		let result = {
			count: responseData.length,
			data: responseData,
		};

		console.log(responseData.length);
		return result;
	} catch (error) {
		console.log(error);
	}
}

module.exports = {
	getNews,
};
