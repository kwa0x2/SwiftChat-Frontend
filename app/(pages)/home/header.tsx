import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";

const Header = () => {
  const words = [
    {
      text: "Welcome",
      className: "text-white",
    },
    {
      text: "To",
      className: "text-white",
    },
    {
      text: "SwiftChat",
      className: "text-white",
    },
  ];
  return (
    <>
      <h2 className="text-white text-4xl md:text-6xl font-bold text-center">
        <TypewriterEffectSmooth words={words} />
      </h2>
    </>
  );
};

export default Header;
