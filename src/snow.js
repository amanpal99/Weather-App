// const mcanvas = document.querySelector('.canvas');
import { createVector, random, constrain } from '../src/afun.js';
import { day } from '../src/script.js';

const animate = document.querySelector('#ani-switch');
const canvas = document.querySelector('.canvas');
let width = canvas.width;
let height = canvas.height;
const ctx = canvas.getContext('2d');
ctx.scale(1, 1);
// console.log(width, height);

let snow = [];
let gravity;

let zOff = 0;

let spritesheet;
const textures = [
  '',
  '../src/icons/sf0.png',
  '../src/icons/sf1.png',
  '../src/icons/sf2.png',
];

function getRandomSize() {
  let r = Math.pow(random(1, 0), 10);
  return constrain(r * 32, 2, 32);

  // let r = randomGaussian() * 2.5;
  // return constrain(abs(r * r), 2, 36);
  // while (true) {
  //   let r1 = random(1);
  //   let r2 = random(1);
  //   if (r2 > r1) {
  //     return r1 * 36;
  //   }
  // }
}

function drawCoordinates(x, y, r) {
  ctx.fillStyle = '#fff';

  ctx.beginPath(); //Start path
  ctx.arc(x, y, r, 0, Math.PI * 2, true); // Draw a point using the arc function of the canvas with a point structure.
  ctx.fill(); // Close the path and fill.
}

class Snowflake {
  constructor(sx, sy, img) {
    let x = sx || random(width);
    let y = sy || random(-100, -10);
    // this.img = img;
    this.pos = new createVector(x, y);
    this.vel = new createVector(0, 0);
    this.acc = new createVector();
    this.angle = random(Math.PI * 2);
    this.dir = random(1) > 0.5 ? 1 : -1;
    this.xOff = 0;
    this.r = getRandomSize();
    // image
    this.fimg = new Image();
    this.fimg.src = textures[Math.trunc(random(3, 1))];
    this.fimg.addEventListener(
      'load',
      function () {
        console.log('Image Ready');
      },
      false
    );
  }

  applyForce(force) {
    // Parallax Effect hack
    let f = force.copy();
    f.mult(this.r);

    // let f = force.copy();
    // f.div(this.mass);
    this.acc.add(f);
  }

  randomize() {
    let x = random(width);
    let y = random(-100, -10);
    this.pos = new createVector(x, y);
    this.vel = new createVector(0, 0);
    this.acc = new createVector();
    this.r = getRandomSize();
  }

  update() {
    this.xOff = Math.sin(this.angle * 2) * 2 * this.r;

    this.vel.add(this.acc);
    this.vel.limit(this.r * 0.2);

    if (this.vel.mag() < 1) {
      this.vel.normalize();
    }

    this.pos.add(this.vel);
    this.acc.mult(0);

    if (this.pos.y > height + this.r) {
      this.randomize();
    }

    // Wrapping Left and Right
    if (this.pos.x < -this.r) {
      this.pos.x = width + this.r;
    }
    if (this.pos.x > width + this.r) {
      this.pos.x = -this.r;
    }

    this.angle += (this.dir * this.vel.mag()) / 200;
  }

  render() {
    // ctx.strokeStyle = '#fff';
    // ctx.lineWidth = 2;
    // drawCoordinates(this.pos.x, this.pos.y, this.r);

    // console.log(fimg);
    ctx.drawImage(this.fimg, this.pos.x, this.pos.y, this.r, this.r);
    // console.log('drawingImg');

    // push();
    // translate(this.pos.x + this.xOff, this.pos.y);
    // rotate(this.angle);
    // imageMode(CENTER);
    // image(this.img, 0, 0, this.r, this.r);
    // pop();
  }

  // offScreen() {
  //   return (this.pos.y > height + this.r);
  // }
}

function preload() {
  spritesheet = loadImage('../src/img/flakes32.png');
}

const init = function () {
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, width, height);

  gravity = new createVector(0, 0.3);
  // for (let x = 0; x < spritesheet.width; x += 32) {
  //   for (let y = 0; y < spritesheet.height; y += 32) {
  //     let img = spritesheet.get(x, y, 32, 32);
  //     image(img, x, y);
  //     textures.push(img);
  //   }
  // }

  for (let i = 0; i < 400; i++) {
    let x = random(width);
    let y = random(height);
    // let design = random(textures);
    snow.push(new Snowflake(x, y));
  }
};
// function setup() {
//   createCanvas(windowWidth - 10, windowHeight - 10);
// }

function draw() {
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, width, height);
  //snow.push(new Snowflake());

  zOff += 0.1;

  snow.forEach(ele => {
    let xOff = ele.pos.x / width;
    let yOff = ele.pos.y / height;
    // let wAngle = noise(xOff, yOff, zOff) * TWO_PI;
    // let wind = p5.Vector.fromAngle(wAngle);
    // wind.mult(0.1);

    ele.applyForce(gravity);
    // ele.applyForce(wind);
    ele.update();
    ele.render();
  });

  // for (let i = snow.length - 1; i >= 0; i--) {
  //   if (snow[i].offScreen()) {
  //     snow.splice(i, 1);
  //   }
  // }
}

let snowing;
let renderClear = true;
init();
animate.addEventListener('change', function () {
  if (!renderClear && day !== 'snowy') {
    canvas.style.opacity = 0;
    clearInterval(snowing);
    ctx.clearRect(0, 0, width, height);
    renderClear = true;
  }

  if (day !== 'snowy') return;

  if (this.checked) {
    renderClear = false;
    // init();
    // canvas;
    canvas.style.opacity = 0.4;
    snowing = setInterval(() => {
      draw();
    }, 25);
  } else {
    canvas.style.opacity = 0;
    clearInterval(snowing);
    ctx.clearRect(0, 0, width, height);
  }
});
