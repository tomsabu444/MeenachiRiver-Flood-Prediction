import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./page/HomePage";
import AboutUs from "./page/AboutUs";
import Navbar from "./components/navbar";
import Layout from "./components/layout";
import Detail from "./components/Detail";
import AlertPage from "./page/AlertPage";
import AutoPopupAlert from "./components/AutoPopupAlert";
function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <AutoPopupAlert />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/:nodeId" element={<Detail />} />
        </Route>
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/alert" element={<AlertPage/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
