import AuthButton from "./AuthButton";
import Logo from "./Logo";
import React from "react";
import TopNavbar from "./TopNavbar";

function Header() {
  return (
    <header className="flex items-center justify-center bg-white shadow-md">
      <div className="container flex w-full items-center justify-between p-3">
        <div>
          <Logo />
        </div>
        <div className="flex items-center space-x-10">
          <TopNavbar />
          <AuthButton />
        </div>
      </div>
    </header>
  );
}

export default Header;
