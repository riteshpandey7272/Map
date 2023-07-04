let max_particles = 300;
let particles = [];
let frequency = 10;
let init_num = max_particles;
let max_time = frequency * max_particles;
let time_to_recreate = false;

// Enable repopolate
setTimeout(function () {
  time_to_recreate = true;
}.bind(this), max_time);

// Popolate particles
popolate(max_particles);

var tela = document.createElement('canvas');
tela.width = $(window).width();
tela.height = $(window).height();
$("body").append(tela);

var canvas = tela.getContext('2d');

class Particle{
    constructor(canvas) {
        let random = Math.random();
        this.progress = 0;
        this.canvas = canvas;
        this.center = {
          x: $(window).width() / 2,
          y: $(window).height() / 2 };
    
        this.point_of_attraction = {
          x: $(window).width() / 2,
          y: $(window).height() / 2 };
    
        // Randomize the initial position across the entire screen
        this.x = $(window).width() * Math.random();
        this.y = $(window).height() * Math.random();
    
        this.s = Math.random() * 0.5;
        this.a = 0;
        this.w = $(window).width();
        this.h = $(window).height();
        this.radius = 1.8; // Set a fixed radius for all particles
        this.color = random > 0.2 ? "#3CFBFF" : "#3CFBFF";
        this.radius = random > 0.8 ? 2.2 : this.radius;
        this.color = random > 0.8 ? "#3CFBFF" : this.color;
      }

  calculateDistance(v1, v2) {
    let x = Math.abs(v1.x - v2.x);
    let y = Math.abs(v1.y - v2.y);
    return Math.sqrt(x * x + y * y);
  }

  render() {
    this.canvas.beginPath();
    this.canvas.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    this.canvas.lineWidth = 2;
    this.canvas.fillStyle = this.color;
    this.canvas.fill();
    this.canvas.closePath();
  }

  move() {
    // Wave-like movement
    const waveSpeed = 0.02; // Adjust the wave speed as desired
    const waveAmplitude = 30; // Adjust the wave amplitude as desired
    const phase = this.progress * waveSpeed;

    // Calculate horizontal movement
    const horizontalSpeed = 1; // Adjust the horizontal speed as desired
    const horizontalDirection = Math.cos(phase) > 0 ? 1 : -1;
    const horizontalOffset = horizontalDirection * horizontalSpeed;

    this.a = Math.sin(this.x * waveSpeed + phase) * waveAmplitude;

    // Move the particle horizontally
    this.x += horizontalOffset;

    // Move the particle vertically
    this.y += Math.sin(this.a) * this.s;

    // Check if the particle is out of the screen bounds
    if (
      this.x < -100 ||
      this.x > this.w + 100 ||
      this.y < -100 ||
      this.y > this.h + 100
    ) {
      // Reset the particle position
      if (Math.random() > 0.5) {
        this.x = this.w * Math.random();
        this.y = Math.random() > 0.5 ? -Math.random() - 100 : this.h + Math.random() + 100;
      } else {
        this.x = Math.random() > 0.5 ? -Math.random() - 100 : this.w + Math.random() + 100;
        this.y = this.h * Math.random();
      }
    }

    this.render();
    this.progress++;
    return true;
  }

}


function popolate(num) {
  for (var i = 0; i < num; i++) {
    setTimeout(
    function (x) {
      return function () {
        // Add particle
        particles.push(new Particle(canvas));
      };
    }(i),
    frequency * i);
  }
  return particles.length;
}

// function createSphera() {
//   let radius = 180;
//   let center = {
//     x: $(window).width() / 2,
//     y: $(window).height() / 2 };

// }

function clear() {
  canvas.globalAlpha = 0.08;
  canvas.fillStyle = '#110031';
  canvas.fillRect(0, 0, tela.width, tela.height);
  canvas.globalAlpha = 1;
}

/*
 * Function to update particles in canvas
 */
function update() {
  particles = particles.filter(function (p) {return p.move();});
  // Recreate particles
  if (time_to_recreate) {
    if (particles.length < init_num) {popolate(1);console.log("Ricreo");}
  }
  clear();
  requestAnimationFrame(update.bind(this));
}
update();