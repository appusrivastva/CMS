// components/Login.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({
    user_email: "",
    user_password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios({
        method: "post",
        baseURL: "http://localhost:5000", // Use the new port
        url: "/user/login",
        data: formData, // Send form data
      });
      const token = response.data.accesstoken;
      localStorage.setItem("accesstoken", token); // Store JWT token
      alert("Login successful");
      // Decode the JWT token to get the role (using a simple decode method or a library like jwt-decode)
      const decoded = JSON.parse(atob(token.split(".")[1])); // Decoding the token
      const userRole = decoded.role;

      // Based on the role, navigate to the correct dashboard
      if (userRole === "Admin") {
        navigate("/dashboard"); // Admin Dashboard route
      } else if (userRole === "User") {
        navigate("/userdashboard"); // User Dashboard route
      } else {
        navigate("/moderatordashboard");
      }
    } catch (err) {
      console.error(err);
      alert("Invalid email or password");
    }
  };

  return (
    <div className="container max-w-md mx-auto mt-10 p-6 border border-gray-300 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <input
            type="email"
            name="user_email"
            value={formData.user_email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <input
            type="password"
            name="user_password"
            value={formData.user_password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Login
        </button>
      </form>

      <p className="mt-4 text-center">
        Don't have an account?{" "}
        <a href="/register" className="text-blue-600 hover:underline">
          Sign up here
        </a>
      </p>
    </div>
  );
};

export default Login;
