var apiKey = "51e41540f39cbd305ca8bb47b8352fce";
//var searchCity="Round Rock";
var lat;
var lon;
var country = "US";
var state = "Texas";
var forecast = [];
var apiUrl_getWeather;
//api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}//
// API URL
//var apiUrl_coordinate   =    'https://api.openweathermap.org/geo/1.0/direct?q='+searchCity+","+state+','+country+'&limit=5&appid='+apiKey
// var apiUrl_getWeather;
// AJAX


var getCurrentWeatherData = function (searchCity) {

	var apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + searchCity + ',us&units=metric&APPID=' + apiKey;
	console.log(apiUrl);


	fetch(apiUrl) //search by cityname to get lat and lon
		.then((response) => response.json()) //{response.json()} didn;t work
		.then((data) => {
			console.log(data);
			var lat = data.coord.lat.toFixed(2);
			var lon = data.coord.lon.toFixed(2);
			var currentMainTemp = data.main.temp;
			var currentMainHumidity = data.main.humidity;
			var currentWind = data.wind.speed;
			var weatherIcon			=	'<img src="https://openweathermap.org/img/w/' + data.weather[0].icon + '.png">';

			
			var weatherBg			=	data.weather[0].icon;


			renderCurrentWeather(searchCity,currentMainTemp, currentWind, currentMainHumidity,weatherIcon);

			apiUrl_getWeather = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&appid=' + apiKey;
			console.log(apiUrl_getWeather);

			getWeatherData(apiUrl_getWeather);


		})
		.catch((error)=>
			console.error("fetch error",error)
		);



}

var renderCurrentWeather = function (searchCity,currentMainTemp, currentWind, currentMainHumidity, currentWeatherIcon) {
	var current_h1=$("<h1>");
	var currentWeather_elm=$("#currentWeather");
	var today=moment().format("MM/DD/YYYY ddd");
	var currentWeatherText=searchCity+"   "+today;
	$(current_h1).text(currentWeatherText);
	currentWeather_elm.append(current_h1);

	temp_elm=$("<p>");
	$(temp_elm).text("Temp: "+currentMainTemp+"°C");

	
	$(currentWeatherIcon).attr("width","400px").addClass("col-2").insertAfter(current_h1);
	currentWeather_elm.append(temp_elm);

	humidity_elm=$("<p>");
	$(humidity_elm).text("Humidity: "+currentMainHumidity+"%").insertAfter(temp_elm);

	wind_elm=$("<p>");
	$(wind_elm).text("Wind: "+currentWind+"MPH").insertAfter(humidity_elm);





}
var getWeatherData = function (apiUrl_getWeather) {

	// var apiUrl				=	'https://api.openweathermap.org/data/2.5/weather?q='+searchCity+',us&units=metric&APPID='+apiKey;


	fetch(apiUrl_getWeather) //search by cityname to get lat and lon
		.then((response) => response.json())
		.then((data) => {
	
			console.log(data);
			var cityName = data.city.name;
		
			for (let i = 3; i < data.list.length; i=i+8) {
				var date = data.list[i].dt_txt;
				var dayOfWeek = moment(date).format("ddd");
				var mainTemp = (parseFloat(data.list[i].main.temp)-273.15).toFixed(0);
				//((K-273.15)*1.8)+32
				var mainWind = data.list[i].wind.speed;
				var mainHumidity = data.list[i].main.humidity;

				// var mainTempMin = data.list[i].main.temp_min;
				// var mainTempMax = data.list[i].main.temp_max;
				
				var weatherIcon			=	'<img src="https://openweathermap.org/img/w/' + data.list[i].weather[0].icon + '.png">';

				renderWeatherFor5days(dayOfWeek,mainTemp,mainHumidity,mainWind,weatherIcon);


			}

			}


		)
		.catch((error)=>
			console.error("fetch error",error)
		);



}
var renderWeatherFor5days=function(dayOfWeek,mainTemp,mainHumidity,mainWind,weatherIcon){
	var weatherBox=$("#weatherbox-container");
	var div=$("<div>").addClass("col-2 weatherbox card");
	weatherBox.append(div);
	var date=$("<strong>").addClass("card-header").text(dayOfWeek);
	div.append(date);
	var icon=$(weatherIcon);
	date.append(icon);

	var card_body=$("<div>").addClass("card-body");
	div.append(card_body);
	var temp=$("<p>").text("Temp: "+mainTemp+"°C");
	card_body.append(temp);
	var wind=$("<p>").text("Humidity: "+mainHumidity+"%");
	wind.insertAfter(temp);
	var humidity=$("<p>").text("Wind: "+mainWind+"m/s");
	humidity.insertAfter(wind);
	
	
}
// $.ajax ({
// 	url : apiUrl_getWeather,
// 	type: 'GET',
// 	dataType: 'jsonp',
// 	success: function(data) {
// 		console.log(data);
// 		console.log("finish");} ///// ????


// });
//https://api.openweathermap.org/data/2.5/weather?q=Round Rock,Texas,us&appid=51e41540f39cbd305ca8bb47b8352fce
//api.openweathermap.org/data/2.5/forecast?lat=30.50&lon=-97.67&appid=51e41540f39cbd305ca8bb47b8352fce
// api.openweathermap.org/data/2.5/forecast?lat=30.51&lon=-97.68&appid=51e41540f39cbd305ca8bb47b8352fce

//script.js:23 api.openweathermap.org/data/2.5/forecast?lat=30.5085915&lon=-97.6788056&appid=51e41540f39cbd305ca8bb47b8352fce


//"https://api.openweathermap.org/data/2.5/weather?lat=44.34&lon=10.99&appid=51e41540f39cbd305ca8bb47b8352fce"
//
//api.openweathermap.org/data/2.5/forecast?lat=undefined&lon=undefined&appid=51e41540f39cbd305ca8bb47b8352fce
// jQuery.ajax ({
// 	url : apiUrl_getWeather,
// 	type: 'GET',
// 	dataType: 'jsonp',
// 	success: function(data) {
// 		console.log(data);
// 		console.log("finish");}


// });
// jQuery.ajax ({
// 	url: apiUrl,
// 	type: 'GET',
// 	dataType: 'jsonp',
// 	success: function(data) {

// 		console.log(data);
// 		for(let i=0;i<data.length;i++){

// 		}

// 		// COORDINATES
// 		var coordLat			=	data.coord.lat;
// 		var coordLng			=	data.coord.lon;

// 		// WEATHER
// 		var weatherId			=	data.weather[0].id;
// 		var weatherMain			=	data.weather[0].main;
// 		var weatherDesc			=	data.weather[0].description;
// 		var weatherIcon			=	'<img src="https://openweathermap.org/img/w/' + data.weather[0].icon + '.png" />';
// 		var weatherBg			=	data.weather[0].icon;

// 		// BASE
// 		var baseData			=	data.base;

// 		// TEMP
// 		var mainTemp			=	data.main.temp;
// 		var mainPressure		=	data.main.pressure;
// 		var mainHumidity		=	data.main.humidity;
// 		var mainTempMin			=	data.main.temp_min;
// 		var mainTempMax			=	data.main.temp_max;

// 		// VISIBILITY
// 		var visibility			=	data.visibility;

// 		// WIND
// 		var windSpeed			=	data.wind.speed;
// 		var windDeg				=	data.wind.deg;

// 		// CLOUDS
// 		var clouds				=	data.clouds.all;

// 		// DT
// 		var dt					=	data.dt;

// 		// SYS
// 		var sysType				=	data.sys.type;
// 		var sysId				=	data.sys.id;
// 		var sysMessage			=	data.sys.message;
// 		var sysCountry			=	data.sys.country;
// 		var sysSunrise			=	data.sys.sunrise;
// 		var sysSunset			=	data.sys.sunset;

// 		// ID
// 		var id					=	data.id;

// 		// NAME
// 		var name				=	data.name;

// 		// COD
// 		var cod					=	data.cod;

// 		jQuery('#city').html( name );
// 		jQuery('#temp').html( mainTemp + '° C' );
// 		jQuery('#desc').html( weatherDesc );
// 	}

// });

// $.getJSON("city.list.json", function(json) {
//     console.log(json); // this will show the info it in firebug console
// });
// 
// fetch('city.list.json')
//     .then((response) => response.json())
//     .then((json) => console.log(json));

$("#buttonForCity").on("click", (event) => {
	event.preventDefault();
	console.log("click")

	var searchCity = $("#searchForCity").val();
	getCurrentWeatherData(searchCity);
	// console.log(apiUrl_getWeather);
	// getWeatherData(apiUrl_getWeather); 
});

