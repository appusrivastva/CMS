import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function UserDashboard() {
  const [userInfo, setUserInfo] = useState(null);
  const [userContent, setUserContent] = useState([]);
  const navigate = useNavigate();

  // Fetch user info and content on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("accesstoken");
        if (!token) {
          alert("Unauthorized! Please log in.");
          navigate("/login");
          return;
        }

        // Fetch user info
        const userResponse = await axios.get("http://localhost:5000/user/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserInfo(userResponse.data);

        // Fetch user content or tasks (e.g., posts, to-do items)
        const contentResponse = await axios.get(
          "http://localhost:5000/content", // Modified endpoint for user content
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUserContent(contentResponse.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        alert("Failed to load data.");
      }
    };

    fetchUserData();
  }, [navigate]);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("accesstoken");
    navigate("/login");
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">
        Welcome to Your Dashboard
      </h1>

      {/* User Info Section */}
      {userInfo && (
        <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <h2 className="text-2xl font-semibold">
            Hello, {userInfo.user_name}
          </h2>
          <p className="mt-2">Email: {userInfo.user_email}</p>
        </div>
      )}

      {/* User Content Section */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
        <h3 className="text-xl font-semibold mb-4">All Available Content</h3>
        <ul>
          {userContent.length > 0 ? (
            userContent.map((item) => (
              <li key={item._id} className="border-b py-2">
                <h4 className="font-medium">{item.title}</h4>
                <p>{item.body}</p>
              </li>
            ))
          ) : (
            <p>No content available.</p>
          )}
        </ul>
      </div>

      {/* Logout Button */}
      <div className="flex justify-end">
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
