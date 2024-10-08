import axios from "../axios";

export const updateUsernameByMail = async (userName: string) => {
  const body = {
    user_name: userName,
  };
  return await axios.patch("/user/username", body);
};

export const uploadProfilePhoto = async (file: File, token?: string) => {
  const formData = new FormData();
  formData.append("file", file);

  const headers: Record<string, string> = {
    "Content-Type": "multipart/form-data",
  };

  if (token) {
    headers["Authorization"] = token;
  }

  return await axios.post("/user/upload-profile-photo", formData, {
    headers,
  });
};
