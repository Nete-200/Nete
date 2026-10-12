

import React, { useEffect, useState } from "react";

const emptyForm = {
  name: "",
  membershipId: "",
  role: "Member",
};

function UserForm({
  users = [],
  setUsers,
  editingUser,
  setEditingUser,
  isAdmin = false,
}) {
  const [formData, setFormData] = useState({ ...emptyForm });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (editingUser) {
      setFormData({
        name: editingUser.name || "",
        membershipId: editingUser.membershipId || "",
        role: editingUser.role || "Member",
      });
    } else {
      setFormData({ ...emptyForm });
    }

    setError("");
    setMessage("");
  }, [editingUser]);

  if (!isAdmin) return null;

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!isAdmin) {
      setError("Only an Admin can manage users.");
      return;
    }

    const name = formData.name.trim();
    const membershipId = formData.membershipId.trim();
    const role = formData.role;

    if (!name || !membershipId) {
      setError("Please complete all fields.");
      return;
    }

    if (!["Member", "Staff", "Admin"].includes(role)) {
      setError("Please select a valid role.");
      return;
    }

    const duplicateId = users.some(
      (user) =>
        user.membershipId?.toLowerCase() ===
          membershipId.toLowerCase() &&
        String(user.id) !== String(editingUser?.id)
    );

    if (duplicateId) {
      setError("This membership ID already exists.");
      return;
    }

    if (editingUser) {
      setUsers((previousUsers) =>
        previousUsers.map((user) =>
          String(user.id) === String(editingUser.id)
            ? {
                ...user,
                name,
                membershipId,
                role,
              }
            : user
        )
      );

      setEditingUser(null);
      setMessage("User updated successfully.");
    } else {
      const newUser = {
        id: Date.now(),
        name,
        membershipId,
        role,
      };

      setUsers((previousUsers) => [
        ...previousUsers,
        newUser,
      ]);

      setMessage("User added successfully.");
    }

    setFormData({ ...emptyForm });
  };

  const handleCancel = () => {
    setEditingUser(null);
    setFormData({ ...emptyForm });
    setError("");
    setMessage("");
  };

  return (
    <div className="form-card">
      <h2>{editingUser ? "Update User" : "Add User"}</h2>

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
          <label htmlFor="user-name">Name</label>
          <input
            id="user-name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter user name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="user-membership-id">
            Membership ID
          </label>
          <input
            id="user-membership-id"
            name="membershipId"
            value={formData.membershipId}
            onChange={handleChange}
            placeholder="e.g. LIB003"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="user-role">Role</label>
          <select
            id="user-role"
            name="role"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="Member">Member</option>
            <option value="Staff">Staff</option>
            <option value="Admin">Admin</option>
          </select>
        </div>

        <div className="form-buttons">
          <button type="submit" className="primary-button">
            {editingUser ? "Save Changes" : "Add User"}
          </button>

          {editingUser && (
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
    </div>
  );
}

export default UserForm;
