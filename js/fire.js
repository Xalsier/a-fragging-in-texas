const canvas = document.getElementById('emberCanvas');
const ctx = canvas.getContext('2d');
let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;
window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
});
class Ember {
    constructor() { this.reset(); }
    reset() {
        this.x = width / 2 + (Math.random() - 0.5) * (width * 0.6);
        this.y = height + 10;
        this.size = Math.random() * 2.2 + 0.8;
        this.speedY = Math.random() * 0.8 + 0.4;
        this.speedX = (Math.random() - 0.5) * 0.6;
        this.opacity = Math.random() * 0.7 + 0.3;
        this.fadeRate = Math.random() * 0.003 + 0.001;
        const colors = ['#f97316', '#ea580c', '#c2410c', '#fef08a', '#dc2626'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
    }
    update() {
        this.y -= this.speedY;
        this.x += this.speedX + Math.sin(this.y * 0.02) * 0.3;
        this.opacity -= this.fadeRate;
        if (this.opacity <= 0 || this.y < -10) { this.reset(); }
    }
    draw() {
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.opacity);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}
const embers = Array.from({ length: 45 }, () => new Ember());
function animateEmbers() {
    ctx.clearRect(0, 0, width, height);
    embers.forEach(ember => { ember.update(); ember.draw(); });
    requestAnimationFrame(animateEmbers);
}
window.onload = () => { renderSlide(currentIndex, false); animateEmbers(); };