const getLocalTime = sec => new Date(sec * 1000)
  .toLocaleTimeString('en-US', {hour: 'numeric', minute: 'numeric'})
  .toLowerCase();

const formatWeather = (weatherData) => {
  const { name, sys, weather, main, wind, dt, coord } = weatherData;
  const localTime = getLocalTime(dt);

  return `
    <h2>${name}, ${sys.country}</h2>
    <p>Local Time: ${localTime}</p>
    <p>Temperature: ${main.temp}&deg;F (Feels like ${main.feels_like}&deg;F)</p>
    <p>Weather: ${weather[0].description}</p>
    <p>Wind Speed: ${wind.speed} m/s</p>
    <p>Coordinates: (${coord.lat}, ${coord.lon})</p>
    <p>Map: <a href="https://www.google.com/maps/search/?api=1&query=${coord.lat},${coord.lon}" target="_blank">Click to view map</a></p>
    <img src="https://openweathermap.org/img/wn/${weather[0].icon}@2x.png" alt="Weather icon">
  `;
};

const handleWeatherSearch = async (event) => {
  event.preventDefault();
  
  const query = document.querySelector('#weather-search').value.trim();
  const weatherDiv = document.querySelector('#weather');

  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${query}&units=imperial&appid=786b7802dbc6511e00351083ed25303e`);
    const weatherData = await response.json();

    if (weatherData.cod !== 200) {
      weatherDiv.innerHTML = `<p>Location not found</p>`;
      document.querySelector('#weather-search').value = ''; 
    } else {
      
      weatherDiv.innerHTML = '';

      const formattedWeather = formatWeather(weatherData);
      weatherDiv.innerHTML = formattedWeather;
      document.querySelector('#weather-search').value = ''; 
    }
  } catch (error) {
    console.error('Error fetching weather data:', error);
    weatherDiv.innerHTML = `<p>Failed to fetch weather data</p>`;
  }
};

const weatherForm = document.querySelector('#weather-app form');
weatherForm.addEventListener('submit', handleWeatherSearch);
