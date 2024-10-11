import { auth } from "@/auth";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { SessionProvider } from "next-auth/react";

// #region Chat Layout Component

// Define the ChatLayout component that accepts children as props
const ChatLayout = async ({ children }: { children: React.ReactNode }) => {
  // Await the authentication process to get the session
  const session = await auth();
  
  return (
    // Provide the session to the children components
    <SessionProvider session={session}>
      {children} 
      <BackgroundBeams />
    </SessionProvider>
  );
};

// #endregion

export default ChatLayout;
