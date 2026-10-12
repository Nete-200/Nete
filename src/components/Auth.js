

import React, { useState } from "react";

function Auth({ users, setUsers, onLogin }) {
  const [mode, setMode] = useState("login");

  const [name, setName] = useState("");
  const [membershipId, setMembershipId] = useState("");
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleRegister = (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    const cleanName = name.trim();
    const cleanMembershipId = membershipId.trim();

    if (!cleanName || !cleanMembershipId || !password) {
      setError("Please complete all fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    const exists = users.some(
      (user) =>
        user.membershipId?.toLowerCase() ===
        cleanMembershipId.toLowerCase()
    );

    if (exists) {
      setError("This membership ID already exists.");
      return;
    }

    const isFirstUser = users.length === 0;

    const newUser = {
      id: Date.now(),
      name: cleanName,
      membershipId: cleanMembershipId,
      password,
      role: isFirstUser ? "Admin" : "Member",
    };

    setUsers((previousUsers) => [
      ...previousUsers,
      newUser,
    ]);

    setName("");
    setMembershipId("");
    setPassword("");

    setMessage(
      isFirstUser
        ? "Admin account created. Please log in."
        : "Member account created. Please log in."
    );

    setMode("login");
  };

  const handleLogin = (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    const cleanLoginId = loginId.trim().toLowerCase();

    if (!cleanLoginId || !loginPassword) {
      setError("Enter your membership ID and password.");
      return;
    }

    const user = users.find(
      (item) =>
        item.membershipId?.toLowerCase() === cleanLoginId &&
        item.password === loginPassword
    );

    if (!user) {
      setError("Invalid membership ID or password.");
      return;
    }

    // Never allow a login form to grant a higher role.
    onLogin(user);
  };

  return (
    <div className="auth-container">
      {mode === "register" ? (
        <div className="form-card auth-card">
          <h1>Create Account</h1>
          <p>Create your community library account.</p>

          {error && (
            <div className="error-message">{error}</div>
          )}

          {message && (
            <div className="success-message">{message}</div>
          )}

          <form onSubmit={handleRegister}>
            <div className="form-group">
              <label htmlFor="register-name">Full Name</label>
              <input
                id="register-name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Enter your name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="register-membership">
                Membership ID
              </label>
              <input
                id="register-membership"
                type="text"
                value={membershipId}
                onChange={(event) =>
                  setMembershipId(event.target.value)
                }
                placeholder="Create a membership ID"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="register-password">Password</label>
              <input
                id="register-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                minLength={6}
                autoComplete="new-password"
                placeholder="At least 6 characters"
                required
              />
            </div>

            <div className="form-buttons">
              <button type="submit" className="primary-button">
                Create Account
              </button>
            </div>
          </form>

          <p>
            Already have an account?{" "}
            <button
              type="button"
              className="link-button"
              onClick={() => {
                setMode("login");
                setError("");
                setMessage("");
              }}
            >
              Login
            </button>
          </p>
        </div>
      ) : (
        <div className="form-card auth-card">
          <h1>Library Login</h1>
          <p>Login to access the community library.</p>

          {error && (
            <div className="error-message">{error}</div>
          )}

          {message && (
            <div className="success-message">{message}</div>
          )}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="login-membership">
                Membership ID
              </label>
              <input
                id="login-membership"
                type="text"
                value={loginId}
                onChange={(event) => setLoginId(event.target.value)}
                autoComplete="username"
                placeholder="Enter your membership ID"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="login-password">Password</label>
              <input
                id="login-password"
                type="password"
                value={loginPassword}
                onChange={(event) =>
                  setLoginPassword(event.target.value)
                }
                autoComplete="current-password"
                placeholder="Enter your password"
                required
              />
            </div>

            <div className="form-buttons">
              <button type="submit" className="primary-button">
                Login
              </button>
            </div>
          </form>

          <p>
            Don't have an account?{" "}
            <button
              type="button"
              className="link-button"
              onClick={() => {
                setMode("register");
                setError("");
                setMessage("");
              }}
            >
              Create Account
            </button>
          </p>
        </div>
      )}
    </div>
  );
}

export default Auth;
