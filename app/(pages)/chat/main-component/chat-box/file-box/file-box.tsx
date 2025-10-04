import React from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { FaFile } from "react-icons/fa6";

interface FileBoxProps {
  setSelectedFile: React.Dispatch<React.SetStateAction<any>>;
  selectedFile: any;
}

const FileBox: React.FC<FileBoxProps> = ({ setSelectedFile, selectedFile }) => {
  return (
    <div>
      {selectedFile && (
        <div className="backdrop-blur-md border-t border-r border-[#5C6B81]/50 sm:w-[25%] 2xl:w-[14%]  flex flex-col text-white/70 justify-center items-center align-middle h-[300px] rounded-tr-md relative z-10 bg-transparent">
          <X
            className="absolute top-2 right-2 h-4 w-4 cursor-pointer opacity-70 hover:opacity-100"
            onClick={() => setSelectedFile(null)}
          />

          <div className="w-[60%] h-auto">
            {selectedFile.type.startsWith("image/") ? (
              <Image
                width={50}
                height={50}
                className="aspect-square rounded-md h-full w-full"
                src={URL.createObjectURL(selectedFile)}
                alt="Selected Image"
                loading="eager"
              />
            ) : (
              <FaFile className="h-full w-full" />
            )}
          </div>
          <div className="pt-4 flex flex-col items-center">
            <span className="font-semibold text-lg">
              {selectedFile.name.length >= 15
                ? selectedFile.name.substring(0, 15) + "..."
                : selectedFile.name}
            </span>
            <span className="text-sm">
              {selectedFile.type.length >= 15
                ? selectedFile.type.substring(0, 15) + "..."
                : selectedFile.type}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
export default FileBox;
