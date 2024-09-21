"use client";
import CustomCard from "@/components/custom-card";
import UnknownErrorCard from "@/components/unknown-error-card";
import { useSearchParams } from "next/navigation";
import CreateNameForm from "./create-name-form";
import GoogleSection from "./google-section";
import TitleSection from "./title-section";
import { useState } from "react";

const CreateName = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [userPhoto, setUserPhoto] = useState<string>("");

  if (token == null) return <UnknownErrorCard />;

  return (
    <CustomCard className="max-w-md  w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 relative">
      {/* baslik yazilarin bulundugu kisim */}
      <TitleSection />

      {/* google bilgilerin bulundugu kisim */}
      <GoogleSection token={token} onPhotoUpdate={setUserPhoto}/>

      {/* kullanici adi girilen form kismi */}
      <CreateNameForm token={token} user_photo={userPhoto}/>
    </CustomCard>
  );
};

export default CreateName;
