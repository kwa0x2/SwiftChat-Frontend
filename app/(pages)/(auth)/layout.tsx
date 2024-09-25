import { BackgroundBeams } from "@/components/ui/background-beams";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <BackgroundBeams />
      {children}
    </div>
  );
};

export default AuthLayout;
