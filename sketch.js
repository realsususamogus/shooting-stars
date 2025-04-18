// Define arrays to hold stars and shooting stars
let stars = [];
let shootingStars = [];

// Define parameters for star and shooting star customization
let numStars = 600;
let maxStarSize = 10;
let minStarSize = 1;
let starHue = 0;  // Initial hue for stars
let maxStarBrightness = 180;
let minStarBrightness = 20;
let maxShootingStars = 15;
let shootingStarSpeed = 5;
let noiseOffset = 0;

// Variables for background color manipulation
let h = 0;  // Hue
let s = 70; // Saturation
let b = 30; // Brightness

// Setup the canvas and initial star generation
function setup() {
  createCanvas(windowWidth, windowHeight);
  for (let i = 0; i < numStars; i++) {
    let pos = createVector(random(width), random(height));
    let area = random(minStarSize, maxStarSize);
    let brightness = random(minStarBrightness, maxStarBrightness);
    stars.push(new Star(pos, area, brightness));
  }
}

// Draw loop: updates and renders all objects in the scene
function draw() {
  setBg();  // Update background based on user interaction
  genSS();  // Generate and manage shooting stars
  h = constrain(h, -1, 361);
  s = constrain(s, 0, 100);
  b = constrain(b, 0, 100);
  colorMode(HSB);
  background(h, s, b);

  // Update and display stars
  stars.forEach(star => {
    star.update();
    star.display();
  });

  // Update and display shooting stars
  for (let i = shootingStars.length - 1; i >= 0; i--) {
    shootingStars[i].update();
    shootingStars[i].display();
    if (shootingStars[i].offScreen()) {
      shootingStars.splice(i, 1);
    }
  }
}

// Background hue adjustment based on mouse interaction
function setBg() {
  h = mouseIsPressed && h != 360 ? h - 3 : h + 1;
  h = h === 360 ? 0 : h;
  h = h < 0 ? h + 3 : h;
}

// Star class for creating star objects with twinkling and color changing effects
class Star {
  constructor(pos, area, brightness) {
    this.pos = pos;
    this.area = area;
    this.brightness = brightness;
    this.hue = random(360);
    this.brightnessNoiseOffset = random(1000);
    this.hueNoiseOffset = random(1000);
  }

  display() {
    noStroke();
    colorMode(HSB);
    fill(this.hue, 200, this.brightness);
    ellipse(this.pos.x, this.pos.y, this.area, this.area);
  }

  update() {
    this.brightnessNoiseOffset += 0.05;
    this.hueNoiseOffset += 0.02;
    this.brightness = map(noise(this.brightnessNoiseOffset), 0, 1, minStarBrightness, maxStarBrightness);
    this.hue = map(noise(this.hueNoiseOffset), 0, 1, 0, 360);
  }
}

// ShootingStar class for creating and managing shooting stars
class ShootingStar {
  constructor(pos, velocity, length, brightness) {
    this.pos = pos;
    this.velocity = velocity;
    this.length = random(50,300);
    this.brightness = brightness;
    this.trail = []; // Array to store previous positions for the trail
  }

  update() {
    // Update the position of the shooting star
    this.pos.add(this.velocity);

    // Store the current position in the trail array
    this.trail.push(createVector(this.pos.x, this.pos.y));

    // Keep the trail length limited to a certain number of points
    if (this.trail.length > 30) {
      this.trail.splice(0, 1);
    }
  }

  display() {
    // Draw fading trail
    for (let i = 0; i < this.trail.length; i++) {
      let alpha = map(i, 0, this.trail.length, 255, 0); // Fade out the trail
      fill(255, alpha); // White color with fading alpha
      noStroke();
      ellipse(this.trail[i].x, this.trail[i].y, 5);
    }

    // Draw the shooting star gradient
    colorMode(HSB)
    let startColor = color(255, 67, this.brightness); // White color with specified brightness
    let endColor = color(0, 56, this.brightness, 0); // Fully transparent
    for (let i = 0; i < this.length; i++) {
      let x1 = this.pos.x + this.velocity.x * i;
      let y1 = this.pos.y + this.velocity.y * i;
      let x2 = this.pos.x + this.velocity.x * (i + 1);
      let y2 = this.pos.y + this.velocity.y * (i + 1);
      let gradientColor = lerpColor(endColor, startColor, i / this.length); // Interpolate color along the length
      stroke(gradientColor);
      strokeWeight(5); // Adjust thickness as needed
      line(x1, y1, x2, y2);
    }
  }

  offScreen() {
    // Consider the shooting star off-screen if it moves beyond the canvas
    let buffer = 50; // Extra space to keep the star visible slightly offscreen
    return (this.pos.x < -buffer || this.pos.x > width + buffer || this.pos.y < -buffer || this.pos.y > height + buffer);
  }
}

// Function to generate shooting stars at random intervals
function genSS() {
  if (shootingStars.length < maxShootingStars && random() < 0.05) {
    let startX = random(width);
    let startY = random(height);
    let angle = random(TWO_PI);
    let length = random(20, 120);
    let brightness = random(minStarBrightness, maxStarBrightness);
    let velocity = createVector(cos(angle) * shootingStarSpeed, sin(angle) * shootingStarSpeed);
    shootingStars.push(new ShootingStar(createVector(startX, startY), velocity, length, brightness));
  }
}
