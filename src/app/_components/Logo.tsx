"use client";

import { Button } from "@/components/ui/button";
import React from "react";
import { useRouter } from "next/navigation";

function Logo() {
  const router = useRouter();
  return <Button onClick={() => router.push("/")}>Logo</Button>;
}

export default Logo;
