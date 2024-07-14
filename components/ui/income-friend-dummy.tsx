"use client";
import { UserRoundPlus } from "lucide-react";
import Image from "next/image";
import { PiDotsThreeCircleVertical } from "react-icons/pi";
import { Button } from "./button";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { GoBlocked } from "react-icons/go";
import { IoIosCheckmark } from "react-icons/io";
import { FaCheck } from "react-icons/fa6";
import { BsCheckLg } from "react-icons/bs";
import { LiaTimesSolid } from "react-icons/lia";

const IncomeFriendDummyData = () => {
  return (
    <>
      <div className="gap-4 py-2 lg:py-2.5 px-3 mx-3 rounded-md hover:bg-[#4A32B0]/30 transition-all duration-500 cursor-pointer flex items-center">
        <div className="flex-1 flex gap-3">
          <div className="relative inline-block">
            <span className="relative flex h-12 w-12 overflow-hidden rounded-full">
              <Image
                width={40}
                height={40}
                className="aspect-square h-full w-full"
                src="https://dash-tail.vercel.app/_next/static/media/avatar-2.1136fd53.jpg"
                alt="tst"
              />
            </span>
          </div>
          <div className="block">
            <div className="truncate max-w-[120px]">
              <span className="text-sm text-white font-medium">
                Felecia Rower
              </span>
            </div>
            <div className="truncate max-w-[120px]">
              <span className="text-xs text-[#5C6B81]">
                If it takes long you can mail me at my mail address.
              </span>
            </div>
          </div>
        </div>
        <div className="flex-none flex items-center justify-center  gap-2 ml-auto lg:ml-0">
          <GoBlocked className="text-rose-600 h-5 w-5 transition-all duration-500   opacity-70 hover:opacity-100" />
          <BsCheckLg className="text-white h-5 w-5 transition-all duration-500   opacity-70 hover:opacity-100" />
          <LiaTimesSolid className="text-white transition-all duration-500 h-5 w-5  opacity-70 hover:opacity-100" />
        </div>
      </div>
    </>
  );
};

export default IncomeFriendDummyData;
