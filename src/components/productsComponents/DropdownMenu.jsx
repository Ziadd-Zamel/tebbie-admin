import React from 'react';
import { option } from '../../assets';
import { MdModeEdit } from "react-icons/md";
import { RiDeleteBin5Line } from "react-icons/ri";

const DropdownMenu = ({ isOpen, onEdit, onToggle ,onDelete }) => {
  return (
    <div className="relative">
      <button onClick={onToggle} className="focus:outline-none">
        <img src={option} alt="Options" />
      </button>
      {isOpen && (
        <div className="absolute end-3 top-4 py-3 w-36 bg-white border rounded-lg shadow-xl z-10">
          <button onClick={onDelete} className="flex items-center px-5 py-2 text-gray-800 hover:bg-gray-200 w-full">
          <RiDeleteBin5Line className="me-3 text-gray-400 h-6 w-6" />
            حذف
          </button>
          <button onClick={onEdit} className="flex items-center px-5 py-2 text-gray-800 hover:bg-gray-200 w-full">
            <MdModeEdit className="me-3 text-gray-400 h-6 w-6" />
            تعديل
          </button>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
