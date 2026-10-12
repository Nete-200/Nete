
import React from "react";

import TransactionForm from "../components/TransactionForm";
import TransactionList from "../components/TransactionList";

function Transactions({
  books,
  setBooks,
  transactions,
  setTransactions,
  loggedInUser,
}) {
  const role = loggedInUser?.role?.toLowerCase();

  const isAdmin = role === "admin";
  const isStaff = role === "staff";
  const isMember = role === "member";

  if (!loggedInUser) {
    return <p>Please log in to access transactions.</p>;
  }

  return (
    <div className="transactions-page">
      <h1>Transactions</h1>

      <p>
        Borrow and return books, manage stock,
        and view transaction history.
      </p>

      <TransactionForm
        books={books}
        setBooks={setBooks}
        transactions={transactions}
        setTransactions={setTransactions}
        loggedInUser={loggedInUser}
        isAdmin={isAdmin}
        isStaff={isStaff}
        isMember={isMember}
      />

      <TransactionList
        transactions={transactions}
        loggedInUser={loggedInUser}
        isAdmin={isAdmin}
        isStaff={isStaff}
      />
    </div>
  );
}

export default Transactions;
