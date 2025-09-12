const library = [];
const playlist = [
    "./music/1.mp3",
    "./music/2.mp3",
    "./music/3.mp3",
    "./music/4.mp3",
    "./music/5.mp3"
];
let currentTrack = 0;

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("bookForm");
    const tableBody = document.querySelector("#libraryTable tbody");
    const music = document.getElementById("bg-music");
    const playBtn = document.getElementById("play-btn");

    // ========== Музыкальный плейлист ==========
    music.src = playlist[currentTrack];
    music.addEventListener("ended", () => {
        currentTrack = (currentTrack + 1) % playlist.length;
        music.src = playlist[currentTrack];
        music.play();
    });

    playBtn.addEventListener("click", () => {
        if (music.paused) {
            music.play();
            playBtn.textContent = "⏸ Остановить музыку";
        } else {
            music.pause();
            playBtn.textContent = "🎵 Включить музыку";
        }
    });

    // ========== Форма ==========
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const isbn = document.getElementById("isbn").value.trim();
        const title = document.getElementById("title").value.trim();
        const author = document.getElementById("author").value.trim();
        const year = document.getElementById("year").value.trim();

        if (findBook(library, isbn) === -1) {
            const book = new Book(isbn, title, author, year);
            library.push(book);
            printLibrary(library, tableBody);
            form.reset();

            // запускаем салют 🎆
            launchFirework();
            playFireworkSound();
        } else {
            alert("Книга с таким ISBN уже есть в библиотеке!");
        }
    });
});

// ========== Работа с таблицей ==========
function printLibrary(library, tableBody) {
    tableBody.innerHTML = "";

    library.forEach((book, index) => {
        const row = document.createElement("tr");

        row.innerHTML = `
      <td>${index + 1}</td>
      <td>${book.isbn}</td>
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.year}</td>
      <td><button class="delete-btn">Удалить</button></td>
    `;

        row.querySelector(".delete-btn").addEventListener("click", () => {
            library.splice(index, 1);
            printLibrary(library, tableBody);
        });

        tableBody.appendChild(row);
    });
}

function findBook(library, isbn) {
    return library.findIndex(b => b.isbn === isbn);
}

function Book(isbn, title, author, year) {
    this.isbn = isbn;
    this.title = title;
    this.author = author;
    this.year = +year;
}

// ========== Салют 🎆 ==========
const canvas = document.getElementById("explosion-canvas");
const ctx = canvas.getContext("2d");
resizeCanvas();

window.addEventListener("resize", resizeCanvas);

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function launchFirework() {
    const particles = [];
    const x = canvas.width / 2;
    const y = canvas.height / 2;

    for (let i = 0; i < 50; i++) {
        particles.push({
            x: x,
            y: y,
            angle: Math.random() * Math.PI * 2,
            speed: Math.random() * 5 + 2,
            radius: Math.random() * 3 + 2,
            alpha: 1
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
            ctx.fillStyle = `rgba(255, 100, 50, ${p.alpha})`;
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
    const sound = new Audio("https://actions.google.com/sounds/v1/ambiences/fireworks_burst.ogg");
    sound.volume = 0.4;
    sound.play().catch(() => {});
}
