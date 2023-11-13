const apiKey = '4b9003adf8523264e0d88c73fd217e82';
const form = document.querySelector('form');
const cityInput = document.querySelector('#city');
const currentWeatherSection = document.querySelector('#current-weather');
const forecastSection = document.querySelector('#forecast');
const searchHistorySection = document.querySelector('#search-history');
let searchHistory = [];

// Function to get weather data for a city and display it to the user
function getWeatherData(city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      // Parse the JSON response and display the weather data to the user
      const cityName = data.name;
      const date = new Date(data.dt * 1000).toLocaleDateString();
      const iconUrl = `https://openweathermap.org/img/w/${data.weather[0].icon}.png`;
      const temperature = data.main.temp;
      const humidity = data.main.humidity;
      const windSpeed = data.wind.speed;

      currentWeatherSection.innerHTML = `
        <h2>${cityName} (${date}) <img src="${iconUrl}" alt="${data.weather[0].description}"></h2>
        <p>Temperature: ${temperature} °C</p>
        <p>Humidity: ${humidity}%</p>
        <p>Wind Speed: ${windSpeed} m/s</p>
      `;
    })
    .catch(error => {
      console.error(error);
    });

    const forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    fetch(forecastApiUrl)
      .then(response => response.json())
      .then(data => {
        // Parse the JSON response and display the forecast data to the user
        const forecastData = data.list.filter(item => item.dt_txt.includes('12:00:00'));
        let forecastHtml = '<h2>5-Day Forecast:</h2><div class="forecast-container">';
  
        forecastData.forEach(item => {
          const date = new Date(item.dt * 1000).toLocaleDateString();
          const iconUrl = `https://openweathermap.org/img/w/${item.weather[0].icon}.png`;
          const temperature = item.main.temp;
          const humidity = item.main.humidity;
          const windSpeed = item.wind.speed;
  
          forecastHtml += `
            <div class="forecast-item">
              <h3>${date}</h3>
              <img src="${iconUrl}" alt="${item.weather[0].description}">
              <p>Temperature: ${temperature} °C</p>
              <p>Humidity: ${humidity}%</p>
              <p>Wind Speed: ${windSpeed} m/s</p>
            </div>
          `;
        });
  
        forecastHtml += '</div>';
        forecastSection.innerHTML = forecastHtml;
      })
      .catch(error => {
        console.error(error);
      });

        // Add the city to the search history
  searchHistory.push(city);
  const searchHistoryHtml = searchHistory.map(item => `<button>${item}</button>`).join('');
  searchHistorySection.innerHTML = `<h2>Search History:</h2>${searchHistoryHtml}`;
}

// Handle form submission
form.addEventListener('submit', event => {
  event.preventDefault();
  const city = cityInput.value.trim();
  if (city) {
    getWeatherData(city);
    cityInput.value = '';
  }
});

// Handle search history button click
searchHistorySection.addEventListener('click', event => {
  if (event.target.tagName === 'BUTTON') {
    const city = event.target.textContent;
    getWeatherData(city);
  }
});









//GIVEN a weather dashboard with form inputs
//WHEN I search for a city
//THEN I am presented with current and future conditions for that city and that city is added to the search history
// When I view current weather conditions for that city
//THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, and the wind speed
//WHEN I view future weather conditions for that city
//THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
//WHEN I click on a city in the search history
//THEN I am again presented with current and future conditions for that city