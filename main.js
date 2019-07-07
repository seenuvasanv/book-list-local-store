class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

class UI {
  static displayBooks() {
    const books = Store.getBooks();
    books.forEach(book => UI.addBookToList(book));
  }

  static addBookToList(book) {
    const tableBody = document.querySelector("#book-list");
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td class='isbn'>${book.isbn}</td>
        <td><a href='#'
        class='btn btn-danger btn-sm delete'>X</a></td>
        `;
    tableBody.appendChild(row);
  }

  static clearFields() {
    document.querySelector("#title").value = "";
    document.querySelector("#author").value = "";
    document.querySelector("#isbn").value = "";
  }

  static deleteBook(element) {
    if (element.classList.contains("delete")) {
      element.parentElement.parentElement.remove();
    }
  }

  static showAlert(message, className) {
    if (!document.querySelector(`.alert-${className}`)) {
      const div = document.createElement("div");
      div.className = `alert alert-${className}`;
      div.appendChild(document.createTextNode(message));
      const alert = document.querySelector("#alertMessage");
      alert.appendChild(div);

      // Vanish in 3 seconds
      setTimeout(() => {
        document.querySelector(".alert").remove();
      }, 3000);
    }
  }
}

class Store {
  static getBooks() {
    let books = localStorage.getItem("books");
    if (!books) {
      books = [];
    } else {
      books = JSON.parse(books);
    }
    return books;
  }

  static addBook(book) {
    const books = Store.getBooks();

    books.push(book);

    localStorage.setItem("books", JSON.stringify(books));
  }

  static removeBook(isbn) {
    const books = Store.getBooks();
    const updatedList = books.filter(book => book.isbn !== isbn);
    localStorage.setItem("books", JSON.stringify(updatedList));
  }
}

// Event: display books
document.addEventListener("DOMContentLoaded", UI.displayBooks());

// Event: submit form
document.querySelector("#book-form").addEventListener("submit", e => {
  e.preventDefault();
  const title = document.querySelector("#title").value.trim();
  const author = document.querySelector("#author").value.trim();
  const isbn = document.querySelector("#isbn").value.trim();

  if (title === "" || author === "" || isbn === "") {
    UI.showAlert("Enter all the fields", "danger");
  } else {
    let book = new Book(title, author, isbn);
    UI.addBookToList(book);

    // Add book to store
    Store.addBook(book);

    // Show success message
    UI.showAlert("Book was added successfully", "success");

    // Clear fields
    UI.clearFields();
  }
});

// Event: delete book
document.querySelector("tbody").addEventListener("click", e => {
  UI.deleteBook(e.target);

  // Remove book from store;
  let isbn = e.target.parentElement.previousElementSibling.textContent;
  Store.removeBook(isbn);
  // Delete message
  UI.showAlert("Book was Removed", "info");
});
