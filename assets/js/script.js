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
	var current_h1=$("<h2>");
	var currentWeather_elm=$("#currentWeather");
	$(currentWeather_elm).empty();
	var today=moment().format("MM/DD/YYYY ddd");
	var currentWeatherText=searchCity+" " +today;
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

			 var weatherBox=$("#weatherbox-container");
			 $(weatherBox).empty();  //init
			var dailyWeather=[];

			for (let i = 0; i < data.list.length; i++) {
				var date = data.list[i].dt_txt;
				var dayOfWeek = moment(date).format("ddd");
				var hour=moment(date).format("h a");
				console.log(hour);
				var mainTemp = (parseFloat(data.list[i].main.temp)-273.15).toFixed(0);
				//((K-273.15)*1.8)+32
				var mainWind = data.list[i].wind.speed;
				var mainHumidity = data.list[i].main.humidity;
				var weatherIcon			=	'<img src="https://openweathermap.org/img/w/' + data.list[i].weather[0].icon + '.png">';
				var threeHourly={
					dayOfWeek:dayOfWeek,
					hour:hour,
					mainTemp:mainTemp,
					mainWind:mainWind,
					mainHumidity:mainHumidity,
					weatherIcon:weatherIcon
				};
				if(i% 8=== 3)
				{
					renderWeatherFor5days(dayOfWeek,hour,mainTemp,mainHumidity,mainWind,weatherIcon);
				}
				
					
				dailyWeather.push(threeHourly);

				renderWeatherFor3hourly(dailyWeather);

			}

			}

		)
		.catch((error)=>
			console.error("fetch error",error)
		);



}
var renderWeatherFor3hourly=function(dailyWeather){
	console.log("good");
}
;
var renderWeatherFor5days=function(dayOfWeek,hour,mainTemp,mainHumidity,mainWind,weatherIcon){
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

$("#buttonForCity").on("click", (event) => {
	event.preventDefault();
	console.log("click")

	var searchCity = $("#searchForCity").val();
	if(searchCity===""){
		return ;
	}

	getCurrentWeatherData(searchCity);
	saveLocalStorage(searchCity);
	renderLocalStorage();
	$("#searchForCity").val("");
	
});
var searchCityList=[];
var saveLocalStorage=function(searchCity){
	if(searchCity!==""){
		//exclude the same search list
		if(!(searchCityList.includes(searchCity))){
			searchCityList.push(searchCity);
			localStorage.setItem("searchCity",JSON.stringify(searchCityList));
			console.log("save");
		}
		
	}
}
var renderLocalStorage=function(){
	var searchHistory=$("#searchHistory");
	searchHistory.empty();
	
	
	for(let i=0;i<searchCityList.length;i++){
		console.log("here");

		var btn=$("<button>").text(searchCityList[i]).addClass("btn btn-secondary btn-block form-group").attr("value",searchCityList[i]);
		searchHistory.append(btn);

	}
	

}
function init(){
	var storedSearchList=JSON.parse(localStorage.getItem("searchCity"));
	if(storedSearchList !==null){
		searchCityList=storedSearchList;
	}
	renderLocalStorage();
}
init();

//search history button click event handler
$("#searchHistory").on("click",(e)=>{
	e.preventDefault();
	console.log("click");
	

	var searchCity = $(e.target).val();
	console.log(searchCity);
	if(searchCity===""){
		return ;
	}

	getCurrentWeatherData(searchCity);
	saveLocalStorage(searchCity);
	renderLocalStorage();

});
