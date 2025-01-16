import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./page/HomePage";
import AboutUs from "./page/AboutUs";
import Navbar from "./components/navbar";
import Layout from "./components/layout";
import Detail from "./components/Detail";
function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/poonjar" element={<Detail />} />
        </Route>
          <Route path="/about-us" element={<AboutUs />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
