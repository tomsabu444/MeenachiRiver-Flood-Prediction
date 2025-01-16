import React from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <AppBar position="fixed"  style={{ backgroundColor: "#111827" }}>
      <Toolbar className="flex justify-between">
        {/* Left Section */}
        <div className="flex items-center">
          <Link to="/">
          <Typography
            variant="h6"
            className="text-white font-inter font-extrabold text-xl tracking-wide"
            >
            Meenachil River Rain Monitoring System
          </Typography>
            </Link>
        </div>

        {/* Right Section */}
        <div className="flex items-center">
          <Link to="/about-us"
            className="text-white text-lg font-semibold cursor-pointer transform transition-transform duration-300 hover:scale-110 hover:text-blue-400"
          >
            About Us
          </Link>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
