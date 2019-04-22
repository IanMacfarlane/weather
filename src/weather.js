
var geoGet = 'http://api.ipstack.com/check?access_key=adb9b777a8db1e83b46d56c50cba7985';
var weatherKey = 'b429d2521e87ce0a12de95e5ece58549';

var geoData;
var lat;
var lon;
var weatherData;
var forecastData;

var forecasts;

var weatherGet;
var forecastGet;

var body = document.querySelector('body');

call();

var geoLocation = new Vue({
	el: '#geo-location',
	data: {
		message: "Loading..."
	}
})

var voting = new Vue({
	el: '#voting',
	data: {
		neutral: 0,
		yes: 0,
		no: 0
	},
	methods: {
		update: function() {
			this.neutral = 0;
			this.yes = 0;
			this.no = 0;
			for (var i = 0; i < forecasts.forecast.length; i++) {
				if (forecasts.forecast[i][5] == 0)
					this.neutral++;
				else if (forecasts.forecast[i][5] == 1)
					this.yes++;
				else
					this.no++;
			}
		}
	}
})

/*
function makeBox(date, temp, condition, humidity, pressure) {
	
	var boxDiv = document.createElement('div');
	boxDiv.setAttribute('class', 'weatherBlock');

	var dateDiv = document.createElement('div');
	dateDiv.setAttribute('class', 'weatherData');
	dateDiv.textContent = "Date: "+date;

	var tempDiv = document.createElement('div');
	tempDiv.setAttribute('class', 'weatherData');
	tempDiv.textContent = "Tempurature: "+temp+String.fromCharCode(176)+" F";

	var conditionDiv = document.createElement('div');
	conditionDiv.setAttribute('class', 'weatherData');
	conditionDiv.textContent = "Condition: "+condition;

	var humidityDiv = document.createElement('div');
	humidityDiv.setAttribute('class', 'weatherData');
	humidityDiv.textContent = "Humidity: "+humidity+"%";

	var pressureDiv = document.createElement('div');
	pressureDiv.setAttribute('class', 'weatherData');
	pressureDiv.textContent = "Pressure: "+pressure+" hPa";


	boxDiv.appendChild(dateDiv);
	boxDiv.appendChild(tempDiv);
	boxDiv.appendChild(conditionDiv);
	boxDiv.appendChild(humidityDiv);
	boxDiv.appendChild(pressureDiv);

	return boxDiv;
}
*/

function makePage(weatherData, forecastData) {
	//console.log(weatherData);
	//console.log(forecastData);
	//var weatherDiv = document.createElement('div');
	//weatherDiv.setAttribute('class', 'todaysWeather');
	//var forecastDiv = document.createElement('div');
	//forecastDiv.setAttribute('class', 'todaysWeather');
	//body.appendChild(weatherDiv);
	//body.appendChild(forecastDiv);

	var theDate = new Date();

	var weather = new Vue({
		el: '#weather',
		data: {
			date: theDate.getFullYear()+"-"+(theDate.getMonth()+1)+"-"+theDate.getDate()+" "+theDate.getHours()+":"+theDate.getMinutes()+":"+theDate.getSeconds(),
			tempurature: weatherData.main.temp,
			condition: weatherData.weather[0].description,
			humidity: weatherData.main.humidity,
			pressure: weatherData.main.pressure
		}
	})

	forecasts = new Vue({
		el: '#forecasts',
		data: {
			forecast: [
			],
			setClass: [
				0
			]
		},
		methods: {
			fillForecast: function() {
				for (var i = 0; i < forecastData.list.length; i++) {
					var weather = [];
					weather.push(forecastData.list[i].dt_txt);
					weather.push(forecastData.list[i].main.temp);
					weather.push(forecastData.list[i].weather[0].description);
					weather.push(forecastData.list[i].main.humidity);
					weather.push(forecastData.list[i].main.pressure);
					weather.push(0);
					forecasts.forecast.push(weather);
				}
			},
			cycleStatus: function(n) {
				if (this.forecast[n][5] == 0)
					Vue.set(this.forecast[n], 5, 1);
				else if (this.forecast[n][5] == 1)
					Vue.set(this.forecast[n], 5, 2);
				else
					Vue.set(this.forecast[n], 5, 0);
				voting.update();
			}
		}
	})

	forecasts.fillForecast();
	console.log(forecasts.forecast);

	voting.update();

	/*
	var today = makeBox(
		theDate.getFullYear()+"-"+(theDate.getMonth()+1)+"-"+theDate.getDate()+" "+theDate.getHours()+":"+theDate.getMinutes()+":"+theDate.getSeconds(),
		weatherData.main.temp,
		weatherData.weather[0].description,
		weatherData.main.humidity,
		weatherData.main.pressure
	);

	var forcast = [];
	for (var i = 0; i < forecastData.list.length; i++) {

		forcast.push(makeBox(
			forecastData.list[i].dt_txt,
			forecastData.list[i].main.temp,
			forecastData.list[i].weather[0].description,
			forecastData.list[i].main.humidity,
			forecastData.list[i].main.pressure
		));

	}


	weatherDiv.appendChild(today);

	for (var i=0; i < forcast.length; i++) {
		forecastDiv.appendChild(forcast[i]);
	}*/
	geoLocation.message = "You seem to be in "+geoData.city+" "+geoData.region_name+" "+geoData.country_name;
}

function call() {
	fetch(geoGet)
	.then(r => r.json())
	.then(json => {
		geoData = json;
		console.log(geoData);
		lat = geoData.latitude;
		lon = geoData.longitude;
		//console.log("lat: "+lat+", lon: "+lon);
		weatherGet = 'http://api.openweathermap.org/data/2.5/weather?lat='+lat+'&lon='+lon+'&APPID='+weatherKey+"&units=imperial";
		forecastGet = 'http://api.openweathermap.org/data/2.5/forecast?lat='+lat+'&lon='+lon+'&APPID='+weatherKey+"&units=imperial";
		console.log(weatherGet);
		console.log(forecastGet);

		return fetch(weatherGet) })
	.then(r => r.json())
	.then(json => {
		weatherData = json;
		//console.log(weatherData);

		return fetch(forecastGet) })
	.then(r => r.json())
	.then(json => {
		forecastData = json;
		//console.log(forecastData);
		makePage(weatherData, forecastData);
	});
}
