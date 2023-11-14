// Holds Api Key
const apiKey = '3252b9f33af38ef675dd5ad36e6f7d26'; // API Key


// Function to fetch weather data from OpenWeatherMap API
async function getWeatherData(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        return null;
    }
}

// Function to handle the search button click event
async function searchWeather() {
    const cityInput = document.getElementById('city-input');
    const city = cityInput.value.trim();

    if (city) {
        // Fetch current weather data
        const currentWeather = await getWeatherData(city);
        updateCurrentWeather(currentWeather);

        // Fetch 5-day forecast data
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`;
        const forecastResponse = await fetch(forecastUrl);
        const forecastData = await forecastResponse.json();
        updateForecast(forecastData);
    } else {
        alert('Please enter a city name.');
    }
}

// Function to update the current weather section in the UI
function updateCurrentWeather(weatherData) {
    const currentWeatherElement = document.getElementById('current-weather');
    
    // Check if data is available
    if (weatherData) {
        const { name, main, weather, wind } = weatherData;
        const html = `
            <h2>${name} - ${weather[0].description}</h2>
            <p>Temperature: ${main.temp}°F</p>
            <p>Humidity: ${main.humidity}%</p>
            <p>Wind Speed: ${wind.speed} mph</p>
        `;
        currentWeatherElement.innerHTML = html;
    } else {
        currentWeatherElement.innerHTML = '<p>Unable to fetch weather data.</p>';
    }
}

function updateForecast(forecastData) {
    const futureWeatherElement = document.getElementById('future-weather');

    // Check if data is available
    if (forecastData && forecastData.list) {
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);  // Set hours, minutes, seconds, and milliseconds to 0

        const html = forecastData.list.filter(day => {
            // Filter out items for the current day and any past days
            const date = new Date(day.dt_txt);
            date.setHours(0, 0, 0, 0);  // Set hours, minutes, seconds, and milliseconds to 0
            return date > currentDate;
        }).slice(0, 5).map(day => {
            const date = new Date(day.dt_txt);
            return `
                <div class="forecast-item">
                    <p>Date: ${date.toLocaleDateString()}</p>
                    <p>Temperature: ${day.main.temp}°F</p>
                    <p>Humidity: ${day.main.humidity}%</p>
                    <p>Wind Speed: ${day.wind.speed} mph</p>
                </div>
            `;
        }).join('');
        futureWeatherElement.innerHTML = html;
    } else {
        futureWeatherElement.innerHTML = '<p>Unable to fetch forecast data.</p>';
    }
}








