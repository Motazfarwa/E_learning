
import React, { useState } from "react";
import logo from "../assets/logo.png";
import logologin from "../assets/logologin.jpg";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";

const Register = () => {
  const [FullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!FullName || !email || !password || !role) {
      setError("All fields are required.");
      return;
    }
    if (!email.includes("@")) {
      setError("Please enter a valid email.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    try {
      const response = await axios.post("http://localhost:4000/api/register", {
        FullName,
        email,
        password,
        role,
      });
      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("role", response.data.role);
        navigate("/home");
      }
    } catch (error) {
      setError(
        error.response?.data?.error || "Registration failed. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100">
      {/* Left Section */}
      <div className="md:w-1/2 bg-gradient-to-br from-purple-600 to-purple-800 text-white flex flex-col justify-center items-center p-8 md:p-12">
        <img
          src={logo}
          alt="Logo"
          className="w-24 h-24 mb-6"
          style={{ borderRadius: "50%" }}
        />
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">
          Respect, Accountability, Determination
        </h1>
        <p className="text-lg md:text-xl text-center max-w-md">
          Sign up to join our platform and start your journey.
        </p>
      </div>

      {/* Right Section */}
      <div className="md:w-1/2 flex items-center justify-center p-6 md:p-12">
        <div
          className="w-full max-w-md bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 animate-fade-in"
          style={{
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          <img
            src={logologin}
            alt="Register Logo"
            className="w-32 h-32 mx-auto mb-6"
            style={{ borderRadius: "50%" }}
          />
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {error}
              </div>
            )}

            {/* FullName Field */}
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                id="FullName"
                value={FullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 bg-white bg-opacity-50 text-gray-800 placeholder-gray-400 transition-all"
                required
              />
            </div>

            {/* Email Field */}
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 bg-white bg-opacity-50 text-gray-800 placeholder-gray-400 transition-all"
                required
              />
            </div>

            {/* Password Field */}
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 bg-white bg-opacity-50 text-gray-800 placeholder-gray-400 transition-all"
                required
              />
            </div>

            {/* Role Dropdown */}
            <div className="relative">
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full pl-4 pr-10 py-3 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 bg-white bg-opacity-50 text-gray-800 placeholder-gray-400 transition-all appearance-none"
                required
              >
                <option value="" disabled>
                  Select your role
                </option>
                <option value="ADMIN">Admin</option>
                <option value="INSTRUCTEUR">Instructeur</option>
                <option value="APPRENANT">Apprenant</option>
                <option value="EXPERT">Expert</option>
              </select>
              <svg
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all font-medium shadow-md"
            >
              Sign Up
            </button>
          </form>

          <p className="mt-6 text-center text-gray-600">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-purple-600 hover:text-purple-800 font-medium"
            >
              Sign In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
