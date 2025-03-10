import React from "react";

interface HeaderProps {
  className: string;
}

export const Header: React.FC<HeaderProps> = (props) => {
  return (
    <div
      className={`w-full flex items-center absolute z-50 gap-2 p-4 px-8 lg:px-16 ${props.className} `}
    >
      <img src="/img/islam.png" alt="" className="w-[30px]" />
      <p className="text-white">Alquran Online</p>
    </div>
  );
};

export default Header;
