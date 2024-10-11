"use client";

import { loginAction } from "@/actions/login";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import Loading from "@/public/blocks-wave.svg";
import Image from "next/image";
import UnknownErrorCard from "@/components/unknown-error-card";
import { getLoggedInUser } from "@/app/api/services/auth.Service";
import { toast } from "sonner";

const LoginPage = () => {
  
  // #region State Management
  const [error, setError] = useState(false);
  // #endregion

  // #region useEffect - Fetch Logged In User Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res: any = await getLoggedInUser();
        if (res.error) setError(true);

        // If user data is successfully retrieved, proceed with login action
        if (res) {
          loginAction(
            res.data.id,
            res.data.name,
            res.data.email,
            res.data.photo
          );
        }
      } catch (error: any) {
        setError(true);
        toast.error("An unknown error occurred. Please try again.");
      }
    };

    fetchData();
  }, []);
  // #endregion

  if (error) return <UnknownErrorCard />;

  return (
    <div className="w-screen h-screen items-center flex justify-center backdrop-blur-sm ">
      <Image src="/loading.svg" alt="Loading" width={50} height={50} />
    </div>
  );
};

export default LoginPage;
