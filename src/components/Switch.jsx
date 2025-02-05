import React from 'react';

const Switch = ({ checked, onChange, disabled }) => {
  return (
    <label className={`flex items-center cursor-pointer ${disabled ? 'pointer-events-none' : 'pointer-events-auto'}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only"
        disabled={disabled}
      />
      <div className="relative">
        {/* Switch Track */}
        <div
          className={`w-10 h-5 rounded-full shadow-inner transition-colors duration-300 ${
            checked ? 'bg-[#FFB948]' : 'bg-gray-300'
          }`}
        ></div>
        {/* Switch Knob */}
        <div
          className={`absolute top-0 left-0 w-5 h-5 bg-white rounded-full border-[1px] transition-transform duration-300 transform ${
            checked ? 'translate-x-5 border-orange-400 shadow-md' : 'translate-x-0'
          }`}
        ></div>
      </div>
    </label>
  );
};

export default Switch;
