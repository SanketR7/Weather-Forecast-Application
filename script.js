// Global variables
let recentCities = [];
const API_BASE_URL = "https://api.open-meteo.com/v1";
const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1";

// Weather condition mapping
const weatherConditions = {
  0: { icon: "☀️", description: "Clear sky" },
  1: { icon: "🌤️", description: "Mainly clear" },
  2: { icon: "⛅", description: "Partly cloudy" },
  3: { icon: "☁️", description: "Overcast" },
  45: { icon: "🌫️", description: "Fog" },
  48: { icon: "🌫️", description: "Depositing rime fog" },
  51: { icon: "🌦️", description: "Light drizzle" },
  53: { icon: "🌦️", description: "Moderate drizzle" },
  55: { icon: "🌦️", description: "Dense drizzle" },
  56: { icon: "🌦️", description: "Light freezing drizzle" },
  57: { icon: "🌦️", description: "Dense freezing drizzle" },
  61: { icon: "🌧️", description: "Slight rain" },
  63: { icon: "🌧️", description: "Moderate rain" },
  65: { icon: "🌧️", description: "Heavy rain" },
  66: { icon: "🌧️", description: "Light freezing rain" },
  67: { icon: "🌧️", description: "Heavy freezing rain" },
  71: { icon: "🌨️", description: "Slight snow fall" },
  73: { icon: "🌨️", description: "Moderate snow fall" },
  75: { icon: "🌨️", description: "Heavy snow fall" },
  77: { icon: "🌨️", description: "Snow grains" },
  80: { icon: "🌦️", description: "Slight rain showers" },
  81: { icon: "🌦️", description: "Moderate rain showers" },
  82: { icon: "🌦️", description: "Violent rain showers" },
  85: { icon: "🌨️", description: "Slight snow showers" },
  86: { icon: "🌨️", description: "Heavy snow showers" },
  95: { icon: "⛈️", description: "Thunderstorm" },
  96: { icon: "⛈️", description: "Thunderstorm with slight hail" },
  99: { icon: "⛈️", description: "Thunderstorm with heavy hail" },
};

// DOM elements
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const currentLocationBtn = document.getElementById("currentLocationBtn");
const errorMessage = document.getElementById("errorMessage");
const loadingSpinner = document.getElementById("loadingSpinner");
const currentWeather = document.getElementById("currentWeather");
const forecastSection = document.getElementById("forecastSection");
const recentCitiesDropdown = document.getElementById("recentCitiesDropdown");

// Initialize app
document.addEventListener("DOMContentLoaded", function () {
  loadRecentCities();
  setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
  searchBtn.addEventListener("click", handleSearch);
  currentLocationBtn.addEventListener("click", getCurrentLocation);
  cityInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      handleSearch();
    }
  });
  cityInput.addEventListener("focus", showRecentCities);
  document.addEventListener("click", function (e) {
    if (
      !e.target.closest("#cityInput") &&
      !e.target.closest("#recentCitiesDropdown")
    ) {
      hideRecentCities();
    }
  });
}

// Validation function
function validateInput(city) {
  if (!city.trim()) {
    showError("Please enter a city name");
    return false;
  }
  if (city.trim().length < 2) {
    showError("City name must be at least 2 characters long");
    return false;
  }
  if (!/^[a-zA-Z\s\-'.,]+$/.test(city.trim())) {
    showError(
      "Please enter a valid city name (letters, spaces, hyphens, and apostrophes only)"
    );
    return false;
  }
  return true;
}

// Handle search
async function handleSearch() {
  const city = cityInput.value.trim();

  if (!validateInput(city)) {
    cityInput.classList.add("error-shake");
    setTimeout(() => cityInput.classList.remove("error-shake"), 500);
    return;
  }

  hideError();
  showLoading();

  try {
    const coords = await getCoordinates(city);
    await getWeatherData(coords.lat, coords.lon, city);
    addToRecentCities(city);
    cityInput.value = "";
    hideRecentCities();
  } catch (error) {
    console.error("Search error:", error);
    showError(
      error.message || "Failed to fetch weather data. Please try again."
    );
  } finally {
    hideLoading();
  }
}

// Get current location
function getCurrentLocation() {
  if (!navigator.geolocation) {
    showError("Geolocation is not supported by this browser");
    return;
  }

  hideError();
  showLoading();

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      try {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const city = await getCityName(lat, lon);
        await getWeatherData(lat, lon, city);
        addToRecentCities(city);
      } catch (error) {
        console.error("Current location error:", error);
        showError("Failed to get weather for current location");
      } finally {
        hideLoading();
      }
    },
    (error) => {
      hideLoading();
      let errorMsg = "Failed to get your location. ";
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMsg += "Please allow location access.";
          break;
        case error.POSITION_UNAVAILABLE:
          errorMsg += "Location information unavailable.";
          break;
        case error.TIMEOUT:
          errorMsg += "Location request timed out.";
          break;
        default:
          errorMsg += "Unknown error occurred.";
      }
      showError(errorMsg);
    }
  );
}

// Get coordinates from city name
async function getCoordinates(city) {
  try {
    const response = await fetch(
      `${GEOCODING_URL}/search?name=${encodeURIComponent(
        city
      )}&count=1&language=en&format=json`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      throw new Error(
        `City "${city}" not found. Please check the spelling and try again.`
      );
    }

    return {
      lat: data.results[0].latitude,
      lon: data.results[0].longitude,
    };
  } catch (error) {
    throw new Error(error.message || "Failed to find city location");
  }
}

// Get city name from coordinates
async function getCityName(lat, lon) {
  try {
    const response = await fetch(
      `${GEOCODING_URL}/search?latitude=${lat}&longitude=${lon}&count=1&language=en&format=json`
    );
    const data = await response.json();

    if (data.results && data.results.length > 0) {
      return data.results[0].name;
    }
    return "Your Location";
  } catch (error) {
    return "Your Location";
  }
}

// Get weather data
async function getWeatherData(lat, lon, city) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,visibility,surface_pressure&daily=weather_code,temperature_2m_max,temperature_2m_min,relative_humidity_2m_max,wind_speed_10m_max&timezone=auto&forecast_days=6`
    );

    if (!response.ok) {
      throw new Error(`Weather API error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.current || !data.daily) {
      throw new Error("Invalid weather data received");
    }

    displayCurrentWeather(data, city);
    displayForecast(data);
  } catch (error) {
    throw new Error(error.message || "Failed to fetch weather data");
  }
}

// Display current weather
function displayCurrentWeather(data, city) {
  const current = data.current;
  const condition =
    weatherConditions[current.weather_code] || weatherConditions[0];

  document.getElementById("currentCity").textContent = city;
  document.getElementById("currentDate").textContent =
    new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  document.getElementById("currentWeatherIcon").textContent = condition.icon;
  document.getElementById("currentTemp").textContent = `${Math.round(
    current.temperature_2m
  )}°C`;
  document.getElementById("currentDescription").textContent =
    condition.description;
  document.getElementById("feelsLike").textContent = `${Math.round(
    current.apparent_temperature
  )}°C`;
  document.getElementById(
    "currentHumidity"
  ).textContent = `${current.relative_humidity_2m}%`;
  document.getElementById("currentWindSpeed").textContent = `${Math.round(
    current.wind_speed_10m
  )} km/h`;
  document.getElementById("currentVisibility").textContent = `${Math.round(
    current.visibility / 1000
  )} km`;
  document.getElementById("currentPressure").textContent = `${Math.round(
    current.surface_pressure
  )} hPa`;

  currentWeather.classList.remove("hidden");
}

// Display 5-day forecast
function displayForecast(data) {
  const daily = data.daily;
  const container = document.getElementById("forecastContainer");
  container.innerHTML = "";

  // Skip today (index 0) and show next 5 days
  for (let i = 1; i <= 5; i++) {
    const date = new Date(daily.time[i]);
    const condition =
      weatherConditions[daily.weather_code[i]] || weatherConditions[0];

    const forecastCard = document.createElement("div");
    forecastCard.className =
      "bg-white/10 rounded-lg p-4 text-center hover:bg-white/20 transition-all duration-300";
    forecastCard.innerHTML = `
               <div class="text-sm font-medium mb-2">${date.toLocaleDateString(
                 "en-US",
                 { weekday: "short", month: "short", day: "numeric" }
               )}</div>
               <div class="small-weather-icon mb-2">${condition.icon}</div>
               <div class="text-lg font-semibold mb-1">${Math.round(
                 daily.temperature_2m_max[i]
               )}°</div>
               <div class="text-sm opacity-80 mb-2">${Math.round(
                 daily.temperature_2m_min[i]
               )}°</div>
               <div class="text-xs opacity-70 mb-1">💧 ${
                 daily.relative_humidity_2m_max[i]
               }%</div>
               <div class="text-xs opacity-70">💨 ${Math.round(
                 daily.wind_speed_10m_max[i]
               )} km/h</div>
           `;

    container.appendChild(forecastCard);
  }

  forecastSection.classList.remove("hidden");
}

// Recent cities management
function loadRecentCities() {
  // Since we can't use localStorage, we'll just keep an empty array
  // In a real application, you would load from localStorage here
  recentCities = [];
}

function addToRecentCities(city) {
  if (!recentCities.includes(city)) {
    recentCities.unshift(city);
    if (recentCities.length > 5) {
      recentCities.pop();
    }
    updateRecentCitiesDisplay();
  }
}

function updateRecentCitiesDisplay() {
  const list = document.getElementById("recentCitiesList");
  list.innerHTML = "";

  recentCities.forEach((city) => {
    const item = document.createElement("div");
    item.className =
      "px-3 py-2 hover:bg-white/20 rounded cursor-pointer transition-colors";
    item.textContent = city;
    item.addEventListener("click", () => {
      cityInput.value = city;
      hideRecentCities();
      handleSearch();
    });
    list.appendChild(item);
  });
}

function showRecentCities() {
  if (recentCities.length > 0) {
    updateRecentCitiesDisplay();
    recentCitiesDropdown.classList.remove("hidden");
    recentCitiesDropdown.classList.add("dropdown-enter-active");
  }
}

function hideRecentCities() {
  recentCitiesDropdown.classList.add("hidden");
  recentCitiesDropdown.classList.remove("dropdown-enter-active");
}

// Utility functions
function showError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.remove("hidden");
  setTimeout(() => {
    hideError();
  }, 5000);
}

function hideError() {
  errorMessage.classList.add("hidden");
}

function showLoading() {
  loadingSpinner.classList.remove("hidden");
  currentWeather.classList.add("hidden");
  forecastSection.classList.add("hidden");
}

function hideLoading() {
  loadingSpinner.classList.add("hidden");
}
