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
      
      <div className="relative bg-gray-800 p-8 rounded-2xl shadow-2xl w-[600px] text-gray-100" style={{ fontFamily: 'SF Pro Display, Helvetica, Arial, sans-serif' }}>
        <h2 className="text-3xl font-semibold mb-6 text-center text-gray-100">Alert</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-300 text-lg mb-2">Email ID:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-gray-100 appearance-none shadow-md cursor-pointer border-gray-600 text-lg"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-300 text-lg mb-2">Phone Number:</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-gray-100 appearance-none shadow-md cursor-pointer border-gray-600 text-lg"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-300 text-lg mb-2">Locations for Alerts:</label>
            <select
              name="locations"
              value={formData.locations}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-gray-100 appearance-none shadow-md cursor-pointer border-gray-600 text-lg"
              required
            >
              <option value="" disabled className="text-gray-400 text-lg">Select a location</option>
              <option value="Poonjar">Poonjar</option>
              <option value="Kidangoor">Kidangoor</option>
            </select>
            <p className="text-sm text-gray-400 mt-2">Selecting a location allows users to receive alerts specific to that area, keeping the users informed about important events, updates, or emergencies. This helps the user to stay updated on weather conditions, safety notifications, and community news relevant to their chosen location.</p>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-500 transition transform hover:scale-105 duration-300 shadow-lg text-lg font-semibold mt-4"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default AlertPage;