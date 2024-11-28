// components/AdminDashboard.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CreateContent from "./CreateContent"; // Import the CreateContent component

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [content, setContent] = useState([]);
  const [showCreateContent, setShowCreateContent] = useState(false); // State to control the visibility of the CreateContent form
  const navigate = useNavigate();

  // Fetch users and content
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("accesstoken");
        if (!token) {
          alert("Unauthorized! Please log in.");
          navigate("/login");
          return;
        }

        // Fetch users
        const usersResponse = await axios.get(
          "http://localhost:5000/user/all",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Fetch content
        const contentResponse = await axios.get(
          "http://localhost:5000/content",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setUsers(usersResponse.data.allUser);
        setContent(contentResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Failed to load data.");
      }
    };

    fetchData();
  }, [navigate]);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("accesstoken");
    navigate("/login");
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Admin Dashboard</h1>

      <div className="flex justify-end">
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      {/* Button to show Create Content Form */}
      <div className="mt-6 mb-4">
        <button
          onClick={() => setShowCreateContent(!showCreateContent)}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          {showCreateContent ? "Cancel" : "Create New Content"}
        </button>
      </div>

      {/* Conditional rendering of CreateContent form */}
      {showCreateContent && <CreateContent />}

      {/* Users Section */}
      <div className="mt-6">
        <h2 className="text-2xl font-semibold mb-4">User Management</h2>
        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Email</th>
              <th className="border border-gray-300 px-4 py-2">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td className="border border-gray-300 px-4 py-2">
                  {user.user_name}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {user.user_email}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {user.role}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Content Section */}
      <div className="mt-6">
        <h2 className="text-2xl font-semibold mb-4">Content Management</h2>
        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Title</th>
              <th className="border border-gray-300 px-4 py-2">Body</th>
              {/* <th className="border border-gray-300 px-4 py-2">Actions</th> */}
            </tr>
          </thead>
          <tbody>
            {content.map((item) => (
              <tr key={item._id}>
                <td className="border border-gray-300 px-4 py-2">
                  {item.title}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {item.body}
                </td>
                {/* <td className="border border-gray-300 px-4 py-2">
                  <button
                    className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 mr-2"
                    onClick={() => alert(`Edit Content: ${item.title}`)}
                  >
                    Edit
                  </button>
                  <button
                    className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
                    onClick={() => alert(`Delete Content: ${item.title}`)}
                  >
                    Delete
                  </button>
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
