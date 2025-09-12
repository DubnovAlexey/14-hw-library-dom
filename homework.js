// ========== Салют 🎆 ==========
const canvas = document.getElementById("explosion-canvas");
const ctx = canvas.getContext("2d");
resizeCanvas();

window.addEventListener("resize", resizeCanvas);

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function launchFirework(x = canvas.width / 2, y = canvas.height / 2) {
    const particles = [];

    for (let i = 0; i < 80; i++) {
        particles.push({
            x,
            y,
            angle: Math.random() * Math.PI * 2,
            speed: Math.random() * 6 + 2,
            radius: Math.random() * 4 + 2,
            alpha: 1,
            color: `hsl(${Math.random() * 360}, 100%, 50%)`
        });
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(p => {
            p.x += Math.cos(p.angle) * p.speed;
            p.y += Math.sin(p.angle) * p.speed;
            p.alpha -= 0.02;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = p.color.replace(")", `, ${p.alpha})`).replace("hsl", "hsla");
            ctx.fill();
        });

        if (particles.some(p => p.alpha > 0)) {
            requestAnimationFrame(animate);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    animate();
}

// ========== Звук салюта 🔊 ==========
function playFireworkSound() {
    const sound = new Audio("https://actions.google.com/sounds/v1/explosions/explosion.ogg");
    sound.volume = 0.5;
    sound.play().catch(() => {});
}
