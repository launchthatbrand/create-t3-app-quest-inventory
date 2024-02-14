"use client";

import React from "react";
import { useRouter } from "next/navigation";

function AuthButton() {
  const router = useRouter();
  return (
    <button
      className="rounded-md bg-slate-200 p-3"
      onClick={() => router.push("/login")}
    >
      Log In
    </button>
  );
}

export default AuthButton;
