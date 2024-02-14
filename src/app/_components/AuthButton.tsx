"use client";

import { Button } from "./ui/button";
import React from "react";
import { useRouter } from "next/navigation";

function AuthButton() {
  const router = useRouter();
  return <Button onClick={() => router.push("/login")}>Log In</Button>;
}

export default AuthButton;
