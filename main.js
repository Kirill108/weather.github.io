import {ITEMS_TAB, renderNowHTML, renderDetailsHTML, renderAddedLocationHTML} from './view.js';

window.addEventListener('unhandledrejection', function(event) {
	console.log(event.promise);
	console.log(event.reason); 
  });

let list = [];
let favoriteCities = new Set();

ITEMS_TAB.formSumbitNow.addEventListener("submit", addTown)
ITEMS_TAB.formSumbitDetalis.addEventListener("submit", addTown)

async function getItem() {
	let cityName = ITEMS_TAB.Town.value;
	if(!cityName) {
		cityName = localStorage.getItem('lastCity')
	}

	cityName = cityName.trim()

		const apiKey = 'f660a2fb1e4bad108d6160b7f58c555f';
		const serverUrl = '//api.openweathermap.org/data/2.5/weather';
		const url = `${serverUrl}?q=${cityName}&appid=${apiKey}&units=metric`;

		let responce = await fetch(url);
		let json = await responce.json();
		
		let temperature = (json.main.temp)
		temperature = Math.round(temperature)

		let feels_like = (json.main.feels_like)
		feels_like = Math.round(feels_like)

		let Weather_status = (json.weather[0].main)

		let Sunrise = (json.sys.sunrise)
		Sunrise = new Date(Sunrise * 1000);
		Sunrise = Sunrise.toLocaleTimeString()

		let Sunset = (json.sys.sunset)
		Sunset = new Date(Sunset * 1000);
		Sunset = Sunset.toLocaleTimeString()

		const icon = (json.weather[0].icon) 

		renderNow(temperature, cityName, icon)
		renderDetalis (temperature, cityName, feels_like, Weather_status, Sunrise, Sunset)
		ITEMS_TAB.formSumbitNow.reset()
		ITEMS_TAB.formSumbitDetalis.reset()
}

async function addTown(event) {
		event.preventDefault();
		getItem()
}

function renderNow(temperature, cityName, icon) {
	const temperatureNow = document.getElementById('temperatureNow')
	const loveButton = document.getElementById('loveButton')
	temperatureNow.textContent = ""
	
	renderNowHTML(temperature, cityName, icon)

	//loveButton
	loveButton.classList.add('after__render')
	loveButton.addEventListener('click', addLocation)
}

function renderDetalis (temperature, cityName, feels_like, Weather_status, Sunrise, Sunset) {
	const DetalisTab = document.getElementById('DetalisTab')
	const data_Wether = document.getElementById('data_Wether')
	DetalisTab.textContent = ""
	data_Wether.textContent = ""

	renderDetailsHTML(temperature, cityName, feels_like, Weather_status, Sunrise, Sunset)
}

function toStorage (favoriteCities) {
	let favoriteCitiesArr = Array.from(favoriteCities)
	let citiesArray = JSON.stringify(favoriteCitiesArr);
	localStorage.setItem('citiesArray', citiesArray);
}

function lastFavoriteViewed(cityName) {
	let lastCity = cityName
    localStorage.setItem('lastCity', lastCity)
}

function addLocation() {
	let cityValue = document.getElementById("cityName")
	let cityName = cityValue.textContent
	
	// if(!list) {
	// 	list = ["??????????????"]
	// }
	// console.log(`list: ${list}`)

	lastFavoriteViewed(cityName)
	console.log('favoriteCities: ', favoriteCities);
	if(favoriteCities.has(cityName)) {
		alert('?????? ???????? ?????????? ??????????')
	} else {
		favoriteCities.add(cityName)
		console.log('favoriteCities: \n', favoriteCities);
		
		toStorage(favoriteCities)

		renderAddedLocation();
	}
}

//
document.body.onload = renderAddedLocation()

function renderAddedLocation() {
	const city = document.getElementById('city')
	const cityTab2 = document.getElementById('cityTab2')
	city.textContent = "";
	cityTab2.textContent = "";

	// let listLocal = JSON.parse(localStorage.getItem("citiesArray"));
	favoriteCities = (new Set(JSON.parse(localStorage.getItem("citiesArray"))))
	// favoriteCities = listLocal;
	// if(!listLocal){
	// 	listLocal = ["??????????????"]
	// }

	// console.log(`listLocal: ${listLocal}`)
	console.log('favoriteCities: ', favoriteCities);

	renderAddedLocationHTML(favoriteCities, showNowTab, deleteTown)
	showlastCity()
}

function deleteTown(event) {
	let town = event.target.previousSibling.textContent 
	town = town.trim()

	favoriteCities.delete(town)
	toStorage (favoriteCities)
	  
	renderAddedLocation()
}

async function showNowTab(event) {
	let cityName = event.target.textContent

	lastFavoriteViewed(cityName)
	getItem()

	// ?????????? ???????? ???????????? ???? ???????????????? ??????????????
	event.target.classList = "showTown"
	setTimeout(() => event.target.className = "delete__class", 350)
}

async function showlastCity() {
	let cityName = localStorage.getItem('lastCity')
	
	if(!cityName) {
		cityName = '??????????????'
	}

	getItem()
}

// tabNow.addEventListener('click', TabmenuNow)

// function TabmenuNow() {
// 	tabNow.classList = "active"
// }
