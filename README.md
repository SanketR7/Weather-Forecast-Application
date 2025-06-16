# 🌤️ Weather Forecast Application

A modern, responsive weather application built with HTML, CSS (Tailwind), and JavaScript. Get current weather conditions and 5-day forecasts for any location worldwide without requiring API keys.

![Weather App Screenshot](https://github.com/user-attachments/assets/1ca98f61-1fef-412c-9517-c5936b80782e)


## ✨ Features

### 🔍 **Location Search**
- Search weather by city name with real-time validation
- Current location detection using GPS
- Recently searched cities dropdown for quick access
- Input validation with user-friendly error messages

### 🌡️ **Weather Information**
- **Current Weather**: Temperature, humidity, wind speed, visibility, pressure
- **5-Day Forecast**: Daily predictions with weather icons
- **Weather Icons**: Visual representation of weather conditions
- **Responsive Design**: Works on desktop, tablet, and mobile devices

### 🎨 **Modern UI/UX**
- Glass morphism design with gradient backgrounds
- Smooth animations and loading states
- Interactive elements with hover effects
- Error handling with visual feedback


## 🛠️ Technologies Used

- **HTML5** - Semantic markup structure
- **CSS3** - Styling with Tailwind CSS framework
- **JavaScript (ES6+)** - Interactive functionality and API integration
- **Open-Meteo API** - Free weather data service (no API key required)
- **Geolocation API** - Current location detection

## 📋 Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection for weather data
- HTTPS connection for geolocation features


## 📖 Usage Guide

### 🔍 **Searching for Weather**
1. **By City Name**: 
   - Enter city name in the search box
   - Click "Search" button or press Enter
   - View current weather and 5-day forecast

2. **By Current Location**: 
   - Click "Current Location" button
   - Allow location access when prompted
   - Weather data will load automatically

3. **Recent Searches**: 
   - Click on the search input to see recently searched cities
   - Click any city from the dropdown to get its weather

### 📊 **Understanding Weather Data**
- **Temperature**: Current temperature and "feels like" temperature
- **Humidity**: Relative humidity percentage
- **Wind Speed**: Wind speed in km/h
- **Visibility**: How far you can see in kilometers
- **Pressure**: Atmospheric pressure in hPa
- **5-Day Forecast**: Daily high/low temperatures with conditions


## 🌐 API Information

### Open-Meteo API
- **Base URL**: `https://api.open-meteo.com/v1`
- **Geocoding**: `https://geocoding-api.open-meteo.com/v1`
- **No API Key Required**: Free service with no registration
- **Rate Limit**: 10,000 requests per day
- **Data Coverage**: Worldwide weather data

### API Endpoints Used
```javascript
// Current weather and forecast
GET /forecast?latitude={lat}&longitude={lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,visibility,surface_pressure&daily=weather_code,temperature_2m_max,temperature_2m_min,relative_humidity_2m_max,wind_speed_10m_max

// Geocoding (city to coordinates)
GET /search?name={city_name}&count=1&language=en&format=json
```

## 📱 Browser Compatibility

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 70+ | ✅ Fully Supported |
| Firefox | 65+ | ✅ Fully Supported |
| Safari | 12+ | ✅ Fully Supported |
| Edge | 79+ | ✅ Fully Supported |
| Opera | 57+ | ✅ Fully Supported |


## 👨‍💻 Author

**Your Name**
- GitHub: SAnketr7
- Email: sanketrg5@example.com
