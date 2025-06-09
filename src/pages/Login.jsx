
import React, { useState } from "react";
import logo from "../assets/logo.png";
import logologin from "../assets/logologin.jpg";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // Added for error handling

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    try {
      const response = await axios.post("http://localhost:4000/api/login", { email, password });
      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("role", response.data.role);
        localStorage.setItem("email", response.data.email);

        localStorage.setItem("FullName", response.data.user.FullName);
        
        if (response.data.role === "ADMIN") {
          navigate("/dashboard");
        } else if (response.data.role === "INSTRUCTEUR") {
          navigate("/profile");
        } else {
          navigate("/profile"); // Default fallback
        }

        localStorage.setItem("sender", response.data.user.FullName);
        localStorage.setItem("user_id", response.data.user.id);
        navigate("/profile");
      }
      console.log('data',response.data);

      if(response.data.role === 'ADMIN'){
        navigate('/dashboard');
      } else if(response.data.role === 'INSTRUCTEUR'){
        navigate('/profile');

      }
    } catch (error) {
      setError("Invalid email or password. Please try again.");
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
          Sign in to continue accessing our platform and unlock your potential.
        </p>
      </div>

      {/* Right Section */}
      <div className="md:w-1/2 flex items-center justify-center p-6 md:p-12">
  <div
    className="w-full max-w-md bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 animate-fade-in"
    style={{ border: "1px solid rgba(255, 255, 255, 0.2)" }}
  >
    <img
      src={logologin}
      alt="Login Logo"
      className="w-40 h-40 mx-auto mb-12"  // Logo plus grand
      style={{ borderRadius: "50%" }}
    />
    
    <form onSubmit={handleSubmit} className="flex flex-col gap-10">  
      {error && (
        <div className="bg-red-100 text-red-700 p-5 rounded-xl flex items-center text-lg">  
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}

      {/* Champ Email - Très haut */}
      <div className="relative">
        <FaUser className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-500 text-2xl" />  
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full pl-16 pr-6 py-7 text-2xl rounded-2xl bg-white text-gray-800 placeholder-gray-400 border-none focus:ring-4 focus:ring-purple-200 transition-all"  // Py-7 = hauteur max
          required
        />
      </div>

      {/* Champ Password - Très haut */}
      <div className="relative">
        <FaLock className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-500 text-2xl" />  
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full pl-16 pr-6 py-7 text-2xl rounded-2xl bg-white text-gray-800 placeholder-gray-400 border-none focus:ring-4 focus:ring-purple-200 transition-all"
          required
        />
      </div>

      {/* Bouton - Taille réduite mais visible */}
      <button
        type="submit"
        className="w-full py-5 text-xl bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-2xl hover:from-purple-700 hover:to-purple-800 transition-all font-bold shadow-xl mt-4"  // Py-5 = plus compact
      >
        CONNEXION
      </button>
    </form>

    <p className="mt-12 text-center text-gray-600 text-xl">  
      Pas de compte ?{" "}
      <a href="/register" className="text-purple-600 hover:text-purple-800 font-bold">
        S'inscrire
      </a>
    </p>
  </div>
</div>
    </div>
  );
};

export default Login;
