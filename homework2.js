const library = [];
const playlist = [
    "./music/1.mp3",
    "./music/2.mp3",
    "./music/3.mp3",
    "./music/4.m4a",
    "./music/5.mp3"
];
let currentTrack = 0;

// Класс для книги
function Book(isbn, title, author, year) {
    this.isbn = isbn;
    this.title = title;
    this.author = author;
    this.year = +year;
}

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

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("bookForm");
    const tableBody = document.querySelector("#libraryTable tbody");
    const music = document.getElementById("bg-music");
    const playBtn = document.getElementById("play-btn");

    // Звук салюта
    const fireworkSound = new Audio("./music/11.mp3");
    fireworkSound.volume = 0.5;

    // Салют, перенесён сюда, чтобы избежать ошибок
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

        for (let i = 0; i < 300; i++) {
            particles.push({
                x,
                y,
                dx: (Math.random() - 0.5) * 20,
                dy: (Math.random() - 0.5) * 20,
                radius: 5,
                alpha: 1,
                color: `hsl(${Math.random() * 360}, 100%, 75%)`
            });
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(p => {
                p.x += p.dx;
                p.y += p.dy;
                p.alpha -= 0.005;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${Math.random() * 360}, 100%, 75%, ${p.alpha})`;
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

    // 🎵 Музыкальный плейлист
    music.src = playlist[currentTrack];
    music.volume = 1.0; // Устанавливаем громкость по умолчанию
    music.addEventListener("ended", () => {
        currentTrack = (currentTrack + 1) % playlist.length;
        music.src = playlist[currentTrack];
        music.play().catch(() => {});
    });

    playBtn.addEventListener("click", () => {
        if (music.paused) {
            music.play().catch(() => {});
            playBtn.textContent = "⏸ Остановить музыку";
        } else {
            music.pause();
            playBtn.textContent = "🎵 Включить музыку";
        }
    });

    // 📚 Добавление книги
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

            // 🎆 Приглушаем музыку перед запуском салюта
            music.volume = 0.1;

            // Запускаем салют и звук
            launchFirework();
            fireworkSound.play().catch(() => {});

            // Ограничиваем звук салюта 3 секундами
            setTimeout(() => {
                fireworkSound.pause();
                fireworkSound.currentTime = 0;
            }, 3000);

            // Возвращаем громкость музыки через 4 секунды
            setTimeout(() => {
                music.volume = 1.0;
            }, 4000);

        } else {
            alert("Книга с таким ISBN уже есть в библиотеке!");
        }
    });
});