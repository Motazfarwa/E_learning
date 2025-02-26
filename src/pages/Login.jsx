import React, { useContext, useState } from "react";
import "./Login.css";
import logo from "../assets/logo.png";
import logologin from "../assets/logologin.jpg";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa"; // Import icons


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:4000/api/login", { email, password });
      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("role", response.data.role);
        navigate("/home");
      }
      console.log(response.data);

      if(response.data.role === 'ADMIN'){
        navigate('/dashboard');
      } else if(response.data.role === 'INSTRUCTEUR'){
        navigate('/home');
      }
    } catch (error) {
      alert("Invalid email or password. Please try again.");
    }
  };


  return (
    <div className="login-container">
  
      {/* Left Section */}
      <div className="left-section">
        <h1>Respect & Acountability & Determination</h1><br/>
        <p>Sign in to continue accessing our platform.</p>
      </div>

      {/* Right Section */}
      <div className="right-section">
        <div className="glass-card">
          <div className="card-header">
          <img src={logologin} alt="Logo" style={{ width: '130px', height: '130px', display: 'block', margin: '0 auto' }} />
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {/* Email Field */}
            <div className="form-group">
            
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
              <FaUser className="input-icon" />
            </div>

            {/* Password Field */}
            <div className="form-group">
           
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
              <FaLock className="input-icon" />
            </div>

            <button type="submit" className="auth-button">
              Sign In
            </button>
          </form>

          <p className="signup-link">
            Don't have an account? <a href="/register">Sign up</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
