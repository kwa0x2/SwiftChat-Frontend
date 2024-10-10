import CustomCard from "@/components/custom-card";
import ProfileForm from "./profile-component/form";
import ProfilePicture from "./profile-component/profile-picture";
import { MdMenu } from "react-icons/md";

interface ProfileProps {
  user: any;
  setIsOpenChatList: React.Dispatch<React.SetStateAction<boolean>>;
  isOpenChatList: boolean;
}

const Profile = ({ user,setIsOpenChatList, isOpenChatList }: ProfileProps) => {
  return (
    <CustomCard
      className={`${
        isOpenChatList ? "hidden" : "flex-1 flex-col justify-between"
      }`}
    >
      <div className="p-8 space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium text-white">Profile</h3>
            <p className="text-sm text-muted-foreground">
              This is how others will see you.
            </p>
          </div>
          <MdMenu
            onClick={() => setIsOpenChatList(true)}
            className="text-[#4A32B0] text-3xl block sm:hidden cursor-pointer"
          />
        </div>
        <ProfilePicture user={user} />
        <ProfileForm user={user} />
      </div>
    </CustomCard>
  );
};

export default Profile;
