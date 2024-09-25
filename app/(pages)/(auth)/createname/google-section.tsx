"use client";
import { jwtDecode } from "jwt-decode";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { IoIosLogOut } from "react-icons/io";
import { RiImageEditLine } from "react-icons/ri";
import ProfileEditDialog from "../../chat/main-component/profile/profile-component/profile-picture/dialog";
import { toast } from "sonner";

interface GoogleSectionProps {
  token: string;
  onPhotoUpdate: (url: string) => void;
}

interface googleInformation {
  user_email: string;
  user_name: string;
  user_photo: string;
}

const GoogleSection = ({ token, onPhotoUpdate }: GoogleSectionProps) => {
  const [userInfo, setUserInfo] = useState<googleInformation | undefined>({
    user_email: "",
    user_name: "",
    user_photo: "",
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (token) {
      try {
        const decodedToken: googleInformation = jwtDecode(token);
        setUserInfo(decodedToken);

        onPhotoUpdate(decodedToken.user_photo);
      } catch (error) {
        toast.error("An unknown error occurred. Please try again.");
      }
    }
  }, []);

  const handleUpload = (url: string) => {
    setUserInfo((prev) => (prev ? { ...prev, user_photo: url } : prev));
    onPhotoUpdate(url);
  };

  return (
    <div>
      <div className="rounded-lg w-full bg-transparent my-8 text-center">
        <p className="text-gray-400 w-full flex items-center pb-4">
          <FcGoogle className="mr-2" />
          Signed in with Google as follows:
        </p>
        <div className="flex items-center justify-between ">
          <div className="flex space-x-4 items-center">
            <Image
              src={userInfo?.user_photo || "/profile-circle.svg"}
              alt={"Google Username"}
              width={48}
              height={48}
              className="rounded-full hover:bg-gray-500/50"
            />
            <div>
              {/* name section */}
              <p className="font-bold text-lg flex text-white">
                {userInfo?.user_name}
              </p>
              {/* mail section */}
              <p className="text-gray-400">{userInfo?.user_email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <RiImageEditLine
              onClick={() => setIsDialogOpen(true)}
              className="h-[1.7rem] w-auto text-gray-500  hover:text-gray-700  duration-300"
            />

            <Link
              href="/"
              className="text-gray-500  hover:text-gray-700  duration-300"
            >
              <IoIosLogOut className="h-[1.7rem] w-auto" />
            </Link>
          </div>
        </div>
      </div>
      <ProfileEditDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        user_photo={userInfo?.user_photo ?? "/profile-circle.svg"}
        onUpload={handleUpload}
        token={token}
      />
    </div>
  );
};

export default GoogleSection;
