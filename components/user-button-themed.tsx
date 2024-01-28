"use client";

import { UserButton } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";

export function ThemedUserButton() {
  const { resolvedTheme } = useTheme();
  return (
    <UserButton
      userProfileProps={{
        appearance: { baseTheme: resolvedTheme === "dark" ? dark : undefined },
      }}
      appearance={{ baseTheme: resolvedTheme === "dark" ? dark : undefined }}
      afterSignOutUrl="/"
    />
  );
}

export default ThemedUserButton;
