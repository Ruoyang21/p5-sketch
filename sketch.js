/* 
Title:Fortune Wheel
Author: Ruoyang Xu
Date: 2025.11.29

Instructions:
- This is a one-button fortune-telling game.
- Click to spin the wheel.
- When the wheel stops, a random divination result is shown.
- Dataset: The six symbols of Xiao Liu Ren (小六壬).
- DOM: The result box is updated dynamically.

Optional blurb:
-This game uses an ancient Chinese divination system, “小六壬,” 
 visualized as a spinning wheel. Each result corresponds to 
 a traditional symbolic meaning.
   
Acknowledgements:
- Inspired by traditional Six-Ren divination and classic fortune wheels.
- Star reference：Week 4 practice：Array of raindrops
- Built with p5.js.
*/

//  Dataset: Xiao Liu Ren Archive
let fortuneArchive = [
  {
    labelCN: "大安",
    labelEN: "Great Peace",
    meaning:
      "Things remain calm and stable. Peace brings quiet, steady fortune.",
    emotion: "good",
    color: "#EAE0D7",
  },
  {
    labelCN: "留连",
    labelEN: "Lingering Delay",
    meaning:
      "Progress slows down. Repetition or delays appear — patience is required.",
    emotion: "neutral",
    color: "#75809C",
  },
  {
    labelCN: "速喜",
    labelEN: "Swift Joy",
    meaning:
      "Good luck is approaching quickly. Something delightful is coming soon.",
    emotion: "good",
    color: "#8E9AAB",
  },
  {
    labelCN: "赤口",
    labelEN: "Red Mouth",
    meaning:
      "Arguments or tension may arise. Be cautious with speech and conflict.",
    emotion: "bad",
    color: "#E8C0BD",
  },
  {
    labelCN: "小吉",
    labelEN: "Small Blessing",
    meaning:
      "A small moment of good fortune appears. Subtle but meaningful progress.",
    emotion: "good",
    color: "#8D8FA4",
  },
  {
    labelCN: "空亡",
    labelEN: "Void Misfortune",
    meaning:
      "Plans may dissolve or fail to manifest. Step back and wait for a better time.",
    emotion: "bad",
    color: "#8A8A8A",
  },
];

let stars = [];
let wheel;

class FortuneWheel {
  constructor(data) {
    this.data = data;
    this.angle = 0;
    this.spinning = false;
    this.speed = 0;
    this.result = null;
  }

  // Start the spinning animation
  startSpin() {
    if (this.spinning) return;

    this.speed = random(20, 30);
    this.spinning = true;

    // Reset result display
    let box = document.getElementById("fortune-box");
    box.className = "";
    box.innerHTML = "Spinning…";
  }

  // Update wheel physics
  update() {
    if (this.spinning) {
      this.angle += this.speed; // rotate
      this.speed *= 0.97;

      if (this.speed < 0.2) {
        this.spinning = false;
        this.determineResult();
      }
    }
  }

  // Draw wheel and pointer
  draw() {
    push();
    translate(width / 2, height / 2);
    angleMode(DEGREES);

    let sectorAngle = 360 / this.data.length;

    for (let i = 0; i < this.data.length; i++) {
      push();

      rotate(this.angle + i * sectorAngle);

      // draw colored arc
      fill(this.data[i].color);
      arc(0, 0, 500, 500, 0, sectorAngle);

      // draw labels
      rotate(sectorAngle / 2);
      fill("#fff8dc");
      textAlign(CENTER, CENTER);

      textSize(22);
      text(this.data[i].labelCN, 165, -10);

      textSize(14);
      text(this.data[i].labelEN, 165, 18);

      pop();
    }

    // Draw Pointer
    fill("#FFF385");
    triangle(-20, -260, 20, -260, 0, -220);

    pop();
  }

  // Determine which sector the pointer lands on
  determineResult() {
    let sectorAngle = 360 / this.data.length;
    let fixedAngle = (360 - (this.angle % 360) + 270) % 360;
    let index = floor(fixedAngle / sectorAngle);

    this.result = this.data[index];
    this.showResult();
  }

  // Update DOM result box
  showResult() {
    let box = document.getElementById("fortune-box");
    box.innerHTML = `
      <b>${this.result.labelCN} — ${this.result.labelEN}</b><br>
      ${this.result.meaning}
    `;

    if (this.result.emotion === "good") box.classList.add("blessing");
    else if (this.result.emotion === "bad") box.classList.add("curse");
  }
}

function setup() {
  let canvas = createCanvas(600, 600);
  canvas.parent("game-wrapper");

  wheel = new FortuneWheel(fortuneArchive);

  // Initialize background stars
  for (let i = 0; i < 80; i++) {
    stars.push({
      x: random(width),
      y: random(height),
      size: random(1, 3),
      speed: random(0.2, 1),
    });
  }
}

function draw() {
  background(26, 11, 46);
  drawStars();
  wheel.update();
  wheel.draw();
}

// Draw animated starry background
function drawStars() {
  noStroke();
  fill(255, 255, 255, 180);

  for (let s of stars) {
    circle(s.x, s.y, s.size);

    s.y += s.speed;
    if (s.y > height) {
      s.y = 0;
      s.x = random(width);
    }
  }
}

function mousePressed() {
  wheel.startSpin();
}
