import { auth } from "@/auth";

//#region Server-Side Current User Retrieval
export const currentUser = async () => {
    const session = await auth();
    return session?.user;
  };
  //#endregion