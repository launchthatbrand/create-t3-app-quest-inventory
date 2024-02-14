"use client";

import React from "react";
import { useRouter } from "next/navigation";

function Logo() {
  const router = useRouter();
  return (
    <button
      className="rounded-md bg-slate-200 p-3"
      onClick={() => router.push("/")}
    >
      Logo
    </button>
  );
}

export default Logo;
