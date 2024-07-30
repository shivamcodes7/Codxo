const apiKey = '7540f8dd88f4ee5fc5d0a0e0afe512f4';

let currentMarker;

function getWeather(lat, lon) {
    console.log(`Fetching weather for coordinates: Latitude ${lat}, Longitude ${lon}`);
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            console.log('Weather data received:', data);
            if (data.cod === 200) {
                const weatherIconClass = getWeatherIconClass(data.weather[0].main);
                const weatherDetails = `
                    <h2>${data.name}, ${data.sys.country}</h2>
                    <p><i class="wi ${weatherIconClass} weather-icon"></i></p>
                    <p>Temperature: ${data.main.temp} °C</p>
                    <p>Weather: ${data.weather[0].description}</p>
                    <p>Humidity: ${data.main.humidity}%</p>
                    <p>Wind Speed: ${data.wind.speed} m/s</p>
                `;
                document.getElementById('weatherDetails').innerHTML = weatherDetails;
            } else {
                document.getElementById('weatherDetails').innerHTML = '<p>City not found. Please try again.</p>';
            }
        })
        .catch(error => {
            document.getElementById('weatherDetails').innerHTML = '<p>Error fetching weather data. Please try again later.</p>';
            console.error('Error fetching weather data:', error);
        });
}

function getWeatherIconClass(weatherMain) {
    switch (weatherMain) {
        case 'Clear':
            return 'wi-day-sunny';
        case 'Clouds':
            return 'wi-cloudy';
        case 'Rain':
            return 'wi-rain';
        case 'Snow':
            return 'wi-snow';
        case 'Thunderstorm':
            return 'wi-thunderstorm';
        case 'Drizzle':
            return 'wi-sprinkle';
        case 'Fog':
            return 'wi-fog';
        default:
            return 'wi-na';
    }
}

document.getElementById('themeToggle').addEventListener('click', function () {
    if (document.body.classList.contains('dark')) {
        document.body.classList.remove('dark');
        this.textContent = 'Switch to Dark Theme';
    } else {
        document.body.classList.add('dark');
        this.textContent = 'Switch to Light Theme';
    }
});

// Initialize the map
const map = L.map('map').setView([20.5937, 78.9629], 5); // Center of India

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Add a marker and weather info on map click
map.on('click', function(e) {
    const { lat, lng } = e.latlng;
   
    // Clear existing marker
    if (currentMarker) {
        map.removeLayer(currentMarker);
    }

    // Add a new marker
    currentMarker = L.marker([lat, lng]).addTo(map);
   
    // Fetch and display weather data for the clicked location
    getWeather(lat, lng);
});

// Function to get the user's current location
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        document.getElementById('weatherDetails').innerHTML = '<p>Geolocation is not supported by this browser.</p>';
    }
}

// Function to handle success in getting the user's location
function showPosition(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    console.log(`User's location: Latitude ${lat}, Longitude ${lon}`);
   
    // Clear existing marker
    if (currentMarker) {
        map.removeLayer(currentMarker);
    }

    // Center the map on the user's location and add a marker
    map.setView([lat, lon], 10);
    currentMarker = L.marker([lat, lon]).addTo(map);
   
    // Fetch and display weather data for the user's location
    getWeather(lat, lon);
}

// Function to handle errors in getting the user's location
function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            document.getElementById('weatherDetails').innerHTML = '<p>User denied the request for Geolocation.</p>';
            break;
        case error.POSITION_UNAVAILABLE:
            document.getElementById('weatherDetails').innerHTML = '<p>Location information is unavailable.</p>';
            break;
        case error.TIMEOUT:
            document.getElementById('weatherDetails').innerHTML = '<p>The request to get user location timed out.</p>';
            break;
        case error.UNKNOWN_ERROR:
            document.getElementById('weatherDetails').innerHTML = '<p>An unknown error occurred.</p>';
            break;
    }
}

// Automatically get the user's current location when the page loads
document.addEventListener('DOMContentLoaded', (event) => {
    getLocation();
});
