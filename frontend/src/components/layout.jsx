import React from "react";
import Sidebar from "./sidebar";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <div className="flex flex-row h-screen pt-16">
      <Sidebar />
      <main className="flex-1 overflow-auto bg-gray-100">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
