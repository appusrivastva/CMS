// components/CreateContent.js
import React, { useState } from "react";
import axios from "axios";

const CreateContent = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const createContentHandler = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("accesstoken");
      const response = await axios.post(
        "http://localhost:5000/content/",
        { title, body },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Content created successfully!");
      setBody("");
      setTitle("");
    } catch (error) {
      console.error(error.response.data.message || "Error creating content");
    }
  };

  return (
    <form onSubmit={createContentHandler} className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Create New Content</h2>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full px-4 py-2 border rounded-md"
      />
      <textarea
        placeholder="Description"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        className="w-full px-4 py-2 border rounded-md"
      ></textarea>
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded-md"
      >
        Submit
      </button>
    </form>
  );
};

export default CreateContent;
