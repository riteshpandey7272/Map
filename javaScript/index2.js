// For Days and Date
var daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

var dayCells = document.querySelectorAll('.days');

var today = new Date();
var dayOfWeek = today.getDay();
var date = today.getDate();

for (var i = 0; i < dayCells.length; i++) {
  if (i > 4) {
    dayCells[i].style.display = "none";
  } else {
    dayCells[i].textContent = daysOfWeek[dayOfWeek] + ' ' + date;
    dayOfWeek = (dayOfWeek + 1) % 7;
    date = (date < 30) ? (date + 1) : 1; 
  }
}



// hour
const now = new Date();
// const hours = now.getHours();
// const minutes = now.getMinutes();
// const seconds = now.getSeconds();


// const hourArray = [];
// const daysToShow = 4; 
// const hoursPerDay = 24; 
// const gapBetweenDays = 3; 

// for (let day = 0; day < daysToShow; day++) {
//   for (let hour = 7; hour <= 30; hour += 3) {
//     const formattedHour = (hour + day * gapBetweenDays) % hoursPerDay;
//     let displayHour = formattedHour % 12 === 0 ? 12 : formattedHour % 12;
//     const period = formattedHour >= 12 ? 'PM' : 'AM';
//     hourArray.push(`${displayHour} <span style="font-size: 0.7em">${period}</span>`);
//   }


//   hourArray.push('<span style="font-size: 0.8em; margin: 20px">   </span>');
// }


// const formattedHours = hourArray.join(' ');


// const currentTimeElement = document.getElementById("current-time");
// currentTimeElement.innerHTML = `${formattedHours}`;





// Temperature
const apiKey = "7d3a8f1edb50267eca4ccdadb3d22f10";
const apiUrl = "https://api.openweathermap.org/data/2.5/forecast";

// For latitude and longitude of current location
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(success, error);
} else {
  console.error("Geolocation is not supported by your browser.");
}

function success(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;

  fetch(`${apiUrl}?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`)
    .then(response => response.json())
    .then(data => {
      const forecastData = data.list
        .filter(item => {
          const date = new Date(item.dt_txt);
          const currentDay = new Date();
          const nextFourDays = new Date(currentDay.getTime() + (4 * 24 * 60 * 60 * 1000));
          return date >= currentDay && date < nextFourDays && date.getHours() % 3 === 0;
        })
        .map(item => Math.round(item.main.temp));

      const forecastElement = document.getElementById("forecast");
      const formattedForecastData = formatForecastData(forecastData);
      forecastElement.innerHTML = formattedForecastData;
    })
    .catch(error => {
      console.error(error);
      const forecastElement = document.getElementById("forecast");
      forecastElement.textContent = "Failed to find forecast data.";
    });
}

function error() {
  console.error("Failed to get current location.");
  const forecastElement = document.getElementById("forecast");
  forecastElement.textContent = "Failed to find forecast data.";
}


/// wind temperature and wind_direction
function success(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;

  fetch(`${apiUrl}?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`)
    .then(response => response.json())
    .then(data => {
      const forecastData = data.list
        .filter(item => {
          const date = new Date(item.dt_txt);
          const currentDay = new Date();
          const nextFourDays = new Date(currentDay.getTime() + (4 * 24 * 60 * 60 * 1000));
          return date >= currentDay && date < nextFourDays && date.getHours() % 3 === 0;
        })
        .map(item => {
          const temperature = Math.round(item.main.temp);
          const windSpeedMPS = item.wind.speed;
          const windSpeedKT = Math.round(windSpeedMPS * 1.94384);
          const windDirection = item.wind.deg;
          const windGustMPS = item.wind.gust;
          const windGustKT = windGustMPS ? Math.round(windGustMPS * 1.94384) : "";
          const rain = item.rain && item.rain["3h"] ? item.rain["3h"] : 0;
          const weatherIcon = item.weather[0].icon;
          return { temperature, windSpeedKT, windDirection, windGustKT, rain, weatherIcon };
        });

      const forecastElement = document.getElementById("forecast");
      const formattedForecastData = formatForecastData(forecastData);
      forecastElement.innerHTML = formattedForecastData;

      // Generate and display the current time and formatted hours
      const hourArray = [];
      const daysToShow = 4; // Number of days to show
      const hoursPerDay = 24; // Hours in a day
      const gapBetweenDays = 3; // Gap between days in hours

      for (let day = 0; day < daysToShow; day++) {
        for (let hour = 7; hour <= 30; hour += 3) {
          const formattedHour = (hour + day * gapBetweenDays) % hoursPerDay;
          let displayHour = formattedHour % 12 === 0 ? 12 : formattedHour % 12;
          const period = formattedHour >= 12 ? 'PM' : 'AM';
          hourArray.push(`<span class="formatted-hour">${displayHour} <span class="period">${period}</span></span>`);
        }
      }

      // Format the hours as a string
      // Format the hours as a string
      const formattedHours = `<span class="formatted-hours">${hourArray.join(' ')}</span>`;

      const currentTimeElement = document.getElementById("current-time");
      currentTimeElement.innerHTML = `${formattedHours}`;

    })
    .catch(error => {
      console.error(error);
      const forecastElement = document.getElementById("forecast");
      forecastElement.textContent = "Failed to find forecast data.";
    });
}

function formatForecastData(data) {
  let temperatureData = "";
  let windSpeedData = "";
  let windDirectionData = "";
  let windGustData = "";
  let rainData = "";
  let weatherIconData = "";

  data.forEach((entry, index) => {
    const { temperature, windSpeedKT, windDirection, windGustKT, rain, weatherIcon } = entry;

    weatherIconData += `<img src="http://openweathermap.org/img/wn/${weatherIcon}.png" alt="Weather Icon">`;
    temperatureData += `${temperature}°`;
    windSpeedData += `${windSpeedKT}`;
    windDirectionData += `<img src="./icons/arrow.png" class="arrow-icon" style="transform: rotate(${windDirection}deg);" alt="">`;
    windGustData += windGustKT ? `${windGustKT}` : "";
    rainData += `${rain}`;

    if (index < data.length - 1) {
      temperatureData += " ";
      windSpeedData += " ";
      windDirectionData += " ";
      windGustData += " ";
      rainData += " ";
      weatherIconData += " ";
    }
  });

  let formattedData = `<div class="weather-icons">${weatherIconData}</div>`;
  formattedData += `<div class="tm">${temperatureData}</div>`;
  formattedData += `<div class="rain">${rainData}</div>`;
  formattedData += `<div class="wind">${windSpeedData}</div>`;
  formattedData += `<div class="gusts" style="">${windGustData}</div>`;
  formattedData += `<div class="windD">${windDirectionData}</div>`;

  return formattedData;
}













// // About location
function showPosition(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  const apiKey = "7d3a8f1edb50267eca4ccdadb3d22f10";
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      const locationElement = document.getElementById("location");
      locationElement.textContent = `Current location: ${data.name}, ${data.sys.country}`;

      // const sunriseElement = document.createElement("p");
      // const sunriseTimestamp = data.sys.sunrise * 1000;
      // const sunriseDate = new Date(sunriseTimestamp);
      // sunriseElement.textContent = `Sunrise: ${sunriseDate.toLocaleTimeString()}`;
      // locationElement.insertAdjacentElement("afterend", sunriseElement);

      // const sunsetElement = document.createElement("p");
      // const sunsetTimestamp = data.sys.sunset * 1000;
      // const sunsetDate = new Date(sunsetTimestamp);
      // sunsetElement.textContent = `Sunset: ${sunsetDate.toLocaleTimeString()}`;
      // locationElement.insertAdjacentElement("afterend", sunsetElement);

      // const duskElement = document.createElement("p");
      // const duskTimestamp = data.sys.sunset * 1000 + 1800000;
      // const duskDate = new Date(duskTimestamp);
      // duskElement.textContent = `Dusk: ${duskDate.toLocaleTimeString()}`;
      // locationElement.insertAdjacentElement("afterend", duskElement);

      // const elevationElement = document.createElement("p");
      // elevationElement.textContent = `Elevation: ${data.main.sea_level || data.main.grnd_level} m`;
      // locationElement.insertAdjacentElement("afterend", elevationElement);
    })
    .catch(error => {
      console.error(error);
      const locationElement = document.getElementById("location");
      locationElement.textContent = "Failed to find location.";
    });
}

function showError(error) {
  console.error(error);
  const locationElement = document.getElementById("location");
  locationElement.textContent = "Failed to find location.";
}

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(showPosition, showError);
} else {
  const locationElement = document.getElementById("location");
  locationElement.textContent = "Location is not supported by your browser.";
}


// Function to remove the loading image
function removeLoadingImage() {
  var loadingImg = document.getElementById('loading-img');
  loadingImg.parentNode.removeChild(loadingImg);
}





// const windElement = document.createElement("p");
      // windElement.textContent = `Wind: ${data.wind.speed} m/s, ${data.wind.deg}°`;
      // locationElement.insertAdjacentElement("afterend", windElement);