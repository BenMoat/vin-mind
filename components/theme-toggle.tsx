"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [isHovering, setIsHovering] = React.useState(false);

  const defaultMode =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  return (
    <DropdownMenu onOpenChange={() => setIsHovering(false)}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuCheckboxItem
          className={`cursor-pointer ${
            resolvedTheme === "light" && !isHovering
              ? "bg-accent"
              : "hover:bg-accent"
          }`}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          checked={resolvedTheme === "light"}
          onClick={() => setTheme("light")}
        >
          <Sun className="absolute left-2 h-4 w-4 mr-2" />
          Light
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          className={`cursor-pointer ${
            resolvedTheme === "dark" && !isHovering
              ? "bg-accent"
              : "hover:bg-accent"
          }`}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          checked={resolvedTheme === "dark"}
          onClick={() => setTheme("dark")}
        >
          <Moon className="absolute left-2 h-4 w-4 mr-2" />
          Dark
        </DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer flex justify-center space-x-2 hover:bg-accent"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onClick={() => setTheme("system")}
        >
          System
          {defaultMode ? (
            <Moon className="h-4 w-4 ml-2" />
          ) : (
            <Sun className="h-4 w-4 ml-2" />
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
