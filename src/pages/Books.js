

import React, { useState } from "react";
import BookForm from "../components/BookForm";
import BookList from "../components/BookList";

function Books({ books = [], setBooks, loggedInUser }) {
  const [editingBook, setEditingBook] = useState(null);

  const isAdmin =
    String(loggedInUser?.role || "").toLowerCase() === "admin";

  const handleEdit = (book) => {
    if (!isAdmin) return;

    setEditingBook(book);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = (id) => {
    if (!isAdmin) return;

    setBooks((currentBooks) =>
      currentBooks.filter(
        (book) => String(book.id) !== String(id)
      )
    );

    setEditingBook((current) =>
      current && String(current.id) === String(id)
        ? null
        : current
    );
  };

  return (
    <div>
      <h1>Book Management</h1>
      <p>View the community library collection.</p>

      {isAdmin && (
        <BookForm
          books={books}
          setBooks={setBooks}
          editingBook={editingBook}
          setEditingBook={setEditingBook}
          isAdmin={isAdmin}
        />
      )}

      <BookList
        books={books}
        isAdmin={isAdmin}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default Books;


