"use client";

import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useRef, useState, forwardRef } from "react";
import { cn } from "@/lib/utils";

// Bileşeni forwardRef ile sarıyoruz
export const AnimatedPlaceholdersInput = forwardRef<HTMLInputElement, {
  placeholders: string[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  disabled?: boolean;
}>(({
  placeholders,
  onChange,
  onSubmit,
  disabled
}, ref) => {
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startAnimation = () => {
    intervalRef.current = setInterval(() => {
      setCurrentPlaceholder((prev) => (prev + 1) % placeholders.length);
    }, 3000);
  };

  const handleVisibilityChange = () => {
    if (document.visibilityState !== "visible" && intervalRef.current) {
      clearInterval(intervalRef.current); 
      intervalRef.current = null;
    } else if (document.visibilityState === "visible") {
      startAnimation(); 
    }
  };

  useEffect(() => {
    startAnimation();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [placeholders]);

  const [value, setValue] = useState("");
  const [animating, setAnimating] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !animating && !disabled) {
      setValue("");
      setAnimating(false);
      onSubmit && onSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!disabled) {
      setValue("");
      setAnimating(false);
      onSubmit && onSubmit(e);
    }
  };

  return (
    <form
      className={cn(
        "w-full relative mx-auto bg-transparent border border-[#5C6B81] h-12 rounded-md overflow-hidden shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),_0px_1px_0px_0px_rgba(25,28,33,0.02),_0px_0px_0px_1px_rgba(25,28,33,0.08)] transition duration-200",
        value && "bg-transparent",
        disabled && "opacity-50 cursor-not-allowed" 
      )}
      onSubmit={handleSubmit}
    >
      <input
        onChange={(e) => {
          setValue(e.target.value);
          onChange && onChange(e);
        }}
        onKeyDown={handleKeyDown}
        ref={ref as React.RefObject<HTMLInputElement>} 
        value={value}
        type="text"
        className={cn(
          "w-full relative text-sm sm:text-base z-50 border-none text-white bg-transparent h-full rounded-md focus:outline-none focus:ring-0 pl-4 pr-16",
          disabled && "cursor-not-allowed"
        )}
        disabled={disabled} 
      />

      <button
        disabled={!value || disabled} 
        type="submit"
        className={cn(
          "absolute right-2 top-1/2 z-50 -translate-y-1/2 h-8 w-8 rounded-md bg-[#231758] transition duration-200 flex items-center justify-center",
          disabled ? "bg-transparent" : "disabled:bg-transparent" 
        )}
      >
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-gray-300 h-4 w-4"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <motion.path
            d="M5 12l14 0"
            initial={{
              strokeDasharray: "50%",
              strokeDashoffset: "50%",
            }}
            animate={{
              strokeDashoffset: value ? 0 : "50%",
            }}
            transition={{
              duration: 0.3,
              ease: "linear",
            }}
          />
          <path d="M13 18l6 -6" />
          <path d="M13 6l6 6" />
        </motion.svg>
      </button>

      <div className="absolute inset-0 flex items-center rounded-md pointer-events-none">
        <AnimatePresence mode="wait">
          {!value && (
            <motion.p
              initial={{
                y: 5,
                opacity: 0,
              }}
              key={`current-placeholder-${currentPlaceholder}`}
              animate={{
                y: 0,
                opacity: 1,
              }}
              exit={{
                y: -15,
                opacity: 0,
              }}
              transition={{
                duration: 0.3,
                ease: "linear",
              }}
              className="text-zinc-500 text-sm sm:text-base font-normal pl-4 text-left w-[calc(100%-2rem)] truncate"
            >
              {placeholders[currentPlaceholder]}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </form>
  );
});
