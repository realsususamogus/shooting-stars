// Define arrays to hold stars and shooting stars
let stars = [];
let shootingStars = [];

// Define parameters for customization
let numStars = 600;
let maxStarSize = 10;
let minStarSize = 1;
let starHue = 0
let maxStarBrightness = 180;
let minStarBrightness = 20;
let maxShootingStars = 15;
let shootingStarSpeed = 5;
let noiseOffset = 0

//Other variables
let h = 0
let s = 70
let b = 30

function setup() {
  createCanvas(windowWidth, windowHeight);
  //setInterval(setBg, 2000)
  // Generate stars
  for (let i = 0; i < numStars; i++) {
    let pos = createVector(random(width), random(height));
    let area = random(minStarSize, maxStarSize);
    let brightness = random(minStarBrightness, maxStarBrightness);
    stars.push(new Star(pos, area, brightness));
  }
  
}


function draw() {
  //function to generate and manage background
  setBg()
 
  //function to generate shooting stars
  genSS() 
  h = constrain(h, -1, 361)
  s = constrain(s, 0, 100)
  b = constrain(b, 0, 100)
  colorMode(HSB)
  background(h, s, b);
  
  // Update and display stars
  for (let star of stars) {
    star.display();
    star.update();
  }
  
 
  // Update Perlin noise offset
  noiseOffset += 0.01;

  // Update and display shooting stars
  for (let i = shootingStars.length - 1; i >= 0; i--) {
    shootingStars[i].update();
    shootingStars[i].display();
    if (shootingStars[i].offScreen()) {
      shootingStars.splice(i, 1);
    }
  }
  
  text(h, 200, 200)
}


function setBg() {
  if(mouseIsPressed && h!= 360) {
    h = h - 3
    //g = g + 2 
   // b = b + 1
  } else {
    h = h + 1
   // g = g - 1
   // b = b - 1
  }
  if (h == 360) {
    for (let s = 0; s < 360; s++) {
      h = h - 1
    }
  } 
  if (h < 0) {
    h = h + 3
  }
  
}

// Star class definition
class Star {
  constructor(pos, area, brightness) {
    this.pos = pos;
    this.area = area;
    this.brightness = brightness;
    this.hue = random(360);  // Start with a random hue for each star
    this.brightnessNoiseOffset = random(1000);  // Different noise offset for brightness
    this.hueNoiseOffset = random(1000);  // Different noise offset for hue
  }

  display() {
    noStroke();
    colorMode(HSB);
    fill(this.hue, 200, this.brightness);  // Use individual hue and brightness
    ellipse(this.pos.x, this.pos.y, this.area, this.area);
  }

  update() {
    // Increment noise offsets
    this.brightnessNoiseOffset += 0.05;
    this.hueNoiseOffset += 0.02;  // Slower change for hue to make it smooth

    // Update brightness based on noise, ensuring smooth transition
    this.brightness = map(noise(this.brightnessNoiseOffset), 0, 1, minStarBrightness, maxStarBrightness);

    // Update hue based on noise, allowing full 360 degree color range
    this.hue = map(noise(this.hueNoiseOffset), 0, 1, 0, 360);
  }
}




// ShootingStar class definition
class ShootingStar {
  constructor(pos, velocity, length, brightness) {
    this.pos = pos;
    this.velocity = velocity;
    this.length = length;
    this.brightness = brightness;
  }

  update() {
    this.pos.add(this.velocity);
  }

  display() {
  // Draw fading trail
  let trailLength = 40;  // Adjust the length of the trail as needed
  let initialTrailSize = 4;  // Start size of the trail ellipses
  let trailColor = color(255, 255, 255);  // Adjust the trail color as needed
  
  for (let i = 0; i < trailLength; i++) {
      let trailPositionX = this.pos.x - this.velocity.x * i;
      let trailPositionY = this.pos.y - this.velocity.y * i;
      let alpha = 255 * pow(0.9, i);  // Use exponential decay for alpha
      let trailSize = initialTrailSize * pow(0.95, i);  // Decrease size exponentially
      fill(red(trailColor), green(trailColor), blue(trailColor), alpha);
      noStroke();
      ellipse(trailPositionX, trailPositionY, trailSize, trailSize);
  }

  // Draw the shooting star
  strokeWeight(5);
  stroke(random(100), random(360), random(360), this.brightness);
  line(this.pos.x, this.pos.y, this.pos.x + this.velocity.x * this.length, this.pos.y + this.velocity.y * this.length);
}



  offScreen() {
    return (this.pos.x < 0 || this.pos.x > width || this.pos.y < 0 || this.pos.y > height);
  }
}

function genSS() {
  // Generate shooting stars
  if (shootingStars.length < maxShootingStars && random() < 0.05) { // Adjust the probability to control frequency
    let startX = random(width);
    let startY = random(height);
    let angle = random(TWO_PI); // Use random angle
    let length = random(20, 120); // Shorter range for length
    let endX = startX + cos(angle) * length; // Use angle to calculate end position
    let endY = startY + sin(angle) * length; // Use angle to calculate end position
    let brightness = random(minStarBrightness, maxStarBrightness);
    
    let velocity = createVector(cos(angle) * shootingStarSpeed, sin(angle) * shootingStarSpeed);
    shootingStars.push(new ShootingStar(createVector(startX, startY), velocity, length, brightness));
  }
  
}

