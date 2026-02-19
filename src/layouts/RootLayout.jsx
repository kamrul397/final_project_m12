import React from "react";
import { Outlet } from "react-router";
import Footer from "../pages/shared/Footer";
import Navbar from "../pages/shared/Navbar";

const RootLayout = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <Navbar></Navbar>
      <Outlet></Outlet>
      <Footer></Footer>
    </div>
  );
};

export default RootLayout;
