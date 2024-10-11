import { useSession } from "next-auth/react";

//#region Client-Side Current User Hook
export const useCurrentUser = () => {
  const session = useSession();
  return session.data?.user;
};
//#endregion