
import React from "react";

function BookList({
  books = [],
  isAdmin = false,
  onEdit,
  onDelete,
}) {
  if (!Array.isArray(books)) {
    return (
      <div className="error-message" role="alert">
        Unable to load books. Please check your saved book data.
      </div>
    );
  }

  return (
    <section className="book-list">
      <h2>Library Books</h2>

      {books.length === 0 ? (
        <p>No books have been added to the library yet.</p>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Genre</th>
                <th>ISBN</th>
                <th>Total Copies</th>
                <th>Available Copies</th>
                <th>Status</th>
                {isAdmin && <th>Actions</th>}
              </tr>
            </thead>

            <tbody>
              {books.map((book) => (
                <tr key={book.id}>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>{book.genre}</td>
                  <td>{book.isbn}</td>
                  <td>{book.quantity}</td>
                  <td>{book.available}</td>
                  <td>
                    {Number(book.available) < 2 ? (
                      <span className="low-stock">
                        Low Stock
                      </span>
                    ) : (
                      <span>Available</span>
                    )}
                  </td>

                  {isAdmin && (
                    <td>
                      <div className="form-buttons">
                        <button
                          type="button"
                          className="primary-button"
                          onClick={() => onEdit?.(book)}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="secondary-button"
                          onClick={() => onDelete?.(book.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default BookList;
