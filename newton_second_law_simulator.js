function setup() {
  /* Setup the animation */
  initializeSimulations();
  initializeCanvas();
  initializePosition();

}

function draw() {
  /* The draw loop which is called continuously */
  updateCanvas();
  updatePosition();
}

function initializeCanvas() {
  createCanvas(window.innerWidth - 10, window.innerHeight - 70);
  colorMode(RGB);
  background(255, 255, 255);
  translate(width / 2, height / 2);
  stroke(101, 67, 33);
  line(-width, 0, width, 0);
  stroke(0, 0, 0);
  fill(0, 0, 0);
  circle(0, 0, 5);
}

function initializeSimulations() {
  number_simulations = 2;
  simulation_names = ["Projectile", "Spring"];

  simulation_functions = [
    function resetSketchProjectile() {
      initialize(mass = 10, gravity = 9.8, delta_t = 0.1, px = 0, py = 0, vx = 50, vy = -50, radius = 20, //Projectile in Earth's gravitational field
        mu = 0, k = 0, accel_magnif = 3.5, vel_magnif = 0.5, simulation = 0);
    },
    function resetSketchSpring() {
      initialize(mass = 10, gravity = 9.8, delta_t = 0.03125, px = -500, py = 0, vx = 0, vy = 0, radius = 20, //Spring in x direction
        mu = 0, k = 1, accel_magnif = 1, vel_magnif = 1, simulation = 1);
    }
  ];

  simulation_force_functions = [
    function getForceProjectile(x, y) {
      if (y > 0) {
        force = new Vector(0, 0);
        v.info_array[0] = 0, v.info_array[1] = 0;
        return force;
      }

      force = new Vector(0, mass * gravity);
      return force;
    },

    function getForceSpring(x, y) {
      force = new Vector(-k * x, 0);
      return force;
    }
  ];

  options = [];
  for (var i = 0; i < number_simulations; i++) {
    options.push(false);
  }

  for (var i = 0; i < number_simulations; i++) {
    button = createButton("<b>Start/Reset " + simulation_names[i] + " Simulation</b>");
    button.size(100, 50);
    button.mousePressed(simulation_functions[i]);
  }

  simulation_functions[0]();
}

function initializePosition() {
  circle(p.info_array[0], p.info_array[1], radius);

  v.setColor(vel_color);
  v.setMagnif(vel_magnif);

  f = getForce(p.info_array[0], p.info_array[1]);

  a = shrinkVector(f, mass);
  a.setColor(accel_color);
  a.setMagnif(accel_magnif);
  drawVector(p.info_array[0], p.info_array[1], v);
  drawVector(p.info_array[0], p.info_array[1], a);
}

function selectSimulation(selection) {
  selected_simulation = selection
  for (var i = 0; i < options.length; i++) {
    if (i == selected_simulation) {
      options[i] = true;
    } else {
      options[i] = false;
    }
  }
}

/* function to initialize Newton's law and create canvas */
function initialize(m, g, dt, px, py, vx, vy, r, µ, K, a_magnif, v_magnif, selected_sim) {

  mass = m;
  gravity = g;
  delta_t = dt;
  p = new Vector(px, py);
  v = new Vector(vx, vy);
  radius = r;
  mu = µ;
  k = K;
  accel_magnif = a_magnif;
  accel_color = [0, 255, 0];
  vel_magnif = v_magnif;
  vel_color = [255, 0, 0];

  selectSimulation(selected_sim);
}

function updateCanvas() {
  translate(width / 2, height / 2);
  fill(255, 255, 255);
  rect(-width / 2 - 10, -height / 2 - 10, width + 20, height + 20);
  stroke(101, 67, 33);
  line(-width, 0, width, 0);
  stroke(0, 0, 0);
  fill(0, 0, 0);
  circle(0, 0, 5);
}

function updatePosition() {
  circle(p.info_array[0], p.info_array[1], radius);

  f = getForce(p.info_array[0], p.info_array[1]);

  a = shrinkVector(f, mass);
  a.setColor(accel_color);
  a.setMagnif(accel_magnif);
  drawVector(p.info_array[0], p.info_array[1], a);

  v.add(scaleVector(a, delta_t));
  v.setColor(vel_color);
  v.setMagnif(vel_magnif);
  drawVector(p.info_array[0], p.info_array[1], v);

  p.add(scaleVector(v, delta_t));
}

function getForce(x, y) {
  /* Function for force on object at point(x,y) */
  return simulation_force_functions[selected_simulation](x, y);
}

class Vector {
  /* custom Vector class */

  constructor(x, y) {
    this.info_array = [x, y, sqrt(x * x + y * y), arctan(y, x), 1]
    this.color_array = [0, 0, 0];
  }

  setColor(rgb_color_array) {
    this.color_array = rgb_color_array;
  }

  setMagnif(magnif) {
    this.info_array[4] = magnif;
  }

  scale(c) {
    this.info_array[0] = c * this.info_array[0];
    this.info_array[1] = c * this.info_array[1];
    this.info_array[2] = sqrt(this.info_array[0] * this.info_array[0] + this.info_array[1] * this.info_array[1]);
    this.info_array[3] = arctan(this.info_array[1], this.info_array[0]);
  }

  shrink(c) {
    this.info_array[0] = this.info_array[0] / c;
    this.info_array[1] = this.info_array[1] / c;
    this.info_array[2] = sqrt(this.info_array[0] * this.info_array[0] + this.info_array[1] * this.info_array[1]);
    this.info_array[3] = arctan(this.info_array[1], this.info_array[0]);
  }

  add(v) {
    this.info_array[0] = this.info_array[0] + v.info_array[0];
    this.info_array[1] = this.info_array[1] + v.info_array[1];
    this.info_array[2] = sqrt(this.info_array[0] * this.info_array[0] + this.info_array[1] * this.info_array[1]);
    this.info_array[3] = arctan(this.info_array[1], this.info_array[0]);
  }

}

function drawVector(x, y, vector) {
  /* Function to draw a vector */
  drawArrow(x, y, x + vector.info_array[4] * vector.info_array[0], y + vector.info_array[4] * vector.info_array[1], vector.color_array);
}

function scaleVector(v, c) {
  /* Function to scale a vector's magnitude by a constant */
  v_new = new Vector(c * v.info_array[0], c * v.info_array[1]);
  v_new.setColor(v.color_array);
  v_new.setMagnif(v.info_array[4]);
  return v_new;
}

function shrinkVector(v, c) {
  /* Function to divide a vector's magnitude by a constant */
  v_new = new Vector(v.info_array[0] / c, v.info_array[1] / c);
  v_new.setColor(v.color_array);
  v_new.setMagnif(v.info_array[4]);
  return v_new;
}

function drawArrow(x1, y1, x2, y2, color_array) {
  /* Function to draw an arrow */
  stroke(color_array[0], color_array[1], color_array[2]);
  fill(color_array[0], color_array[1], color_array[2]);
  s = dist(x1, y1, x2, y2) / 10;
  push();
  translate(x2, y2);
  rotate(atan2(y2 - y1, x2 - x1));
  triangle(-s * 2, -s, 0, 0, -s * 2, s);
  pop();
  line(x1, y1, x2, y2);
  stroke(0, 0, 0);
  fill(0, 0, 0);
}

function arctan(y, x) {
  /* Custom arctan function */
  y_abs = abs(y);
  x_abs = abs(x);
  if (x >= 0 && y <= 0) {
    return atan(y_abs / x_abs);
  } else if (x <= 0 && y <= 0) {
    return -atan(y_abs / x_abs);
  } else if (x <= 0 && y >= 0) {
    return atan(y_abs / x_abs);
  } else if (x >= 0 && y >= 0) {
    return -atan(y_abs / x_abs);
  }
  return 0;
}

function sin_point(x, y) {
  /* Cusom sine function */
  return -signum(y) * abs(sin(arctan(y, x)));
}

function cos_point(x, y) {
  /* Custom cosine function */
  return signum(x) * abs(cos(arctan(y, x)));
}

function signum(f) {
  /* signum function */
  if (f > 0) {
    return 1.0;
  } else if (f < 0) {
    return -1.0;
  } else {
    return 0.0;
  }
}
