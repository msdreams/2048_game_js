class TunnelBackground {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.centerX = this.width / 2;
    this.centerY = this.height / 2;
    this.dots = [];
    this.maxDots = 150;
    this.speed = 0.5;

    this.resizeCanvas();
    this.createDots();
    this.animate();
    window.addEventListener('resize', () => this.resizeCanvas());
  }

  resizeCanvas() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.centerX = this.width / 2;
    this.centerY = this.height / 2;
  }

  createDots() {
    for (let i = 0; i < this.maxDots; i++) {
      this.dots.push(this.createDot());
    }
  }

  createDot() {
    const angle = Math.random() * 2 * Math.PI;
    const distance = Math.random() * (this.width / 2);

    return {
      x: Math.cos(angle) * distance + this.centerX,
      y: Math.sin(angle) * distance + this.centerY,
      radius: Math.random() * 2 + 1,
      speed: Math.random() * this.speed + 0.5,
      angle: angle,
      distance: distance
    };
  }

  updateDot(dot) {
    dot.distance += dot.speed;
    dot.x = Math.cos(dot.angle) * dot.distance + this.centerX;
    dot.y = Math.sin(dot.angle) * dot.distance + this.centerY;

    if (
      dot.x < 0 ||
      dot.x > this.width ||
      dot.y < 0 ||
      dot.y > this.height
    ) {
      const angle = Math.random() * 2 * Math.PI;
      dot.distance = 0;
      dot.x = Math.cos(angle) * dot.distance + this.centerX;
      dot.y = Math.sin(angle) * dot.distance + this.centerY;
      dot.speed = Math.random() * this.speed + 0.5;
    }
  }

  drawDot(dot) {
    this.ctx.beginPath();
    this.ctx.arc(dot.x, dot.y, dot.radius, 0, 2 * Math.PI);
    this.ctx.fillStyle = '#446583';
    this.ctx.fill();
    this.ctx.closePath();
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    
    this.dots.forEach((dot) => {
      this.updateDot(dot);
      this.drawDot(dot);
    });

    requestAnimationFrame(() => this.animate());
  }
}

module.exports = TunnelBackground;
