
import React, { useEffect, useState } from "react";

const emptyForm = {
  title: "",
  author: "",
  genre: "",
  isbn: "",
  quantity: "",
};

function BookForm({
  books = [],
  setBooks,
  editingBook,
  setEditingBook,
  isAdmin = false,
}) {
  const [formData, setFormData] = useState({ ...emptyForm });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (editingBook) {
      setFormData({
        title: editingBook.title || "",
        author: editingBook.author || "",
        genre: editingBook.genre || "",
        isbn: editingBook.isbn || "",
        quantity: String(editingBook.quantity ?? ""),
      });

      setError("");
      setMessage("");
    } else {
      setFormData({ ...emptyForm });
      setError("");
    }
  }, [editingBook]);

  if (!isAdmin) return null;

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setMessage("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!isAdmin) {
      setError("Only an Admin can manage books.");
      return;
    }

    const title = formData.title.trim();
    const author = formData.author.trim();
    const genre = formData.genre.trim();
    const isbn = formData.isbn.trim();
    const quantity = Number(formData.quantity);

    if (
      !title ||
      !author ||
      !genre ||
      !isbn ||
      formData.quantity.trim() === ""
    ) {
      setError("Please complete all fields.");
      return;
    }

    if (!Number.isSafeInteger(quantity) || quantity < 0) {
      setError("Quantity must be a whole number of 0 or more.");
      return;
    }

    const duplicateISBN = books.some(
      (book) =>
        String(book.isbn).trim().toLowerCase() ===
          isbn.toLowerCase() &&
        String(book.id) !== String(editingBook?.id)
    );

    if (duplicateISBN) {
      setError("A book with this ISBN already exists.");
      return;
    }

    if (editingBook) {
      const oldQuantity = Number(editingBook.quantity ?? 0);
      const oldAvailable = Number(
        editingBook.available ?? oldQuantity
      );
      const borrowedCount = Math.max(
        0,
        oldQuantity - oldAvailable
      );

      if (quantity < borrowedCount) {
        setError(
          `Quantity cannot be less than the ${borrowedCount} copy/copies currently borrowed.`
        );
        return;
      }

      const updatedBook = {
        ...editingBook,
        title,
        author,
        genre,
        isbn,
        quantity,
        available: quantity - borrowedCount,
      };

      setBooks((previousBooks) =>
        previousBooks.map((book) =>
          String(book.id) === String(editingBook.id)
            ? updatedBook
            : book
        )
      );

      setEditingBook(null);
      setMessage("Book updated successfully.");
    } else {
      const newBook = {
        id: `${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 8)}`,
        title,
        author,
        genre,
        isbn,
        quantity,
        available: quantity,
      };

      setBooks((previousBooks) => [
        ...previousBooks,
        newBook,
      ]);

      setMessage("Book added successfully.");
    }

    setFormData({ ...emptyForm });
  };

  const handleCancel = () => {
    setEditingBook(null);
    setFormData({ ...emptyForm });
    setError("");
    setMessage("");
  };

  return (
    <section className="form-card">
      <h2>{editingBook ? "Update Book" : "Add New Book"}</h2>

      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}

      {message && (
        <div className="success-message" role="status">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="book-title">Title</label>
          <input
            id="book-title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter book title"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="book-author">Author</label>
          <input
            id="book-author"
            name="author"
            value={formData.author}
            onChange={handleChange}
            placeholder="Enter author name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="book-genre">Genre</label>
          <input
            id="book-genre"
            name="genre"
            value={formData.genre}
            onChange={handleChange}
            placeholder="e.g. Fiction"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="book-isbn">ISBN</label>
          <input
            id="book-isbn"
            name="isbn"
            value={formData.isbn}
            onChange={handleChange}
            placeholder="Enter ISBN"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="book-quantity">Total Quantity</label>
          <input
            id="book-quantity"
            name="quantity"
            type="number"
            min="0"
            step="1"
            value={formData.quantity}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-buttons">
          <button type="submit" className="primary-button">
            {editingBook ? "Save Changes" : "Add Book"}
          </button>

          {editingBook && (
            <button
              type="button"
              className="secondary-button"
              onClick={handleCancel}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </section>
  );
}

export default BookForm;
