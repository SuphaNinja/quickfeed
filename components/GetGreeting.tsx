import { useUser } from "@clerk/nextjs";
import React from "react";

export default function GetGreeting() {
  const { user } = useUser();
  return (
    <h1 className="md:text-3xl  text-2xl text-white">
      Welcome, <span className="text-blue-500">{user?.firstName}</span>
      <span className="wave">👋</span>
    </h1>
  );
}
