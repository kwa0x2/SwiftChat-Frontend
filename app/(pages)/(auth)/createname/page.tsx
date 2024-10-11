"use client";
import CustomCard from "@/components/custom-card";
import UnknownErrorCard from "@/components/unknown-error-card";
import { useSearchParams } from "next/navigation";
import CreateNameForm from "./create-name-form";
import GoogleSection from "./google-section";
import TitleSection from "./title-section";
import { useState } from "react";

const CreateName = () => {
  
  // #region Search Params and State Management
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [userPhoto, setUserPhoto] = useState<string>("");

  // #endregion

  // #region Error Handling
  if (token == null) return <UnknownErrorCard />;
  // #endregion

  return (
    <CustomCard className="max-w-md mx-3 w-full rounded-md md:rounded-2xl p-4 md:p-8 relative">
      {/* Title Section */}
      <TitleSection />

      {/* Google Info Section */}
      <GoogleSection token={token} onPhotoUpdate={setUserPhoto} />

      {/* Username Form Section */}
      <CreateNameForm token={token} user_photo={userPhoto} />
    </CustomCard>
  );
};

export default CreateName;
