import React from "react";
import Logo from "../Components/Logo";
import { Outlet } from "react-router";
import loginPic from "../assets/authImage.png";

const AuthLayout = () => {
  return (
    <div className="max-w-7xl mx-auto p-4">
      <Logo></Logo>
      <div className="flex">
        <div className="flex-1">
          <Outlet></Outlet>
        </div>
        {/* pic */}
        <div className="flex-1">
          <img src={loginPic} alt="Login" />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
