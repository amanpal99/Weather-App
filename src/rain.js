'use strict';
import { day } from '../src/script.js';

// const mailBtn = document.querySelector('.contact-mail');
const animate = document.querySelector('#ani-switch');
const canvas = document.querySelector('.canvas');
let width = canvas.width;
let height = canvas.height;
const ctx = canvas.getContext('2d');
// ctx.scale(1, 1);
// console.log(width, height);

const init = function () {
  // width = canvas.width;
  // height = canvas.height;
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, width, height);
};
const Drop = function () {
  this.x = Math.trunc(Math.random() * width) + 1;
  this.y = Math.trunc(Math.random() * -500) - 100;
  this.z = Math.trunc(Math.random() * 10);
  this.len = 80 + ((120 - 80) / (20 - 0)) * (this.z - 0);
  this.yspeed = 10 + ((50 - 1) / (20 - 0)) * (this.z - 0);

  this.fall = function () {
    this.x = this.x + Math.trunc(Math.random() * 4 - 2);
    this.y = this.y + this.yspeed;
    // this.yspeed = this.yspeed + 0.2;
    if (this.y > height) {
      this.y = Math.trunc(Math.random() * -200) + 100;
      this.x = Math.trunc(Math.random() * width) + 1;
      this.yspeed = 4 + ((10 - 4) / (20 - 0)) * (this.z - 0);
    }
  };

  this.show = function () {
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x, this.y + this.len);
    this.y = this.y + this.len;

    const thick = 1 + ((2 - 1) / (20 - 0)) * (this.z - 0);
    ctx.lineWidth = 2;
    // console.log("showing");
    // ctx.strokeStyle = '#670cbd';
    ctx.strokeStyle = '#ffffff90';
    ctx.stroke();
  };
};

////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////

// const drops = new Drop();
const drops = [];
for (let i = 0; i < 400; i++) {
  drops[i] = new Drop();
}

function draw() {
  // make canvas again
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, width, height);
  // animate
  for (let i = 0; i < 400; i++) {
    drops[i].fall();
    drops[i].show();
  }
}

let rain;
let renderClear = true;
animate.addEventListener('change', function () {
  if (!renderClear && day !== 'rainy') {
    canvas.style.opacity = 0;
    clearInterval(rain);
    ctx.clearRect(0, 0, width, height);
    renderClear = true;
  }
  if (day !== 'rainy') {
    canvas.style.opacity = 0;
    clearInterval(rain);
    ctx.clearRect(0, 0, width, height);
    return;
  }
  if (this.checked) {
    renderClear = false;
    canvas.style.opacity = 0.4;
    init();
    rain = setInterval(() => {
      draw();
    }, 25);
  } else {
    canvas.style.opacity = 0;
    clearInterval(rain);
    ctx.clearRect(0, 0, width, height);
  }
});

// export { startRain, stopRain };
