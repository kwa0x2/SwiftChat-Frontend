import axios from "../axios";

// #region Update the username of the logged-in user.

export const updateUsernameByMail = async (userName: string) => {
  const body = {
    user_name: userName,
  };
  return await axios.patch("/user/username", body);
};
// #endregion

// #region Upload a new profile photo for the logged-in user.
export const updateProfilePhoto = async (file: File, token?: string) => {
  const formData = new FormData();
  formData.append("file", file);

  const headers: Record<string, string> = {
    "Content-Type": "multipart/form-data",
  };

  if (token) {
    headers["Authorization"] = token;
  }

  return await axios.patch("/user/profile-photo", formData, {
    headers,
  });
};
// #endregion
