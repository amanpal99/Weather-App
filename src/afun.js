export class createVector {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  copy() {
    return new createVector(this.x, this.y);
  }

  add(obj) {
    this.x += obj.x;
    this.y += obj.y;
  }

  mult(num) {
    this.x *= num;
    this.y *= num;
  }

  limit(num) {
    this.y = this.y > num ? num : this.y;
  }

  mag() {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  }

  normalize(val, min = 0, max = 1) {
    return (val - min) / (max - min);
  }
}

export const random = function (a, b = 0) {
  return Math.random() * a + b;
};

export const constrain = function (num, a, b) {
  return num >= a ? (num <= b ? num : b) : a;
};
