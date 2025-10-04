//Login.jsx
import React, { useState } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import '../css/style.css';

const Login = () => {
  const [showCreateAccount, setShowCreateAccount] = useState(false);
  const [role, setRole] = useState('Admin');
  const [newRole, setNewRole] = useState('Admin');
  const navigate = useNavigate();

  const handleShowCreateAccount = (e) => {
    e.preventDefault();
    setShowCreateAccount(true);
  };
  const handleBackToLogin = (e) => {
    e.preventDefault();
    setShowCreateAccount(false);
  };
  const handleRoleClick = (selectedRole) => setRole(selectedRole);
  const handleNewRoleClick = (selectedRole) => setNewRole(selectedRole);
  
  
  const handleLoginSubmit = async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const res = await axios.post("http://localhost:5000/api/login", {
      email,
      password,
      role
    });

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("role", res.data.role);

    navigate("/dashboard");
  } catch (err) {
    alert(err.response?.data?.error || "Login failed");
  }
};

const handleCreateAccountSubmit = async (e) => {
  e.preventDefault();
  const fullName = document.getElementById("newFullName").value;
  const email = document.getElementById("newEmail").value;
  const password = document.getElementById("newPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  try {
    const res = await axios.post("http://localhost:5000/api/register", {
      fullName,
      email,
      password,
      role: newRole
    });

    alert(res.data.message + "\nPlease login with your new account.");
    
    // Clear the registration form
    document.getElementById("newFullName").value = "";
    document.getElementById("newEmail").value = "";
    document.getElementById("newPassword").value = "";
    document.getElementById("confirmPassword").value = "";
    
    // Switch back to login form
    setShowCreateAccount(false);
    
    // Pre-fill the login form with the new account details
    document.getElementById("email").value = email;
    document.getElementById("password").value = password;
    setRole(newRole);
    
  } catch (err) {
    alert(err.response?.data?.error || "Registration failed");
  }
};



  return (
    <div className="login-container">
      <div className="login-header">
        <img src="/src/assets/logo copy.jpg" alt="AIVENTORY Logo" className="logo"  />
        <h1>SMART INVENTORY MANAGEMENT</h1>
        <p>Predictive Replenishment and Alert Notifications</p>
      </div>
      {!showCreateAccount ? (
        <form className="login-form" onSubmit={handleLoginSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" required />
          </div>
          <div className="role-toggle">
            <button
              type="button"
              className={`role-btn${role === 'Admin' ? ' active' : ''}`}
              onClick={() => handleRoleClick('Admin')}
            >
              Admin
            </button>
            <button
              type="button"
              className={`role-btn${role === 'Staff' ? ' active' : ''}`}
              onClick={() => handleRoleClick('Staff')}
            >
              Staff
            </button>
          </div>
          <button type="submit" className="login-btn">Login</button>
          <div className="account-options">
            <p>
              Don't have an account?{' '}
              <a href="#" onClick={handleShowCreateAccount}>Create Account</a>
            </p>
          </div>
        </form>
      ) : (
        <form className="login-form" onSubmit={handleCreateAccountSubmit}>
          <div className="form-group">
            <label htmlFor="newFullName">Full Name</label>
            <input type="text" id="newFullName" required />
          </div>
          <div className="form-group">
            <label htmlFor="newEmail">Email</label>
            <input type="email" id="newEmail" required />
          </div>
          <div className="form-group">
            <label htmlFor="newPassword">Password</label>
            <input type="password" id="newPassword" required />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input type="password" id="confirmPassword" required />
          </div>
          <div className="role-toggle">
            <button
              type="button"
              className={`role-btn${newRole === 'Admin' ? ' active' : ''}`}
              onClick={() => handleNewRoleClick('Admin')}
            >
              Admin
            </button>
            <button
              type="button"
              className={`role-btn${newRole === 'Staff' ? ' active' : ''}`}
              onClick={() => handleNewRoleClick('Staff')}
            >
              Staff
            </button>
          </div>
          <button type="submit" className="login-btn">Create Account</button>
          <div className="account-options">
            <p>
              Already have an account?{' '}
              <a href="#" onClick={handleBackToLogin}>Back to Login</a>
            </p>
          </div>
        </form>
      )}
    </div>
  );
};

export default Login; 