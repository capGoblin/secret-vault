import React from "react";
import ConnectButton from "@/components/ConnectButton"; // Adjust the import based on your file structure
import Image from "next/image"; // Import Image from next/image

const NavBar = () => {
  return (
    <div className="flex justify-between items-center p-4 bg-opacity-90 backdrop-blur-md bg-gray-800 text-white shadow-lg rounded-lg">
      <div className="flex items-center">
        <Image
          src="/logo.png"
          alt="Logo"
          width={50}
          height={50}
          className="rounded-full"
        />
        <span className="ml-2 text-2xl font-bold">SafeVault</span>
      </div>
      <div className="flex items-center space-x-4">
        <ConnectButton />
      </div>
    </div>
  );
};

export default NavBar;
