'use strict';

import * as raning from '../src/rain.js';
import * as snowing from '../src/snow.js';

// ID: 86342f1499524d6b98462926211312
// snowing();
// DOM Variables
const animate = document.querySelector('#ani-switch');
const body = document.querySelector('body');
const block = document.querySelector('.block');
const searchBtn = document.querySelector('.search');
const searchLoc = document.querySelector('#search');
const text = document.querySelector('.text');
const mtext = document.querySelector('.mtext');
const sun = document.querySelector('.sun');
const moon = document.querySelector('.moon');
const days = document.querySelector('.days');
const day1 = document.querySelector('.day1');
const day2 = document.querySelector('.day2');
const day3 = document.querySelector('.day3');
const fogMist = document.querySelector('.fog-mist');
const cloudS = document.querySelector('.cloud');
// const animate = document.querySelector('#ani-switch');

const city = document.querySelector('.loc');
const icon = document.querySelector('#icon');
const temp = document.querySelector('.temp');
const tempUnit = document.querySelector('.temp-unit');
const etcDetails = document.querySelector('.etc-details');
const desc = document.querySelector('.desc');
const windSpeed = document.querySelector('.w-speed');
const humid = document.querySelector('.h-perc');

// weather-control
const clouds = document.querySelector('.cloud');
const dayType = ['clear', 'cloud', 'cloudy', 'fog', 'rainy', 'snowy'];
let day;
//  variables
const kelvin = 273;
const month = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sept',
  'Oct',
  'Nov',
  'Dec',
];
let today, tomorrow, otherDay, activeDay;

//////////////////////////////////////////////////////////////////
//////////////////// Alpha /////////////////////////////////

///////////////////////////////////////////////////////
///////////////// Style Settings

const setDay = function (code) {
  const inc = ele => ele === code;
  if (code === 1000) day = 'clear';
  if ([1003, 1006, 1009, 1087].some(inc)) day = 'cloudy';
  if ([1030, 1135, 1147, 1150].some(inc)) day = 'fog';
  if (
    [
      1153, 1168, 1171, 1180, 1183, 1186, 1189, 1192, 1195, 1198, 1201, 1204,
      1240, 1243, 1246, 1273, 1276,
    ].some(inc)
  )
    day = 'rainy';
  if (
    [
      1114, 1117, 1207, 1210, 1213, 1216, 1219, 1222, 1225, 1237, 1249, 1252,
      1255, 1258, 1261, 1264, 1279, 1282,
    ].some(inc)
  )
    day = 'snowy';
  console.log('day set:', day);
};

animate.addEventListener('change', function () {
  if (this.checked) {
    day === 'fog'
      ? (fogMist.style.display = 'block')
      : (fogMist.style.display = 'none');

    day === 'cloudy' || day === 'rainy'
      ? (cloudS.style.display = 'block')
      : (cloudS.style.display = 'none');
  } else {
    fogMist.style.display = 'none';
    cloudS.style.display = 'none';
  }
});

const daySetting = function () {
  // body.style.background = '#70e1fa';
  body.style.background = '#5d65d8';
  block.style.background = 'rgb(0,0,0,0)';
  // block.style.border = 'solid 3px #000';
  block.style.color = '#fff';
  // block.style.boxShadow = '5px -5px 1px #fff';
  block.style.boxShadow = '0px 20px 30px 0 rgba(0,0,0,0.4)';
  city.style.color = '#000';
  text.style.color = '#000';
  mtext.style.color = '#000';
  // animator
  sun.style.display = 'block';
  moon.style.display = 'none';
  sun.style.animation = 'animation: sunrise 5s linear forwards';
  setTimeout(function () {
    sun.style.animation =
      'sunvibe 2s infinite linear forwards, rays 2s 2s infinite linear';
  }, 5000);
};

const nightSetting = function () {
  body.style.background = '#000';
  // block.style.background = '#fff';
  block.style.border = 'solid 3px #fff';
  block.style.color = '#fff';
  // block.style.boxShadow = '0px 10px 30px 0 rgba(150,150,150,0.2)';
  city.style.color = '#fff';
  text.style.color = '#fff';
  mtext.style.color = '#fff';
  // animator
  sun.style.display = 'none';
  moon.style.display = 'block';
  // forecast
  day1.style.color = '#fff';
  day1.style.border = 'solid 1px #fff';
  day2.style.color = '#fff';
  day2.style.border = 'solid 1px #fff';
  day3.style.color = '#fff';
  day3.style.border = 'solid 1px #fff';
};

const displayData = function (data) {
  // day type
  const code = data.current.condition.code;
  setDay(code);
  console.log(code);

  // other stats
  const stat = data.current;
  city.textContent = data.location.name;
  let icon1 = stat.condition.icon;
  icon.src = `${icon1}`;
  temp.textContent = stat.temp_c;
  desc.textContent = stat.condition.text;
  windSpeed.textContent = `${stat.wind_kph} km/h`;
  humid.textContent = `${stat.humidity}%`;

  stat.is_day === 0 ? nightSetting() : daySetting();
  // day = 'snowy';
  // weatherSetting(day);
};

const displayForecast = function (data) {
  const code = data.current.condition.code;
  setDay(code);

  const stat = data.current;
  city.textContent = data.location.name;
  let icon1 = stat.condition.icon;
  icon.src = `${icon1}`;
  temp.textContent = stat.maxtemp_c;
  desc.textContent = stat.condition.text;
  windSpeed.textContent = `${stat.maxwind_kph} km/h`;
  humid.textContent = `${stat.avghumidity}%`;
};

////////////////////////////////////////////////////////////
/////////////////// GET WEATHER API

const setForecast = function (data) {
  today = {
    current: data.current,
    location: data.location,
  };
  tomorrow = {
    current: data.forecast.forecastday[1].day,
    location: data.location,
  };
  otherDay = {
    date: data.forecast.forecastday[2].date,
    current: data.forecast.forecastday[2].day,
    location: data.location,
  };
  const [, mon, tdate] = otherDay.date.split(' ')[0].split('-');
  day3.textContent = `${tdate} ${month[Number.parseInt(mon) - 1]}`;
};

const getWeatherByPos = async function (lat, lng) {
  try {
    const url = `http://api.weatherapi.com/v1/forecast.json?key=86342f1499524d6b98462926211312&q=${[
      lat,
      lng,
    ].join(',')}&days=3`;
    const res = await fetch(url);
    if (!res) throw new Error('No data about Location');
    const data = await res.json();
    setForecast(data);
    activeDay = today;
    displayData(activeDay);
  } catch (err) {
    console.error(`Error: ${err.message}`);
  }
};

const getWeatherByLoc = async function (location) {
  try {
    const url = `http://api.weatherapi.com/v1/forecast.json?key=86342f1499524d6b98462926211312&q=${location}&days=3`;
    const res = await fetch(url);
    if (!res) throw new Error('No data about Location');
    const data = await res.json();
    setForecast(data);
    activeDay = today;
    displayData(activeDay);
    // displayData(data);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    clearSearchBar();
  }
};

// ///////////////////////////////////////////
/////////// EVENTS
let clearState = false;
const clearAllTransform = function (t = 0) {
  setTimeout(function () {
    block.style.transform = '';
    icon.style.transform = '';
    desc.style.transform = '';
    tempUnit.style.transform = '';
    etcDetails.style.transform = '';
  }, t);
};

window.addEventListener('load', () => {
  navigator.geolocation.getCurrentPosition(pos => {
    const { latitude: lat, longitude: lng } = pos.coords;
    getWeatherByPos(lat, lng); // don not forget to add setInterval
    // getTwoDaysWeather(lat, lng);
    block.style.transform = 'rotateY(180deg) rotateX(180deg)';
    block.style.transition = 'ease all 2s';
    clearAllTransform(1500);
    clearState = true;
  });
});

// search location
const clearSearchBar = function () {
  searchLoc.value = '';
};

searchBtn.addEventListener('click', e => getWeatherByLoc(searchLoc.value));
searchLoc.addEventListener('keydown', e => {
  if (e.keyCode === 13) {
    e.preventDefault();
    getWeatherByLoc(searchLoc.value);
    clearSearchBar();
  }
});

// forecast

const rotateCard = function () {
  if (!clearState) {
    clearAllTransform();
    clearState = true;
    return;
  }

  block.style.transform = 'rotateY(180deg)';
  icon.style.transform = 'rotateY(180deg)';
  desc.style.transform = 'rotateY(180deg)';
  tempUnit.style.transform = 'rotateY(180deg)';
  etcDetails.style.transform = 'rotateY(180deg)';
  block.style.transition = 'ease all 3s';
  clearState = false;
};

days.addEventListener('click', function (e) {
  day1.classList.remove('active-day');
  day2.classList.remove('active-day');
  day3.classList.remove('active-day');
  rotateCard();
  let state = false;
  if (e.target.classList.contains('day1')) {
    activeDay = today;
    displayData(activeDay);
    state = true;
  } else if (e.target.classList.contains('day2')) {
    activeDay = tomorrow;
    displayForecast(activeDay);
    state = true;
  } else if (e.target.classList.contains('day3')) {
    activeDay = otherDay;
    displayForecast(activeDay);
    state = true;
  }
  state ? e.target.classList.add('active-day') : console.log('none');
});

export { day };
