import { cookies } from "next/dist/client/components/headers";

//#region Cookie Retrieval
export const getMyCookie = () => {
  const cStore = cookies();
  const cookie = cStore.get("connect.sid");
  if (!cookie) return null;
  const readable = cookie?.name + "=" + cookie?.value;
  return readable;
};
//#endregion