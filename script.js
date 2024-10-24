const geonamesUsername = "muhammadshoaib";
const searchBox = document.getElementById("search-input");
const searchBtn = document.getElementById("searchBtn");
const weatherIcon = document.getElementById("weatherIcon");
const suggestionsList = document.getElementById("suggestions");

import { apiKey } from './config.js';
async function checkWeather(city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?units=metric&q=${city}&appid=${apiKey}`;

  try {
    let response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("City not found or API error");
    }

    const data = await response.json();
    console.log(data);

    document.getElementById("city").innerHTML = data.name;
    document.getElementById("temp").innerHTML = Math.round(data.main.temp) + "°C";
    document.getElementById("wind").innerHTML = data.wind.speed + ' km/h';
    document.getElementById("humidity").innerHTML = data.main.humidity + "%";

    const weatherCondition = data.weather[0].main.toLowerCase();

    switch (weatherCondition) {
      case "clouds":
        weatherIcon.src = './images/clouds.png';
        break;
      case "clear":
        weatherIcon.src = './images/clear.png';
        break;
      case "rain":
        weatherIcon.src = './images/rain.png';
        break;
      case "drizzle":
        weatherIcon.src = './images/drizzle.png';
        break;
      case "mist":
        weatherIcon.src = './images/mist.png';
        break;
      case "snow":
        weatherIcon.src = './images/snow.png';
        break;
      default:
        weatherIcon.src = './images/clouds.png';
        break;
    }

  } catch (error) {
    console.error("Error fetching weather data:", error);
    alert("Unable to fetch weather data. Please check the city name and try again.");
  }
}

async function fetchCitySuggestions(query) {
  const apiUrl = `http://api.geonames.org/searchJSON?name_startsWith=${query}&maxRows=10&username=${geonamesUsername}`;

  try {
    let response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch city data");
    }

    let data = await response.json();
    console.log(data);  // Log data to check the response
    return data.geonames ? data.geonames.map(city => city.name) : [];
  } catch (error) {
    console.error("Error fetching city suggestions:", error);
    return [];
  }
}

searchBtn.addEventListener("click", () => {
  checkWeather(searchBox.value);
});

searchBox.addEventListener("input", async () => {
  const query = searchBox.value.trim();
  if (query.length > 0) {
    console.log("Fetching suggestions for:", query);  // Log query
    const suggestions = await fetchCitySuggestions(query);
    console.log("Suggestions:", suggestions);  // Log suggestions
    suggestionsList.innerHTML = suggestions.map(city => `<li>${city}</li>`).join('');
  } else {
    suggestionsList.innerHTML = '';
  }
});

suggestionsList.addEventListener("click", (event) => {
  if (event.target.tagName === "LI") {
    searchBox.value = event.target.textContent;
    checkWeather(searchBox.value);
    suggestionsList.innerHTML = '';
  }
});
// Add event listener for Enter key press
searchBox.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    event.preventDefault(); // Prevent the default form submission behavior
    checkWeather(searchBox.value);
    suggestionsList.innerHTML = "";
  }
});
// Initialize with New York weather
checkWeather("New York");
