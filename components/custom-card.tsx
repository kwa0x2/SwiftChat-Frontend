import {cn} from "@/lib/utils";
import {Card} from "./ui/card";

interface CustomCardProps {
    className?: string;
    children?: React.ReactNode;
    style?: string;
}

<<<<<<< HEAD
const CustomCard: React.FC<CustomCardProps> = ({ className, children }) => {
  return (
    <Card
      className={cn("bg-[#1F2938]/40 transition", className)}
    >
      {children}
    </Card>
  );
=======
const CustomCard: React.FC<CustomCardProps> = ({className, children}) => {
    return (
        <Card
            className={cn("backdrop-blur-sm bg-[#1F2938]/40 transition", className)}
        >
            {children}
        </Card>
    );
>>>>>>> 8d5a91547291fce1cccc0a96755edca11146c760
};

export default CustomCard;
