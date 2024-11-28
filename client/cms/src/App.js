// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard"; // You can create this page as well for post-login
import UserDashboard from "./components/UserDashboard"; // You can create this page as well for post-login
import ModeratorDashboard from "./components/ModeratorDashboard";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/moderatordashboard" element={<ModeratorDashboard />} />
        <Route path="/userdashboard" element={<UserDashboard />} />

      </Routes>
    </Router>
  );
};

export default App;
