import AuthButton from "./AuthButton";
import Logo from "./Logo";
import React from "react";

function Header() {
  return (
    <header className="flex items-center justify-center bg-white shadow-md">
      <div className="container flex w-full items-center justify-between p-3">
        <Logo />
        <AuthButton />
      </div>
    </header>
  );
}

export default Header;
