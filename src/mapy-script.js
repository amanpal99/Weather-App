// DOM Elements
const city = document.querySelector(".loc");
const icon = document.querySelector(".icon");
const temp = document.querySelector(".temp");
// const desc = document.querySelector(".desc");
const windSpeed = document.querySelector(".w-speed");
const humid = document.querySelector(".h-perc");

// variables
let map;

//////////////////////////////////
/////// Events

////////////////////////////////////////////////////
///////////////// WeatherData API

// DisplayData
const displayData = function (data) {
  const stat = data.current;
  console.log(stat);
  city.textContent = data.location.name;
  let icon1 = stat.condition.icon;
  console.log(`ICON_ID: ${icon1}`);
  icon.src = `${icon1}`;
  temp.textContent = stat.temp_c;
  // desc.textContent = stat.condition.text;
  windSpeed.textContent = `${stat.wind_kph} km/h`;
  humid.textContent = stat.humidity;

  // icon1.slice(-1) === "n" ? nightSetting() : daySetting();
};

// getWeatherData - POS
const getWeatherByPos = async function (lat, lng) {
  try {
    const url = `http://api.weatherapi.com/v1/current.json?key=86342f1499524d6b98462926211312&q=${[
      lat,
      lng,
    ].join(",")}`;
    const res = await fetch(url);
    if (!res) throw new Error("No data about Location");
    const data = await res.json();
    return data;
  } catch (err) {
    console.error(`Error: ${err.message}`);
  }
};

// getWeatherData - LOCATION
const getWeatherByLoc = async function (location) {
  try {
    const url = `http://api.weatherapi.com/v1/current.json?key=86342f1499524d6b98462926211312&q=${location}`;
    const res = await fetch(url);
    if (!res) throw new Error("No data about Location");
    const data = await res.json();
    displayData(data);
  } catch (err) {
    console.error(`Error: ${err.message}`);
  }
};

/////////////////////////////////////////////////////////////////
////////////////////// Map API

// Load Map

const markerClicked = async function (lat, lng) {
  try {
    const data = await getWeatherByPos(lat, lng);
    city.textContent = data.location.name;
  } catch (err) {
    console.error(`Error: ${err.message}`);
  }
};

const mapMarker = async function (coords) {
  const data = await getWeatherByPos(coords[0], coords[1]);
  const stat = data.current;
  city.textContent = data.location.name;
  L.marker(coords)
    .addTo(map)
    .bindPopup(
      L.popup({
        maxWidth: 200,
        minWidth: 100,
        autoClose: false,
        closeOnClick: false,
      })
    )
    .setPopupContent(
      `<div class="popup">
    <header class="head">
      <img src="${stat.condition.icon}" alt="weatherICON" class="icon" />
      <h3 class="temp">${stat.temp_c}&#176;</h3>
    </header>
    <section class="body">
      <div class="wind">
        <img src="src/img/wind.png" alt="windICON" class="e-icon" />
        <h6 class="w-speed">${stat.wind_kph} km/h</h6>
      </div>
      <div class="humid">
        <img src="src/img/humid.png" alt="humidityICON" class="e-icon" />
        <h6 class="h-perc">${stat.humidity}%</h6>
      </div>
    </section>
  </div>`
    )
    .on("click", function (e) {
      console.log(e);
      const { lat, lng } = e.latlng;
      markerClicked(lat, lng);
    })
    .openPopup();
};

const loadMap = function (coords) {
  console.log(L);
  map = L.map("map").setView(coords, 13);

  L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  // pop contet
  mapMarker(coords);
  // events
  map.on("click", function (e) {
    const { lat, lng } = e.latlng;
    mapMarker([lat, lng]);
  });
};

// Click on Map

//////////////////////////////////////////////////////////
//////////////// Window on load- getLoaction
window.addEventListener("load", function (e) {
  try {
    navigator.geolocation?.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        console.log(lat, lng);
        loadMap([lat, lng]);
      },
      (err) => {
        throw new Error("Allow app to get your location");
      }
    );
  } catch (err) {
    console.error(`Error: ${err.message}`);
  }
});
