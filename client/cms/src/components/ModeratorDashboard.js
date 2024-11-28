import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const ModeratorDashboard = () => {
  const [content, setContent] = useState([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  
    const [error, setError] = useState("");
      const navigate = useNavigate();


  // Fetch content when the component mounts
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const token = localStorage.getItem("accesstoken");
        if (!token) {
          alert("Unauthorized! Please log in.");
          return;
        }

        const response = await axios.get("http://localhost:5000/content", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setContent(response.data);
      } catch (error) {
        setError("Failed to fetch content.");
      }
    };

    fetchContent();
  }, []);

  // Create new content
  const handleCreateContent = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("accesstoken");
    try {
      if (!token) {
        alert("Unauthorized! Please log in.");
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/content",
        { title, body },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setContent([...content, response.data]);
      setTitle("");
      setBody("");
    } catch (error) {
      setError("Failed to create content.");
    }
  };

  // Flag content
  const handleFlagContent = async (id) => {
    const token = localStorage.getItem("accesstoken");
    try {
      if (!token) {
        alert("Unauthorized! Please log in.");
        return;
      }

      await axios.put(
        `http://localhost:5000/content/flag/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setContent(
        content.map((item) =>
          item._id === id ? { ...item, flagged: !item.flagged } : item
        )
      );
    } catch (error) {
      setError("Failed to flag content.");
    }
  };
  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("accesstoken");
    navigate("/login");
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">
        Moderator Dashboard
      </h1>

      {/* Content Creation Form */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
        <h3 className="text-xl font-semibold mb-4">Create New Content</h3>
        <form onSubmit={handleCreateContent}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-lg">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="body" className="block text-lg">
              Body
            </label>
            <textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md"
              rows="4"
              required
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Create Content
          </button>
        </form>
      </div>

      {/* Display All Content */}
      {error && <p className="text-red-500">{error}</p>}

      <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
        <h3 className="text-xl font-semibold mb-4">All Content</h3>
        {content.length > 0 ? (
          <ul>
            {content.map((item) => (
              <li key={item._id} className="border-b py-2">
                <h4 className="font-medium">{item.title}</h4>
                <p>{item.body}</p>
                <button
                  onClick={() => handleFlagContent(item._id)}
                  className={`mt-2 px-4 py-2 rounded-md ${
                    item.flagged ? "bg-red-600" : "bg-yellow-500"
                  } text-white`}
                >
                  {item.flagged ? "Unflag" : "Flag"} Content
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No content available.</p>
        )}
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
};

export default ModeratorDashboard;
