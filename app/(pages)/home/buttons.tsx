"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FaGoogle } from "react-icons/fa";
import { PiLinkedinLogoLight } from "react-icons/pi";
import { PiGithubLogoLight } from "react-icons/pi";

// Component rendering login buttons for Google, LinkedIn, and GitHub
const Buttons = () => {
  const onClick = async () => {
    window.location.href = `${process.env.BASE_URL}/auth/login/google`;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-2 mt-6">
      <Button onClick={onClick} variant="outline">
        <FaGoogle className="mr-2 h-4 w-4" /> Login
      </Button>
      <div>
        <Button variant="link" size="icon">
          <Link href="https://www.linkedin.com/in/alper-karakoyun-8b195921a/">
            <PiLinkedinLogoLight className="h-8 w-8" />
          </Link>
        </Button>
        <Button variant="link" size="icon">
          <Link href="https://github.com/kwa0x2">
            <PiGithubLogoLight className="h-8 w-8" />
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default Buttons;
