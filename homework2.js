const library = [];

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("bookForm");
    const tableBody = document.querySelector("#libraryTable tbody");

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
        } else {
            alert("Книга с таким ISBN уже есть в библиотеке!");
        }
    });
});

function printLibrary(library, tableBody) {
    tableBody.innerHTML = ""; // очищаем таблицу

    library.forEach((book, index) => {
        const row = document.createElement("tr");

        // № по порядку
        const numCell = document.createElement("td");
        numCell.textContent = index + 1;
        row.appendChild(numCell);

        // ISBN
        const isbnCell = document.createElement("td");
        isbnCell.textContent = book.isbn;
        row.appendChild(isbnCell);

        // Название
        const titleCell = document.createElement("td");
        titleCell.textContent = book.title;
        row.appendChild(titleCell);

        // Автор
        const authorCell = document.createElement("td");
        authorCell.textContent = book.author;
        row.appendChild(authorCell);

        // Год
        const yearCell = document.createElement("td");
        yearCell.textContent = book.year;
        row.appendChild(yearCell);

        // Действия
        const actionCell = document.createElement("td");
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Удалить";
        deleteBtn.classList.add("delete-btn");
        deleteBtn.addEventListener("click", () => {
            library.splice(index, 1); // удаляем книгу
            printLibrary(library, tableBody); // обновляем таблицу
        });
        actionCell.appendChild(deleteBtn);
        row.appendChild(actionCell);

        tableBody.appendChild(row);
    });
}

function findBook(library, isbn) {
    for (let i = 0; i < library.length; i++) {
        if (library[i].isbn === isbn) {
            return i;
        }
    }
    return -1;
}

function Book(isbn, title, author, year) {
    this.isbn = isbn;
    this.title = title;
    this.author = author;
    this.year = +year;
}
const audio = document.getElementById('bg-music');
const playButton = document.getElementById('play-btn');

const playlist = [
    './music/1.mp3',
    './music/2.mp3',
    './music/3.mp3',
    './music/4.mp3',
    './music/5.mp3'
];
let currentTrackIndex = 0;

function playNextTrack() {
    currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
    audio.src = playlist[currentTrackIndex];
    audio.play();
}

audio.addEventListener('ended', playNextTrack);

if (playButton) {
    playButton.addEventListener('click', () => {
        playButton.style.display = 'none';
        audio.src = playlist[currentTrackIndex];
        audio.play();
        const x = window.innerWidth / 2;
        const y = window.innerHeight / 2;
        createParticles(x, y);
    });
}
