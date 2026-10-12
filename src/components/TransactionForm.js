
import React, { useState } from "react";

function TransactionForm({
  books,
  setBooks,
  transactions,
  setTransactions,
  loggedInUser,
  isAdmin,
  isStaff,
  isMember,
}) {
  const [bookId, setBookId] = useState("");
  const [type, setType] = useState("Borrow");
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Identify the currently logged-in user.
  const userId =
    loggedInUser?.id ??
    loggedInUser?.membershipId ??
    loggedInUser?.email ??
    loggedInUser?.username ??
    loggedInUser?.name;

  const userName =
    loggedInUser?.name ??
    loggedInUser?.username ??
    loggedInUser?.email ??
    "Unknown user";

  const canAddStock = isAdmin || isStaff;

  const handleSubmit = (event) => {
    event.preventDefault();

    setError("");
    setMessage("");

    if (!loggedInUser || userId == null) {
      setError("Please log in with a valid user account.");
      return;
    }

    if (!bookId) {
      setError("Please select a book.");
      return;
    }

    const amount = Number(quantity);

    if (!Number.isInteger(amount) || amount <= 0) {
      setError("Quantity must be a whole number greater than 0.");
      return;
    }

    if (type === "Add Stock" && !canAddStock) {
      setError("Only Admin and Staff can add stock.");
      return;
    }

    if (
      !["Borrow", "Return", "Add Stock"].includes(type)
    ) {
      setError("Invalid transaction type.");
      return;
    }

    const selectedBook = books.find(
      (book) => String(book.id) === String(bookId)
    );

    if (!selectedBook) {
      setError("Book not found.");
      return;
    }

    const currentAvailable = Number(selectedBook.available);
    const currentQuantity = Number(selectedBook.quantity);

    if (
      !Number.isFinite(currentAvailable) ||
      !Number.isFinite(currentQuantity)
    ) {
      setError("The book's stock information is invalid.");
      return;
    }

    // Borrowing is limited to available copies.
    if (
      type === "Borrow" &&
      currentAvailable < amount
    ) {
      setError("Not enough copies available.");
      return;
    }

    // Calculate how many copies this user has borrowed
    // and not yet returned for this book.
    const outstandingBorrowed = transactions.reduce(
      (total, transaction) => {
        const sameBook =
          String(transaction.bookId) === String(selectedBook.id);

        const sameUser =
          String(transaction.userId) === String(userId);

        if (!sameBook || !sameUser) {
          return total;
        }

        const transactionQuantity = Number(transaction.quantity) || 0;

        if (transaction.type === "Borrow") {
          return total + transactionQuantity;
        }

        if (transaction.type === "Return") {
          return total - transactionQuantity;
        }

        return total;
      },
      0
    );

    // Users can only return books they have borrowed.
    if (type === "Return" && outstandingBorrowed < amount) {
      setError(
        "You cannot return more copies than you have borrowed."
      );
      return;
    }

    // Add stock increases both total quantity and availability.
    // Borrowing and returning change availability only.
    const updatedBooks = books.map((book) => {
      if (String(book.id) !== String(selectedBook.id)) {
        return book;
      }

      if (type === "Borrow") {
        return {
          ...book,
          available: currentAvailable - amount,
        };
      }

      if (type === "Return") {
        return {
          ...book,
          available: currentAvailable + amount,
        };
      }

      return {
        ...book,
        quantity: currentQuantity + amount,
        available: currentAvailable + amount,
      };
    });

    const newTransaction = {
      id: Date.now(),
      bookId: selectedBook.id,
      bookTitle: selectedBook.title,
      type,
      quantity: amount,
      userId,
      userName,
      date: new Date().toLocaleString(),
    };

    setBooks(updatedBooks);
    setTransactions((previousTransactions) => [
      ...previousTransactions,
      newTransaction,
    ]);

    setBookId("");
    setType("Borrow");
    setQuantity(1);
    setMessage("Transaction completed successfully.");
  };

  return (
    <div className="form-card">
      <h2>Book Transactions</h2>

      <p>
        Logged in as: <strong>{userName}</strong>
      </p>

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
          <label htmlFor="transaction-book">Book</label>

          <select
            id="transaction-book"
            value={bookId}
            onChange={(event) => setBookId(event.target.value)}
            required
          >
            <option value="">Select a book</option>

            {books.map((book) => (
              <option key={book.id} value={book.id}>
                {book.title} - Available: {book.available}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="transaction-type">
            Transaction Type
          </label>

          <select
            id="transaction-type"
            value={type}
            onChange={(event) => setType(event.target.value)}
          >
            <option value="Borrow">Borrow Book</option>
            <option value="Return">Return Book</option>

            {canAddStock && (
              <option value="Add Stock">Add Stock</option>
            )}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="transaction-quantity">
            Quantity
          </label>

          <input
            id="transaction-quantity"
            type="number"
            min="1"
            step="1"
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
            required
          />
        </div>

        <div className="form-buttons">
          <button
            type="submit"
            className="primary-button"
          >
            Complete Transaction
          </button>
        </div>
      </form>
    </div>
  );
}

export default TransactionForm;
