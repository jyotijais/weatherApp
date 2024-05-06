const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".Weather-container");

const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

//initially variables need

let currentTab = userTab;
currentTab.classList.add("tab-container");
const API_KEY = "3736f2aa55eb99bb0fbf485a542fd690";
getfromSessionStorage();

function switchTab(clickedTab) {
    if(clickedTab != currentTab){
        currentTab.classList.remove("tab-container");
        currentTab = clickedTab;
        currentTab.classList.add("tab-container");

        if(!searchForm.classList.contains("active")){
            //kya searchForm wla container is invisible, if yes then make it visible
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
            //mai pehle search wale tab pr tha, ab your weather tab visible krna hai
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            //ab mai your weather tab me agya hu,toh weather bhi display krna prega,so let's check local storage first
            //for coordinates, if we have saved them there
            getfromSessionStorage();
        }

    }
}

userTab.addEventListener("click", () => {
    switchTab(userTab);
});

searchTab.addEventListener("click", () => {
    switchTab(searchTab);
});

//check if coordinates are already present in the session storage
function getfromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates) {
        //agar local coordinates nhi mile
        grantAccessContainer.classList.add("active");
    }
    else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates) {
    const{lat, lon} = coordinates;
    //make grant access containner invisible
    grantAccessContainer.classList.remove("active");
    //make loader visible
    loadingScreen.classList.add("active");

    //API CALL
    try{
            const response = await fetch('https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric');
            const data = await response.json();

            loadingScreen.classList.remove("active");
            userInfoContainer.classList.add("active");
            renderWeatherInfo(data);

    }

    catch(err){
            loadingScreen.classList.remove("active");
            //HW
    }

}

function renderWeatherInfo(weatherInfo){
    //firstly, we have to fetch the elements

    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[ data-WeatherIcon]")
    const temp = document.querySelector("[data-temp]");
    const windSpeed = document.querySelector("[data-windSpeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    console.log(weatherInfo);

    //fetch values from weatherInfo object and put it UI elements
    cityName.innerText = weatherInfo?.name;
    countryIcon.src = 'https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png';
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = 'http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png';
    temp.innerText = `${weatherInfo?.main?.temp} °C `;
    windSpeed.innerText = `${weatherInfo?.wind?.speed} m/s `;
    humidity.innerText =`${ weatherInfo?.main?.humidity} % `;
    cloudiness.innerText =`${weatherInfo?.clouds?.all} % ` ;


}

function getLocation() {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        console.log("no geolocation support available");
    }
}

function showPosition(position){

    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}



const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation);

const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let cityName = searchInput.ariaValueMax;

    if(cityName === "")
    return;
    else
    fetchSearchWeatherInfo(cityName);
})

async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try{
        const response = await fetch(
            'https://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}&units=metric'
        );

        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.remove("active");
        renderWeatherInfo(data);
    }
    catch(err){

    }

}
