import React from "react";

function Loading() {
  return (
    <div className={` px-28 py-5 flex items-center justify-center h-screen bg-slate-600`}>
      <div className="w-16 h-16 rounded-full border-t-4 border-l-4 border-gray-900 border-opacity-100 border-r-transparent animate-spin"></div>
    </div>
  );
}

export default Loading;
