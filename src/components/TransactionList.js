
import React from "react";

function TransactionList({
  transactions = [],
  loggedInUser,
  isAdmin,
  isStaff,
}) {
  const userId =
    loggedInUser?.id ??
    loggedInUser?.membershipId ??
    loggedInUser?.email ??
    loggedInUser?.username ??
    loggedInUser?.name;

  // Admin and Staff can see all transactions.
  // Members can see only their own transactions.
  const visibleTransactions =
    isAdmin || isStaff
      ? transactions
      : transactions.filter(
          (transaction) =>
            transaction.userId != null &&
            userId != null &&
            String(transaction.userId) === String(userId)
        );

  return (
    <div className="list-card">
      <h2>Transaction History</h2>

      {!isAdmin && !isStaff && (
        <p>Showing your own borrowing and return history.</p>
      )}

      {visibleTransactions.length === 0 ? (
        <p>No transactions have been recorded yet.</p>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                {(isAdmin || isStaff) && <th>User</th>}
                <th>Book</th>
                <th>Type</th>
                <th>Quantity</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {visibleTransactions
                .slice()
                .reverse()
                .map((transaction) => (
                  <tr key={transaction.id}>
                    {(isAdmin || isStaff) && (
                      <td>{transaction.userName || "Unknown"}</td>
                    )}

                    <td>{transaction.bookTitle}</td>
                    <td>{transaction.type}</td>
                    <td>{transaction.quantity}</td>
                    <td>{transaction.date}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default TransactionList;
