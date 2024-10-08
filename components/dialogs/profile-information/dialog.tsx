import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";

interface ProfileInformationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  user: any;
}

const ProfileInformationDialog = ({
  isOpen,
  onOpenChange,
  user,
}: ProfileInformationDialogProps) => {
  const handleOpenChange = (open: boolean) => {
    onOpenChange(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{`${user.user_name}'s Profile`}</DialogTitle>
          <DialogDescription>
          View your friend&apos;s profile, including their picture, username, email, and membership date.
          </DialogDescription>
        </DialogHeader>
        {(user.friend_status === "friend" || user.friend_status === "unfriend") && (
          <div className="gap-4 py-4 relative flex justify-center shrink-0 items-center">
            <Image
              width={160}
              height={160}
              className="h-60 w-60 overflow-hidden rounded-full"
              src={user.user_photo ?? "/profile-circle.svg"}
              alt={`${user.user_name}'s profile picture`}
              loading="eager"
            />
          </div>
        )}

        <div className="space-y-4 py-4 ">
          <div className="flex flex-col space-y-2 ">
            <Label htmlFor="username" className="text-sm text-gray-600">
              Username
            </Label>
            <Input id="username" type="text" value={user.user_name} disabled />
          </div>

          <div className="flex flex-col space-y-2 ">
            <Label htmlFor="email" className="text-sm text-gray-600">
              Email
            </Label>
            <Input value={user.user_email} id="email" type="email" disabled />
          </div>

          <p className="text-sm text-gray-500 pt-2">
            Member since:{" "}
            {new Date(user.createdAt).toLocaleString([], {
              year: "numeric",
              month: "numeric",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileInformationDialog;
