let openWmApiKey = config.openWmApiKey;
let positionStackApiKey = config.positionStackApiKey;

let formattedLocation = '';
let latitude = '';
let longitude = '';
let units = '';

(function () {
  let weather = document.querySelector('.weather');
  let temperature = document.querySelector('.weather__temperature');
  let unit = document.querySelector('.weather__unit');
  let condition = document.querySelector('.weather__condition');
  let conditionText = document.querySelector('.weather__condition-text');
  let location = document.querySelector('.weather__location');

  chrome.storage.sync.get({
    weather: {}
  }, function (options) {
    if (options.weather.show) {
      units = options.weather.units;
      formattedLocation = options.weather.location;

      latitude = options.weather.latitude;
      longitude = options.weather.longitude;

      if (!!latitude && !!longitude) {
        fetchWeather();
      } else {
        // Get Lat & Long from Formatted Location.
        fetch(`http://api.positionstack.com/v1/forward?access_key=${positionStackApiKey}&query=${formattedLocation}`)
          .then(response => response.json().then(data => ({ status: response.status, data })))
          .then((response) => {
            latitude = response.data.data[0].latitude;
            longitude = response.data.data[0].longitude;
          }).then(() => {
            fetchWeather();
          })
          .catch((error) => {
            console.error(error);
            alert('Error getting location information.');
          });
      }
    }
  });

  function fetchWeather() {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=${units}&appid=${openWmApiKey}`)
      .then(response => response.json().then(data => ({ status: response.status, data })))
      .then((response) => {
        weather.classList.add('active');
        updateWeather(response.data, units);
      })
      .catch((error) => {
        console.error(error);
        alert('Error getting weather information.');
      });
  }

  function updateWeather(data, units) {
    temperature.innerHTML = data.main.temp.toString().split('.')[0] + '&deg;';
    unit.innerHTML = parseUnits(units);
    condition.classList.add('icon-' + data.weather[0].icon); // Need to use OWM icons, from here: https://openweathermap.org/weather-conditions
    conditionText.innerHTML = data.weather[0].description;
    printLocation().then(res => location.innerHTML = res);
  }

  async function printLocation() {
    if (Number(formattedLocation.split(',')[0])) {
      return fetch(`http://api.positionstack.com/v1/reverse?access_key=${positionStackApiKey}&query=${latitude},${longitude}`)
        .then(T => T.json())
        .then(response => response.data[0].county + ', ' + response.data[0].region)
    } else {
      return formattedLocation;
    }
  }

  function parseUnits(units) {
    if (units === 'metric') {
      return 'c'
    } else {
      return 'f'
    }
  }
})();