import { useState } from "react";
import inxernLogo from "../assets/images/inxern-logo2.png";
import { FaBars } from "react-icons/fa";

export const Navbar: React.FC = () => {
  return (
    <nav className="flex justify-between h-[64px] px-6 py-6 border-b-[0.7px] border-[#E0E0E0]">
      {/* image container */}
      <div className="flex items-center justify-center">
        <img src={inxernLogo} alt="logo" className="w-[150px]" />
      </div>

      {/* hamburger menu */}
      <div className="flex items-center justify-center">
        <button className="">
          <FaBars size={40} color="#333" />
        </button>
      </div>
    </nav>
  );
};
