const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");

async function checkWeather(city) {
    
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`;
    
    try {
        const geoResponse = await fetch(geoUrl);
        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            document.querySelector(".error").style.display = "block";
            document.querySelector(".weather").style.display = "none";
            return;
        }

        
        const { latitude, longitude, name, country } = geoData.results[0];

        
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto`;
        
        const weatherResponse = await fetch(weatherUrl);
        const weatherData = await weatherResponse.json();

        
        document.querySelector(".city").innerHTML = `${name}, ${country}`;
        document.querySelector(".temp").innerHTML = Math.round(weatherData.current.temperature_2m) + "°C";
        document.querySelector(".humidity").innerHTML = weatherData.current.relative_humidity_2m + "%";
        document.querySelector(".wind").innerHTML = weatherData.current.wind_speed_10m + " km/h";

    
        updateWeatherIcon(weatherData.current.weather_code);

        document.querySelector(".weather").style.display = "block";
        document.querySelector(".error").style.display = "none";

    } catch (error) {
        console.error("Error fetching data:", error);
    }
}


function updateWeatherIcon(code) {
    
    if (code === 0) {
        weatherIcon.src = "clear.png"; 
    } else if (code > 0 && code < 4) {
        weatherIcon.src = "cloudy.jpg";
    } else {
        weatherIcon.src = "rain.png";
    }
}

searchBtn.addEventListener("click", () => {
    checkWeather(searchBox.value);
});


searchBox.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        checkWeather(searchBox.value);
    }
});




