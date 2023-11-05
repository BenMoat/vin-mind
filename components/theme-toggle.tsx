"use client";

import * as React from "react";
import { Moon, Sun, ChevronDown } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [open, setOpen] = React.useState(false);
  const [isHovering, setIsHovering] = React.useState(false);

  const defaultMode =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  return (
    <DropdownMenu
      open={open}
      onOpenChange={(e) => {
        setIsHovering(false);
        setOpen(e);
      }}
    >
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="w-[60px] ml-2 justify-center"
        >
          <Sun className="mr-4 absolute h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="mr-4 absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <ChevronDown
            className={`ml-6 h-4 w-4 shrink-0 opacity-50 transition-transform duration-300 ${
              open ? "transform rotate-180" : ""
            }`}
          />

          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuCheckboxItem
          className={`${
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
          className={`${
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
        <DropdownMenuItem
          className="flex justify-center space-x-2 border-t"
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
