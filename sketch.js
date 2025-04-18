
//PLEASE OPEN THIS PROJECT IN FULLSCREEN (A NEW TAB)!!!!!!
//my recommendation: the default shooting star colour is really good

// Define arrays to hold stars and shooting stars
let stars = [];
let shootingStars = [];

// Define parameters for star and shooting star customization
let numStars = 400;
let maxStarSize = 10;
let minStarSize = 1;
let starHue = 0; // Initial hue for stars
let maxStarBrightness = 100;
let minStarBrightness = 20;
let maxShootingStars = 15;
let shootingStarSpeed = 5;
let shootingStarSpawnRate = 0.05;
let noiseOffset = 0;

// Variables for color manipulation
let h = 0; // Hue
let s = 70; // Saturation
let b = 20; // Brightness
let tailColorHue = 244; //defined in startscreen.js
let headColorHue = 57;

// Setup the canvas and initial star generation
function setup() {
  createCanvas(windowWidth, windowHeight);
  sliderWidth = windowWidth / 10 + 10;
  background(bgpic);
  btnstartspawn();
  btnrestartspawn();
  customisation();
}

function spawnstars() {
  wpStarted = true;
  clear();
  btnstart.remove();
  numStarslider.remove();
  maxStarSizeSlider.remove();
  minStarSizeSlider.remove();
  maxStarBrightnessSlider.remove();
  minStarBrightnessSlider.remove();
  //maxShootingStarsSlider.remove();
  //shootingStarSpeedSlider.remove();
  //shootingStarSpawnRateSlider.remove();
  

  //maxShootingStarsSlider = createSlider(1, 100, maxShootingStars);
  maxShootingStarsSlider.position(150, 0);
  
  //shootingStarSpeedSlider = createSlider(1, 25, shootingStarSpeed);
  shootingStarSpeedSlider.position(150, 18);

  //shootingStarSpawnRateSlider = createSlider(0.01, 1, shootingStarSpawnRate, 0.01);
  shootingStarSpawnRateSlider.position(150, 36);
  
  headColorHueSlider.position(550, 0)
  tailColorHueSlider.position(550, 18)

  for (let i = 0; i < numStars; i++) {
    let pos = createVector(random(width), random(height));
    let area = random(minStarSize, maxStarSize);
    let brightness = random(minStarBrightness, maxStarBrightness);
    stars.push(new Star(pos, area, brightness));
  }
}
// Draw loop: updates and renders all objects in the scene
function draw() {
  slidertext();

  if (wpStarted == true) {
    setBg(); // Update background based on user interaction
    genSS(); // Generate and manage shooting stars
    h = constrain(h, -1, 361);
    s = constrain(s, 0, 100);
    b = constrain(b, 0, 100);
    colorMode(HSB);
    background(h, s, b);

    // Update and display stars
    stars.forEach((star) => {
      star.update();
      star.display();
    });

    stroke(0);
    textSize(15);
    fill(255);
    
    //maxShootingStars = maxShootingStarsSlider.value()
    //shootingStarSpeed = shootingStarSpeedSlider.value()
    //shootingStarSpawnRate = shootingStarSpawnRateSlider.value()
    text("Max Shooting Stars = " + maxShootingStars, 290, 15);
    text("Shooting Star Speed = " + shootingStarSpeed, 290, 33);
    text("Shooting Star Spawnrate = " + shootingStarSpawnRate, 290, 50);
    text("SS head colour = " + headColorHue, 690, 15)
    text("SS tail colour = " + tailColorHue, 690, 33)
    
    fill(headColorHueSlider.value(), 100, 80)
    rect(525, 0, 20, 20)
    
    fill(tailColorHueSlider.value(), 100, 80)
    rect(525, 18, 20, 20)

    // Update and display shooting stars
    for (let i = shootingStars.length - 1; i >= 0; i--) {
      shootingStars[i].update();
      shootingStars[i].display();
      if (shootingStars[i].offScreen()) {
        shootingStars.splice(i, 1);
      }
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
    this.brightness = map(
      noise(this.brightnessNoiseOffset), 0, 1, minStarBrightness, maxStarBrightness);
    this.hue = map(noise(this.hueNoiseOffset), 0, 1, 0, 360);
  }
}

// ShootingStar class for creating and managing shooting stars
class ShootingStar {
  constructor(pos, velocity, length, brightness) {
    this.pos = pos;
    this.velocity = velocity;
    this.length = length;
    this.brightness = brightness;
  }

  update() {
    // Update the position of the shooting star by adding the velocity
    this.pos.add(this.velocity);
  }

  display() {
    // Colors for the gradient from tail to head of the shooting star
    colorMode(HSB);
    let tailColor = color(tailColorHue, 100, this.brightness, 0); // Fading to transparent
    let headColor = color(headColorHue, 100, this.brightness); // Bright white at the head

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

      // Draw each segment, uses elipses and rectangles to make it look smoother at different lengths
      if (segmentLength < 7) {
        ellipse(
          -segmentWidth / 2,segmentLength * (i - numSegments),segmentWidth,
          segmentLength);
      } else {
        rect(
          -segmentWidth / 2,segmentLength * (i - numSegments),segmentWidth,
          segmentLength, 5); 
      }
    }

    pop();
  }

  offScreen() {
    // Consider the shooting star off-screen if it moves beyond a buffer area around the canvas
    let screenBuffer = this.length - 15; // Buffer zone
    return (
      this.pos.x < -screenBuffer ||
      this.pos.x > width + screenBuffer ||
      this.pos.y < -screenBuffer ||
      this.pos.y > height + screenBuffer
    );
  }
}

//function to handle the generation of shooting stars
function genSS() {
  if (shootingStars.length < maxShootingStars && random() < shootingStarSpawnRate) {
    // Choose a random edge by selecting a random number between 0 and 3
    let edge = floor(random(4)); 
    let startX, startY, angle;

    switch (edge) {
      case 0: // Top edge
        startX = random(width);
        startY = 0;
        angle = random(PI / 4, (3 * PI) / 4); // Angle to go downwards
        break;
      case 1: // Right edge
        startX = width;
        startY = random(height);
        angle = random((5 * PI) / 4, (7 * PI) / 4); // Angle to go left
        break;
      case 2: // Bottom edge
        startX = random(width);
        startY = height;
        angle = random((5 * PI) / 4, (7 * PI) / 4); // Angle to go upwards
        break;
      case 3: // Left edge
        startX = 0;
        startY = random(height);
        angle = random(PI / 4, (3 * PI) / 4); // Angle to go right
        break;
    }
    //Setting the variables for each shooting star
    let length = random(100, 400);
    let brightness = random(minStarBrightness, maxStarBrightness);
    let velocity = createVector(
      cos(angle) * shootingStarSpeed,
      sin(angle) * shootingStarSpeed
    );
    //Creating the shooting star based on the above set variables
    shootingStars.push(
      new ShootingStar(
        createVector(startX, startY),
        velocity,
        length,
        brightness
      )
    );
  }
}

