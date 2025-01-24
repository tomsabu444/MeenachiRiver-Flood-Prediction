import React from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <AppBar
      position="absolute"
      className="h-16"
      style={{ backgroundColor: "#111827" }}
    >
      <Toolbar
        className="flex justify-between items-center h-full"
        style={{ minHeight: "4rem" }} // Ensure consistent height
      >
        {/* Left Section */}
        <div className="flex-1 flex justify-start h-full">
          <Link to="/" className="no-underline text-center flex items-center h-full">
            {/* Full Title for Desktop */}
            <Typography
              variant="h6"
              className="hidden md:block text-white font-inter font-extrabold text-xl tracking-wide"
              style={{ lineHeight: "1.5" }}
            >
              Meenachil River Rain Monitoring System
            </Typography>

            {/* Short Title for Mobile */}
            <Typography
              variant="h6"
              className="block md:hidden text-white font-inter font-extrabold text-xl tracking-wide"
              style={{ lineHeight: "1.5" }}
            >
              MRRMS
            </Typography>
          </Link>
        </div>

        {/* Right Section */}
        <div className="flex items-center flex-none h-full">
          <Link
            to="/about-us"
            className="text-white text-lg font-semibold cursor-pointer transform transition-transform duration-300 hover:scale-110 hover:text-blue-400 flex items-center h-full"
          >
            About Us
          </Link>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
