// src/components/Navigation.jsx
import React from "react";
import { Link } from "react-router-dom";

const Navigation = () => {
  return (
    <div style={{ marginBottom: "1rem" }}>
      <Link to="/add" style={{ marginRight: "1rem", textDecoration: "none" }}>
        <button>Go to Add Event</button>
      </Link>
      <Link to="/edit" style={{ textDecoration: "none" }}>
        <button>Go to Edit Event</button>
      </Link>
    </div>
  );
};

export default Navigation;
