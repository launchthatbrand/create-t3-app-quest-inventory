import Logo from "~/app/_components/Logo";
import React from "react";
import RegisterForm from "~/app/_components/RegisterForm";

function RegisterPage() {
  return (
    <div className="container flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center rounded-md bg-white bg-opacity-10 p-5 shadow-md">
        <Logo />
        <RegisterForm />
      </div>
    </div>
  );
}

export default RegisterPage;
