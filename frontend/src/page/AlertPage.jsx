import React, { useState } from "react";

function AlertPage() {
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    locations: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted: ", formData);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-black relative overflow-hidden">
      {/* Background Design */}
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="absolute w-3/4 h-3/4 bg-gradient-to-r from-gray-900 to-black rounded-full blur-3xl opacity-30"></div>
      <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-gray-800 rounded-full blur-2xl opacity-20"></div>
      
      <div className="relative bg-gray-300 p-6 rounded-2xl shadow-2xl w-96 text-black" style={{ fontFamily: 'SF Pro Display, Helvetica, Arial, sans-serif' }}>
        <h2 className="text-2xl font-semibold mb-4 text-center">Alert</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block">Email ID:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-200 text-black appearance-none shadow-md cursor-pointer"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block">Phone Number:</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-200 text-black appearance-none shadow-md cursor-pointer"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block">Locations for Alerts:</label>
            <select
              name="locations"
              value={formData.locations}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-200 text-black appearance-none shadow-md cursor-pointer"
              required
            >
              <option value="" disabled className="text-gray-500 text-xs opacity-80">Select a location</option>
              <option value="Poonjar">Poonjar</option>
              <option value="Kidangoor">Kidangoor</option>
            </select>
            <p className="text-xs text-gray-600 mt-1">Select the location from where you want to receive alerts.</p>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-800 text-white py-2 rounded-lg hover:bg-gray-400 hover:text-black transition transform hover:scale-105 duration-300 shadow-lg"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default AlertPage;
