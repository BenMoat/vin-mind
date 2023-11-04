"use client";

import { Toaster } from "react-hot-toast";
import { useTheme } from "next-themes";
import { Check, X } from "lucide-react";

export const ToastProvider = () => {
  const { resolvedTheme } = useTheme();
  const fontColour = resolvedTheme === "dark" ? "#ffffff" : "#000000";
  const bgColour = resolvedTheme === "dark" ? "#060609" : "#ffffff";

  return (
    <Toaster
      toastOptions={{
        style: {
          color: fontColour,
          background: bgColour,
        },
        success: {
          icon: <Check color="green" />,
        },
        error: {
          icon: <X color="red" />,
        },
      }}
      containerStyle={{
        top: 80,
        left: 20,
        bottom: 20,
        right: 20,
      }}
    />
  );
};
