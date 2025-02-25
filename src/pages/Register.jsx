import React, { useContext, useState } from "react";
import "./Register.css";
import logologin from "../assets/logologin.jpg";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa"; // Import icons


const Login = () => {
  const [FullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:4000/api/register", { FullName, email, password, role });
      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("role", response.data.role);
        navigate("/home");
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
                type="text"
                id="FullName"
                value={FullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your fullname"
              />
              <FaUser className="input-icon" />
            </div>

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

            <div >
    <select
        id="role"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        placeholder="Enter your role"
        className="custom-dropdown"
    >
        <option value="ADMIN">Admin</option>
        <option value="INSTRUCTEUR">Instructeur</option>
        <option value="APPRENANT">Apprenant</option>
    </select>
</div>



            <button type="submit" className="auth-button">
              Sign In
            </button>
          </form>

          <p className="signup-link">
            Don't have an account? <a href="/login">Sign In</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
