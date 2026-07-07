const canvas = document.getElementById("particles-bg");
const ctx = canvas.getContext("2d");

let particles = [];
let numParticles = 100;
let connectDistance = 150;

function updateSettings() {

    const area = window.innerWidth * window.innerHeight;

    // Roughly one particle every 18,000px²
    numParticles = Math.max(35, Math.floor(area / 18000));

    if (window.innerWidth < 768) {
        connectDistance = 90;
    } else if (window.innerWidth < 1200) {
        connectDistance = 120;
    } else {
        connectDistance = 150;
    }

}

function resize() {

    const dpr = window.devicePixelRatio || 1;

    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;

    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    updateSettings();
    init();

}

window.addEventListener("resize", resize);

class Particle {

    constructor() {

        this.x = Math.random() * window.innerWidth;
        this.y = Math.random() * window.innerHeight;

        this.vx = (Math.random() - 0.5) * 1;
        this.vy = (Math.random() - 0.5) * 1;

        this.size = 2;

    }

    update() {

        this.x += this.vx;
        this.y += this.vy;

        if (this.x <= 0 || this.x >= window.innerWidth)
            this.vx *= -1;

        if (this.y <= 0 || this.y >= window.innerHeight)
            this.vy *= -1;

    }

    draw() {

        ctx.fillStyle = "#ffffff";

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

    }

}

function init() {

    particles = [];

    for (let i = 0; i < numParticles; i++) {

        particles.push(new Particle());

    }

}

function animate() {

    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    for (let i = 0; i < particles.length; i++) {

        const p = particles[i];

        p.update();
        p.draw();

        for (let j = i + 1; j < particles.length; j++) {

            const other = particles[j];

            const dx = p.x - other.x;
            const dy = p.y - other.y;

            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < connectDistance) {

                ctx.strokeStyle = `rgba(255,255,255,${1 - dist / connectDistance})`;

                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(other.x, other.y);
                ctx.stroke();

            }

        }

    }

    requestAnimationFrame(animate);

}

resize();
animate();