
import React from "react";
import { NavLink } from "react-router-dom";

function Navbar({ loggedInUser }) {
  const getLinkClass = ({ isActive }) =>
    isActive ? "nav-link active" : "nav-link";

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        📚 Community Library
      </div>

      <div className="navbar-links">
        <NavLink to="/" end className={getLinkClass}>
          Dashboard
        </NavLink>

        <NavLink to="/books" className={getLinkClass}>
          Books
        </NavLink>

        <NavLink to="/transactions" className={getLinkClass}>
          Transactions
        </NavLink>

        <NavLink to="/users" className={getLinkClass}>
          Users
        </NavLink>

        {loggedInUser && (
          <span className="user-info">
            {loggedInUser.name} ({loggedInUser.role})
          </span>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
