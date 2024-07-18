document.addEventListener("DOMContentLoaded", () => {
    const userTab = document.querySelector("[data-userWeather]");
    const searchTab = document.querySelector("[data-searchWeather]");
    const userContainer = document.querySelector(".weather-container");

    const grantAccessContainer = document.querySelector(".grant-location-container");
    const searchForm = document.querySelector("[data-searchForm]");
    const loadingScreen = document.querySelector(".loading-container");
    const userInfoContainer = document.querySelector(".user-info-container");

    // Initially needed variables
    let currentTab = userTab;
    currentTab.classList.add("active-tab"); // Add class for active tab styling
    const API_KEY = "3736f2aa55eb99bb0fbf485a542fd690";
    getFromSessionStorage();

    function switchTab(clickedTab) {
        if (clickedTab !== currentTab) {
            currentTab.classList.remove("active-tab");
            currentTab = clickedTab;
            currentTab.classList.add("active-tab");

            if (!searchForm.classList.contains("active")) {
                // If the search form container is invisible, make it visible
                userInfoContainer.classList.remove("active");
                grantAccessContainer.classList.remove("active");
                searchForm.classList.add("active");
            } else {
                // Switching to the Your Weather tab
                searchForm.classList.remove("active");
                userInfoContainer.classList.remove("active");
                getFromSessionStorage(); // Check local storage for coordinates
            }
        }
    }

    userTab.addEventListener("click", () => {
        switchTab(userTab);
    });

    searchTab.addEventListener("click", () => {
        switchTab(searchTab);
    });

    // Check if coordinates are already present in session storage
    function getFromSessionStorage() {
        const localCoordinates = sessionStorage.getItem("user-coordinates");
        if (!localCoordinates) {
            // If local coordinates not found
            grantAccessContainer.classList.add("active");
        } else {
            const coordinates = JSON.parse(localCoordinates);
            fetchUserWeatherInfo(coordinates);
        }
    }

    async function fetchUserWeatherInfo(coordinates) {
        const { lat, lon } = coordinates;
        grantAccessContainer.classList.remove("active");
        loadingScreen.classList.add("active");

        // API call
        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
            const data = await response.json();

            loadingScreen.classList.remove("active");
            userInfoContainer.classList.add("active");
            renderWeatherInfo(data);
        } catch (err) {
            loadingScreen.classList.remove("active");
            console.error(err);
        }
    }

    function renderWeatherInfo(weatherInfo) {
        const cityName = document.querySelector("[data-cityName]");
        const countryIcon = document.querySelector("[data-countryIcon]");
        const desc = document.querySelector("[data-weatherDesc]");
        const weatherIcon = document.querySelector("[data-WeatherIcon]");
        const temp = document.querySelector("[data-temp]");
        const windSpeed = document.querySelector("[data-windSpeed]");
        const humidity = document.querySelector("[data-humidity]");
        const cloudiness = document.querySelector("[data-cloudiness]");

        console.log(weatherInfo);

        // Fetch values from weatherInfo object and put them in UI elements
        cityName.innerText = weatherInfo.name;
        countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo.sys.country.toLowerCase()}.png`;
        desc.innerText = weatherInfo.weather[0].description;
        weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo.weather[0].icon}.png`;
        temp.innerText = `${weatherInfo.main.temp} °C`;
        windSpeed.innerText = `${weatherInfo.wind.speed} m/s`;
        humidity.innerText = `${weatherInfo.main.humidity} %`;
        cloudiness.innerText = `${weatherInfo.clouds.all} %`;
    }

    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        } else {
            console.log("No geolocation support available");
        }
    }

    function showPosition(position) {
        const userCoordinates = {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
        };

        sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
        fetchUserWeatherInfo(userCoordinates);
    }

    const grantAccessButton = document.querySelector("[data-grantAccess]");
    grantAccessButton.addEventListener("click", getLocation);

    const searchInput = document.querySelector("[data-searchInput]");

    searchForm.addEventListener("submit", (e) => {
        e.preventDefault();
        let cityName = searchInput.value.trim();

        if (cityName === "") return;
        else fetchSearchWeatherInfo(cityName);
    });

    async function fetchSearchWeatherInfo(city) {
        loadingScreen.classList.add("active");
        userInfoContainer.classList.remove("active");
        grantAccessContainer.classList.remove("active");

        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
            );

            const data = await response.json();
            loadingScreen.classList.remove("active");
            userInfoContainer.classList.add("active");
            renderWeatherInfo(data);
        } catch (err) {
            loadingScreen.classList.remove("active");
            console.error(err);
        }
    }
});
