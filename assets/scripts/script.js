const books = [];

const RENDER_BOOKS = "render-books";
const STORAGE_KEY = "books";


const kotakPencarian = document.getElementById("kotak-pencari");
let searchQuery;
const hapusSemuaBukuTombol = document.getElementById("tombol-hapus-semua")

function isStorageExist() {
    if (typeof Storage === undefined) {
        alert("Browser anda tidak mendukung local storage");
        return false;
    }
    return true;
}

const findIndexBook = (id) => {
    for (const index in books) {
        if(books[index].id == id) {
            return index;
        }
    }
    return -1;
};

const findBook = (id) => {
    const bookFinded = books.find((item) => item.id == id);
    return bookFinded;
};

function removeBook(id) {
    const deletedBook = findIndexBook(id);

    if (deletedBook === -1) return;
    books.splice(deletedBook, 1);

    document.dispatchEvent(new Event(RENDER_BOOKS));
    saveData();
}

function switchStatusBook (id) {
    const book = findBook(id);

    book.isComplete = !book.isComplete;
    document.dispatchEvent(new Event(RENDER_BOOKS));
    saveData();
}

const saveData = () => {
    if (isStorageExist()) {
        const dataParsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, dataParsed);
        document.dispatchEvent(new Event(RENDER_BOOKS));
    }
};

function loadDataFromStorage() {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));

    if (data !== null) {
        for (const book of data) {
            books.push(book);
        }
    }

    document.dispatchEvent(new Event(RENDER_BOOKS));
}

function generateRandomId() {
    return +new Date();
}

function generateBookObject(id, title, author, desc, isComplete, year)  {
    return {
        id,
        title,
        author,
        desc,
        isComplete,
        year,
    };
}

function addBook() {
    const title = document.getElementById("judul-buku").value;
    const desc = document.getElementById("desk-buku").value;
    const author = document.getElementById("pen-buku").value;
    const isComplete = document.getElementById("tipe-buku-selesai").checked;
    const year = document.getElementById("tahun-buku").value;
    const id = generateRandomId();

    const book = generateBookObject(id, title, author, desc, isComplete, year);
    books.push(book);
    saveData();
    document.dispatchEvent(new Event(RENDER_BOOKS));
}

function makeBook(book) {
    const title = document.createElement("h3");
    title.innerText = book.title;

    const year = document.createElement("h4");
    year.innerText = book.year;

    const author = document.createElement("p");
    author.innerText = book.author;

    const bookHead = document.createElement("p");
    bookHead.classList.add("book-head");
    bookHead.append(title, year, author);

    const sectionDesc = document.createElement("h5");
    sectionDesc.innerText = "Deskripsi Singkat";

    const bookDesc = document.createElement("p");
    bookDesc.innerText = book.desc;

    const bookDescContainer = document.createElement("div");
    bookDescContainer.classList.add("book-desc");
    bookDescContainer.append(sectionDesc, bookDesc);

    const iconSampah =  document.createElement("img");
    iconSampah.setAttribute("src", "assets/images/icon-sampah.png");

    const iconSampahDiv = document.createElement("div");
    iconSampahDiv.classList.add("icon-sampah");
    iconSampahDiv.append(iconSampah);
    iconSampahDiv.addEventListener("click", function () {
        removeBook(book.id);
    });

    const iconCentang = document.createElement("img");
    iconCentang.setAttribute("src", "assets/images/icon-centang.png")

    const iconCentangDiv = document.createElement("div");
    iconCentangDiv.classList.add("icon-centang");
    iconCentangDiv.append(iconCentang);
    iconCentangDiv.addEventListener("click", function () {
        switchStatusBook(book.id);
    });

    const bookActionDiv = document.createElement("div");
    bookActionDiv.classList.add("book-action");
    bookActionDiv.append(iconSampahDiv, iconCentangDiv);

    const cardBook =  document.createElement("div");
    cardBook.classList.add("card-book");
    cardBook.append(bookHead, bookDescContainer, bookActionDiv);
    cardBook.setAttribute("id", `book-${book.id}`)

    return cardBook;
}

document.addEventListener("DOMContentLoaded", function () {
    const submitForm = document.getElementById("form-add");

    submitForm.addEventListener("submit", function (e) {
        e.preventDefault();
        addBook();
    });

    if (isStorageExist()) {
        loadDataFromStorage();
    }
});

document.addEventListener(RENDER_BOOKS, function () {
    const unreadBooks = document.getElementById("buku-belum-dibaca");
    const finishReadBooks = document.getElementById("buku-sudah-dibaca");
    unreadBooks.innerHTML = "<h2>Buku Belum DiBaca</h2>";
    finishReadBooks.innerHTML = "<h2>Buku Sudah DiBaca</h2>";
  
    if (!kotakPencarian.value) {
      books.map((item) => {
        const book = makeBook(item);
  
        if (!item.isComplete) {
          unreadBooks.append(book);
        } else {
          finishReadBooks.append(book);
        }
      });
    } else {
      books
        .filter((book) => {
          console.log(book.title);
          return book.title.toLowerCase().includes(searchQuery);
        })
        .map((item) => {
          const book = makeBook(item);
  
          if (!item.isComplete) {
            unreadBooks.append(book);
          } else {
            finishReadBooks.append(book);
          }
        });
    }
});


hapusSemuaBukuTombol.addEventListener("click", function (e) {
    localStorage.clear();
    window.alert("Semua buku telah dihapus!");
    location.reload();
});

kotakPencarian.addEventListener("change", function () {
    searchQuery = kotakPencarian.value.toLowerCase();
    document.dispatchEvent(new Event(RENDER_BOOKS));
});