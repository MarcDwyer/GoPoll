import React from "react";
import { Link } from "react-router-dom";

import "./navbar.scss";

export const Navbar = () => {
  return (
    <div className="navbar">
      <Link to="/" className="logo">
        GoPoll
      </Link>
    </div>
  );
};
