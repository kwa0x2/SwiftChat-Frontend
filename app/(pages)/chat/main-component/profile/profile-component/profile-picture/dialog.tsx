import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MdOutlineCancel, MdOutlineFileUpload } from "react-icons/md";
import { useRef, useState } from "react";
import Image from "next/image";
import { SlPicture } from "react-icons/sl";
import { uploadProfilePicture } from "@/app/api/services/user.Service";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

interface ProfileEditDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  user_photo: string;
  onUpload: (url: string) => void;
  token: string;

}

const ProfileEditDialog = ({
  isOpen,
  onOpenChange,
  user_photo,
  onUpload,
  token
}: ProfileEditDialogProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(
    user_photo
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { update } = useSession();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      const result = await uploadProfilePicture(selectedFile,token);
      console.log("File URL:", result.data);

      onUpload(result.data);    
      setSelectedFile(null);
    } catch (error) {
      toast("Error uploading file:");
      setSelectedFile(null);
      setImagePreview(user_photo);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
    await update();
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setImagePreview(user_photo);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      handleCancel();
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="hidden">
          Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when youre done.
          </DialogDescription>
        </DialogHeader>
        <div className="gap-4 py-4 relative flex  justify-center shrink-0 items-center ">
          <Image
            width={160}
            height={160}
            className="h-60 w-60 overflow-hidden rounded-full"
            src={imagePreview || "/profile-circle.svg"}
            alt="Profile Picture"
            loading="eager"
          />
        </div>
        <DialogFooter>
          <div className="flex flex-col   justify-center w-full">
            <div className="items-center  space-y-2">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              ref={fileInputRef}
            />
            {selectedFile && (
              <div className="flex gap-1">
                <Button
                  variant={"outline"}
                  className="w-full"
                  onClick={handleUpload}
                >
                  <MdOutlineFileUpload className="h-5 w-5 mr-1 text-green-600" />
                  Upload
                </Button>
                <Button
                  variant={"outline"}
                  className="w-full"
                  onClick={handleCancel}
                >
                  <MdOutlineCancel className="h-5 w-5 mr-1 text-rose-700" />
                  Cancel
                </Button>
              </div>
            )}
            <Button
              onClick={handleButtonClick}
              variant={"outline"}
              className="w-full"
            >
              <SlPicture className="h-5 w-5 mr-2 text-blue-500" />
              Select Profile Photo
            </Button>
            </div>
            
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileEditDialog;
