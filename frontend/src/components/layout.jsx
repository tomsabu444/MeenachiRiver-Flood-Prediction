import React from "react";
import Sidebar from "./sidebar";
import { Outlet } from"react-router-dom";

function Layout() {
  return (
    <div className="flex flex-row h-screen overflow-hidden">
      <Sidebar />
      {/* Main Content Area */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;