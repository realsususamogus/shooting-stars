// Preloads resources and defines global variables for the start screen
let btnstart, btnrestart;
let bgpic;
let wpStarted = false;
let numStarslider, maxStarSizeSlider, minStarSizeSlider, maxStarBrightnessSlider, minStarBrightnessSlider, maxShootingStarsSlider, shootingStarSpeedSlider, shootingStarSpawnRateSlider, tailColorHueSlider, headColorHueSlider;
let hStart = 0; // used to rotate hue for text background

// Preload images or other resources
function preload() {
  bgpic = loadImage("star.png"); // Load background image for initial setup
}

// Setup customization sliders for the user interface
function customisation() {
  // Star count slider
  numStarslider = createSlider(100, 2000, 400, 25);
  numStarslider.position(width / 10 + 10, height / 3);
  
  // Maximum star size slider
  maxStarSizeSlider = createSlider(5, 30, 10);
  maxStarSizeSlider.position(width / 10 + 10, height / 3 + 30);

  // Minimum star size slider
  minStarSizeSlider = createSlider(1, 4, 1);
  minStarSizeSlider.position(width / 10 + 10, height / 3 + 60);

  // Maximum star brightness slider
  maxStarBrightnessSlider = createSlider(50, 100, 100, 1);
  maxStarBrightnessSlider.position(width / 10 + 10, height / 3 + 90);

  // Minimum star brightness slider
  minStarBrightnessSlider = createSlider(1, 50, 30);
  minStarBrightnessSlider.position(width / 10 + 10, height / 3 + 120);

  // Maximum number of shooting stars slider
  maxShootingStarsSlider = createSlider(1, 100, 15);
  maxShootingStarsSlider.position(width / 10 + 10, height / 3 + 150);

  // Shooting star speed slider
  shootingStarSpeedSlider = createSlider(1, 25, 5);
  shootingStarSpeedSlider.position(width / 10 + 10, height / 3 + 180);

  // Shooting star spawn rate slider
  shootingStarSpawnRateSlider = createSlider(0.01, 1, shootingStarSpawnRate, 0.01);
  shootingStarSpawnRateSlider.position(width / 10 + 10, height / 3 + 210);
  
  //Set the colour of the shooting star's tail
  tailColorHueSlider = createSlider(0, 360, tailColorHue)
  tailColorHueSlider.position(width/2 - 65, height - height/4 + 5)
  
  //Set the colour of the shooting star's head
  headColorHueSlider = createSlider(0, 360, headColorHue)
  headColorHueSlider.position(width/2 - 65, height - height /4 + 45)
  
}

// Display dynamic text and backgrounds for sliders
function slidertext() {
  colorMode(HSB);
  fill(hStart, 80, 80);
  hStart = (hStart + 1) % 360; // Increment hue for background
  rect(width / 10, height / 3, 375, 240, 20); // Left text background
  rect(width - width / 10 - 375, height / 3, 375, 240, 20); // Right text background
  rect(width/2 - 100, height - height/4 - 20, 200, 100, 10) // bottom text background
  
  fill(tailColorHueSlider.value(), 100, 80)
  
  rect(width/2 - 90, height - height/4 - 5, 25, 25)
  
  fill(headColorHueSlider.value(), 100, 80)
  
  rect(width/2 - 90, height - height/4 + 33, 25, 25)
  
  fill(0); // Set text color
  textFont("Arial", 15); // Set font and size
  
  // Display slider values
  displaySliderValues();

  textFont("Courier New", 15); // Change font for message
  displayWelcomeMessage();
}

// Helper function to display slider values
function displaySliderValues() {
  text("Number of stars = " + numStarslider.value(), width / 10 + 150, height / 3 + 15);
  
  text("Max Star Size = " + maxStarSizeSlider.value(), width / 10 + 150, height / 3 + 45);
  text("Min Star Size = " + minStarSizeSlider.value(), width / 10 + 150, height / 3 + 75);
  text("Max Star Brightness = " + maxStarBrightnessSlider.value(), width / 10 + 150, height / 3 + 105);
  text("Min Star Brightness = " + minStarBrightnessSlider.value(), width / 10 + 150, height / 3 + 135);
  text("Max Shooting Stars = " + maxShootingStarsSlider.value(), width / 10 + 150, height / 3 + 165);
  text("Shooting Star Speed = " + shootingStarSpeedSlider.value(), width / 10 + 150, height / 3 + 195);
  text("Shooting Star SpawnRate = " + shootingStarSpawnRateSlider.value(), width / 10 + 150, height / 3 + 225);
  
  text("SS Tail colour = " + tailColorHueSlider.value(), width/2 - 60, height - height/4 + 5)
  text("SS Head colour = " + headColorHueSlider.value(), width/2 - 60, height - height/4 + 45)
  
  
  //Changing the value of the variables according to the  corresponding slider value 
  numStars = numStarslider.value()
  maxStarSize = maxStarSizeSlider.value()
  minStarSize = minStarSizeSlider.value()
  maxStarBrightness = maxStarBrightnessSlider.value()
  minStarBrightness = minStarBrightnessSlider.value()
  maxShootingStars = maxShootingStarsSlider.value()
  shootingStarSpeed = shootingStarSpeedSlider.value()
  shootingStarSpawnRate = shootingStarSpawnRateSlider.value()
  headColorHue = headColorHueSlider.value()
  tailColorHue = tailColorHueSlider.value()
  
}

// Helper function to display the welcome message
function displayWelcomeMessage() {
  text(
    "Welcome to the Shooting Star Dynamic Wallpaper! There are many customization options to play around on the Left! Do take note that the shooting star settings can be adjusted later during the simulation. Additionally, pressing and holding your LEFT CLICK anywhere in the wallpaper REVERSES the background colour gradient. Open this application in fullscreen for the best experience. After adjusting settings, click start and Have fun!",
    width - width / 10 - 365,
    height / 3 + 5,
    375,
    420
  );
}

// Create and setup the 'Start' button
function btnstartspawn() {
  btnstart = createButton("Start");
  btnstart.position(width / 2 - 100, height / 2 - 100);
  btnstart.addClass("mybutton");
  btnstart.size(200, 200);
  btnstart.mouseOver(changecolor1);
  btnstart.mouseOut(changecolor12);
  btnstart.mousePressed(spawnstars);
}

// Create and setup the 'Restart' button
function btnrestartspawn() {
  btnrestart = createButton("Restart");
  btnrestart.position(0, 0);
  btnrestart.addClass("mybutton");
  btnrestart.size(150, 55);
  btnrestart.mouseOver(changecolor2);
  btnrestart.mouseOut(changecolor22);
  btnrestart.mousePressed(restart);
}

// Reloads the page to restart the application
function restart() {
  location.reload(); // Reload the page to restart the application
}

// Change styles for buttons on mouse over and out events
function changecolor1() {
  //setting the colour change and the shadow of the buttons upon mouseOver
  btnstart.style("background-image", "radial-gradient(circle, #62fc03 , #03e3fc)");
  btnstart.style("box-shadow", "0 12px 16px 0 rgba(0,0,0,0.24), 0 40px 50px 0 rgba(0,0,0,0.19)");
  btnstart.style("transition-duration", "0.5s");
}

function changecolor12() {
  //set starting colour gradient
  btnstart.style("background-image", "linear-gradient(red, yellow)");
  btnstart.style("box-shadow", "none");
}

//same function repeated twice for 2 buttons as it is using a .style property which cannot be reused for different buttons
function changecolor2() {
  btnrestart.style("background-image", "radial-gradient(circle, #62fc03 , #03e3fc)");
  btnrestart.style("box-shadow", "0 12px 16px 0 rgba(0,0,0,0.24), 0 40px 50px 0 rgba(0,0,0,0.19)");
  btnrestart.style("transition-duration", "0.5s");
}

function changecolor22() {
  btnrestart.style("background-image", "linear-gradient(red, yellow)");
  btnrestart.style("box-shadow", "none");
}
