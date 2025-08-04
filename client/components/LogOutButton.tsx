// Path: nextjs-frontend/src/app/components/LogOutButton.tsx

"use client";

import React from "react";
import { logoutAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function LogOutButton() {
  return (
    <Button
      onClick={() => {
        logoutAction();
      }}
      variant="destructive"
      className="w-full sm:w-auto flex items-center gap-2"
    >
      <LogOut className="h-4 w-4" />
      تسجيل الخروج
    </Button>
  );
}