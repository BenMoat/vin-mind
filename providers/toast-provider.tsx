"use client";

import { Toaster } from "react-hot-toast";
import { useTheme } from "next-themes";

export const ToastProvider = () => {
  const { resolvedTheme } = useTheme();
  const fontColour = resolvedTheme === "dark" ? "#ffffff" : "#000000";
  const bgColour = resolvedTheme === "dark" ? "#020817" : "#ffffff";
  const successColour = resolvedTheme === "dark" ? "#020817" : "#ffffff";
  const errorColour = resolvedTheme === "dark" ? "#020817" : "#ffffff";

  return (
    <Toaster
      toastOptions={{
        style: {
          color: fontColour,
          background: bgColour,
        },
        success: {
          iconTheme: {
            primary: "green",
            secondary: successColour,
          },
        },
        error: {
          iconTheme: {
            primary: "red",
            secondary: errorColour,
          },
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
