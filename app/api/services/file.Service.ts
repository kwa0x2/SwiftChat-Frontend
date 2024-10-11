import axios from "../axios";

// #region Upload a file.
export const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const headers: Record<string, string> = {
    "Content-Type": "multipart/form-data",
  };

  return await axios.post("/files/upload", formData, {
    headers,
  });
};
// #endregion
