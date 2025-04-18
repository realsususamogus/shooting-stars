//To-do:
// 1. Fix stars spawning in the middle 
// 2. Customisation options 

// Define arrays to hold stars and shooting stars
let stars = [];
let shootingStars = [];

// Define parameters for star and shooting star customization
let numStars = 400;
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
let b = 20; // Brightness


// Setup the canvas and initial star generation
function setup() {
  createCanvas(windowWidth, windowHeight)
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
    this.hue = starHue;
    this.brightnessNoiseOffset = random(1000);
    this.hueNoiseOffset = random(20);
  }

  display() {
    noStroke();
    colorMode(HSB);
    fill(this.hue, 100, this.brightness);
    ellipse(this.pos.x, this.pos.y, this.area, this.area);
  }

  update() {
    this.brightnessNoiseOffset += 0.05;
    this.hueNoiseOffset += 0.009;
    this.brightness = map(noise(this.brightnessNoiseOffset), 0, 1, minStarBrightness, maxStarBrightness);
    this.hue = map(noise(this.hueNoiseOffset), 0, 1, 0, 360);
  }
}

// ShootingStar class for creating and managing shooting stars
class ShootingStar {
  constructor(pos, velocity, length, brightness) {
    this.pos = pos;
    this.velocity = velocity;
    this.length = length
    this.brightness = brightness
  }

  update() {
    // Update the position of the shooting star by adding the velocity
    this.pos.add(this.velocity);
  }

  display() {
    // Colors for the gradient from tail to head of the shooting star
    colorMode(HSB)
    let tailColor = color(244, 100, this.brightness, 0); // Fading to transparent
    let headColor = color(57, 100, this.brightness); // Bright white at the head

    push();
    translate(this.pos.x, this.pos.y);
    
    // Align the shooting star with its velocity vector
    rotate(this.velocity.heading() + HALF_PI + PI);

    // Draw the shooting star as a series of overlapping rectangles for a gradient effect
    let numSegments = 20;
    let segmentLength = this.length / numSegments;
    let segmentWidth = 4; // Width of the shooting star

    for (let i = 0; i < numSegments; i++) {
      // Interpolate the color from tail to head
      let interColor = lerpColor(tailColor, headColor, i / numSegments);
      fill(interColor);
      noStroke();
      
      // Draw each segment
      rect(-segmentWidth / 2, segmentLength * (i - numSegments), segmentWidth, segmentLength);
    }

    pop();
    

  }

  offScreen() {
    // Consider the shooting star off-screen if it moves beyond a buffer area around the canvas
    let screenBuffer = this.length - 15; // Buffer zone
    return (this.pos.x < -screenBuffer || this.pos.x > width + screenBuffer || 
            this.pos.y < -screenBuffer || this.pos.y > height + screenBuffer);
  }
}


// Function to generate shooting stars at random intervals
function genSS() {
  if (shootingStars.length < maxShootingStars && random() < 0.05) {
    let startX = random(width);
    let startY = random(height);
    let angle = random(TWO_PI);
    let length = random(100, 400);
    let brightness = random(minStarBrightness, maxStarBrightness);
    let velocity = createVector(cos(angle) * shootingStarSpeed, sin(angle) * shootingStarSpeed);
    shootingStars.push(new ShootingStar(createVector(startX, startY), velocity, length, brightness));
  }
}
