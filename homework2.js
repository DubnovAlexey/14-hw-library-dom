const library = [];
const playlist = [
    "./music/1.mp3",
    "./music/2.mp3",
    "./music/3.mp3",
    "./music/4.mp3",
    "./music/5.mp3"
];
let currentTrack = 0;// Индекс текущего трека, по умолчанию 0, т.е. первый трек в массиве

// Звук салюта, загружается один раз, чтобы избежать задержек при воспроизведении
const fireworkSound = new Audio("https://actions.google.com/sounds/v1/explosions/explosion.ogg");
fireworkSound.volume = 0.5;

// Класс для книги
function Book(isbn, title, author, year) {
    this.isbn = isbn;
    this.title = title;
    this.author = author;
    this.year = +year;
}

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("bookForm");
    const tableBody = document.querySelector("#libraryTable tbody");
    const music = document.getElementById("bg-music");
    const playBtn = document.getElementById("play-btn");

    // 🎵 Музыкальный плейлист, зацикленный, переключение треков по окончании
    music.src = playlist[currentTrack];
    music.addEventListener("ended", () => {
        currentTrack = (currentTrack + 1) % playlist.length;
        music.src = playlist[currentTrack];
        music.play().catch(() => {
        });
    });

    playBtn.addEventListener("click", () => {
        if (music.paused) {
            music.play().catch(() => {
            });
            playBtn.textContent = "⏸ Остановить музыку";
        } else {
            music.pause();
            playBtn.textContent = "🎵 Включить музыку";
        }
    });

    // 📚 Добавление книги, проверка на уникальность ISBN, обновление таблицы
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

            // 🎆 Салют
            launchFirework();// Запуск салюта в центре экрана, можно изменить координаты, передав x и y
            fireworkSound.play().catch(() => {
            });
        } else {
            alert("Книга с таким ISBN уже есть в библиотеке!");
        }
    });
});

// 📚 Работа с таблицей
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

// 🎆 Салют
const canvas = document.getElementById("explosion-canvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

function launchFirework(x = canvas.width / 2, y = canvas.height / 2) {
    const particles = [];

    for (let i = 0; i < 250; i++) {
        particles.push({
            x,
            y,
            dx: (Math.random() - 0.5) * 20,
            dy: (Math.random() - 0.5) * 20,
            radius: 3,
            alpha: 1,
            color: `hsl(${Math.random() * 360}, 100%, 50%)`
        });
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(p => {
            p.x += p.dx;
            p.y += p.dy;
            p.alpha -= 0.01;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${Math.random() * 360}, 100%, 50%, ${p.alpha})`;
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