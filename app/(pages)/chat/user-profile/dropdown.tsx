"use client";
import { logoutAction } from "@/actions/logout";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User, UserRoundPlus } from "lucide-react";
import { useState } from "react";
import { PiDotsThreeCircleLight } from "react-icons/pi";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/redux/store";
import { setActiveComponent } from "@/app/redux/slices/componentSlice";
import { useRouter } from "next/navigation";

interface DropDownProbs {
  setIsOpenChatList: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedRoomId: React.Dispatch<React.SetStateAction<string | null>>;
}

const Dropdown = ({ setIsOpenChatList,setSelectedRoomId  }: DropDownProbs) => {
  const dispatch = useDispatch<AppDispatch>();

  // #region Dropdown State and Router
  const [dropdown, setDropdown] = useState<boolean>(false); // State to manage dropdown visibility
  const router = useRouter();
  // #endregion

  // #region Handlers

  // Handle click actions in the dropdown menu
  const clickHandler = (action: () => void) => {
    setDropdown(false); // Close dropdown after selection
    action(); // Execute the provided action
  };

  // Handle user logout
  const handleLogout = async () => {
    await logoutAction(); // Execute logout action
    router.push("/"); // Navigate to home page after logout
  };

  // #endregion

  return (
    <DropdownMenu open={dropdown} onOpenChange={setDropdown}>
      <DropdownMenuTrigger className="outline-none">
        <PiDotsThreeCircleLight className="text-[#4A32B0] text-[2rem]" />{" "}
        {/* Dropdown trigger icon */}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Profile menu item */}
        <DropdownMenuItem
          onSelect={() =>
            clickHandler(() => {
              setIsOpenChatList(false); // Close chat list
              dispatch(setActiveComponent("profile")); // Set active component to profile
              setSelectedRoomId(null) // Reset selected room ID
            })
          }
        >
          <User className="mr-2 h-4 w-4 text-blue-500" />
          Profile
        </DropdownMenuItem>

        {/* Friends menu item */}
        <DropdownMenuItem
          onSelect={() =>
            clickHandler(() => {
              dispatch(setActiveComponent("friends")); // Set active component to friends
              setIsOpenChatList(false); // Close chat list
              setSelectedRoomId(null) // Reset selected room ID
            })
          }
        >
          <UserRoundPlus className="mr-2 h-4 w-4 text-green-600" />
          Friends
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Logout menu item */}
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4 text-rose-700" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Dropdown;
