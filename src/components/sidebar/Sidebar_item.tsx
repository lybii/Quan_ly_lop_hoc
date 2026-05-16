import React from 'react';

interface SidebarItemProps {
  title: string;
  icon: React.ReactNode;
  color: string;
  isActive?: boolean;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({
  title,
  icon,
  color,
  isActive = false,
}) => {
  return (
    <div
      className={`mt-4 flex h-[50px] w-[200px] cursor-pointer items-center space-x-4 rounded-lg p-2 ${
        isActive
          ? 'scale-105 bg-gradient-to-t from-slate-100 to-slate-300 text-white shadow-lg'
          : 'hover:bg-gradient-to-t hover:from-slate-100 hover:to-slate-300 hover:duration-300'
      } `}
    >
      <div className={`ml-7 ${color}`}>{icon}</div>
      <div className={`font-bold ${color}`}>{title}</div>
    </div>
  );
};
