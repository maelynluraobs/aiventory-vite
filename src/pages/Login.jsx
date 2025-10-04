//Login.jsx
import React, { useState } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import '../css/style.css';

const Login = () => {
  const [showCreateAccount, setShowCreateAccount] = useState(false);
  const [role, setRole] = useState('Admin');
  const [newRole, setNewRole] = useState('Admin');
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Registration form state
  const [fullName, setFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
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
    
    if (!loginEmail || !loginPassword) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/login", {
        email: loginEmail,
        password: loginPassword,
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
    
    if (!fullName || !regEmail || !regPassword || !confirmPassword) {
      alert("Please fill in all fields");
      return;
    }

    if (regPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/register", {
        fullName,
        email: regEmail,
        password: regPassword,
        role: newRole
      });

      alert(res.data.message + "\nPlease login with your new account.");
      
      // Clear the registration form
      setFullName("");
      setRegEmail("");
      setRegPassword("");
      setConfirmPassword("");
      
      // Switch back to login form
      setShowCreateAccount(false);
      
      // Pre-fill the login form with the new account details
      setLoginEmail(regEmail);
      setLoginPassword(regPassword);
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
            <input 
              type="email" 
              id="email" 
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              required 
            />
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
            <input 
              type="text" 
              id="newFullName" 
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="newEmail">Email</label>
            <input 
              type="email" 
              id="newEmail" 
              value={regEmail}
              onChange={(e) => setRegEmail(e.target.value)}
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="newPassword">Password</label>
            <input 
              type="password" 
              id="newPassword" 
              value={regPassword}
              onChange={(e) => setRegPassword(e.target.value)}
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input 
              type="password" 
              id="confirmPassword" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required 
            />
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