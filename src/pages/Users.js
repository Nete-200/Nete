

import React, { useState } from "react";
import UserForm from "../components/UserForm";
import UserList from "../components/UserList";

function Users({ users, setUsers, loggedInUser, isAdmin }) {
  const [editingUser, setEditingUser] = useState(null);

  const admin =
    typeof isAdmin === "boolean"
      ? isAdmin
      : loggedInUser?.role?.toLowerCase() === "admin";

  const handleEdit = (user) => {
    if (!admin) return;

    setEditingUser(user);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = (id) => {
    if (!admin) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmed) return;

    setUsers((currentUsers) =>
      currentUsers.filter((user) => user.id !== id)
    );

    if (String(editingUser?.id) === String(id)) {
      setEditingUser(null);
    }
  };

  return (
    <div>
      <h1>User Management</h1>
      <p>View community library users and staff.</p>

      {admin && (
        <UserForm
          users={users}
          setUsers={setUsers}
          editingUser={editingUser}
          setEditingUser={setEditingUser}
          isAdmin={admin}
        />
      )}

      <UserList
        users={users}
        isAdmin={admin}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default Users;

