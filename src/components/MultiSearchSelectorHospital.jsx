/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import { FaAngleDown } from "react-icons/fa";

export default function MultiSearchSelectorHospital({
  options = [],
  onChange = () => {},
  selectedValues = [],
  placeholder = "",
  id = "",
  searchPlaceholder = "",
  fallbackMessage = "",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = (options || []).filter((option) => {
    const search = searchTerm.toLowerCase();
    return (
      (option.label?.toLowerCase().includes(search) ?? false) ||
      (option.name?.toLowerCase().includes(search) ?? false)
    );
  });

  const toggleDropdown = () => setIsOpen(!isOpen);

  useEffect(() => {
    if (!isOpen) setSearchTerm("");
  }, [isOpen]);

  const getDisplayNames = () => {
  const selectedOptions = options.filter((option) =>
    selectedValues.includes(option.value)
  );

  const names = selectedOptions.map((option) => option.label || option.name || "");

  if (names.length > 4) {
    const firstThree = names.slice(0, 3).join(", ");
    const remaining = names.length - 3;
    return `${firstThree} و ${remaining} آخرين`;
  }

  return names.join(", ");
};


  const handleCheckboxChange = (value) => {
    const newSelectedValues = selectedValues.includes(value)
      ? selectedValues.filter((val) => val !== value)
      : [...selectedValues, value];

    onChange(newSelectedValues);
  };

  return (
    <div className="relative w-full font-sans" ref={dropdownRef}>
      <div
        className="flex items-center justify-between p-3 bg-white border border-gray-300 rounded-md shadow-sm cursor-pointer hover:border-blue-400 transition-colors"
        onClick={toggleDropdown}
      >
      <span className="text-gray-700 truncate">
  {Array.isArray(selectedValues) && selectedValues.length > 0
    ? getDisplayNames()
    : placeholder}
</span>
        <span
          className={`text-gray-500 transform transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          <FaAngleDown />
        </span>
      </div>

      {isOpen && (
        <div className="absolute w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-80 overflow-y-auto z-10">
          <div className="p-2 border-b border-gray-200">
            <input
              id={id}
              type="text"
              className="w-full p-2 text-sm border-none outline-none focus:outline-none focus:ring-0 placeholder-gray-400"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div className="py-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <label
                  key={option.value}
                  className={`flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer transition-colors ${
                    option.hasTeam && !option.isCurrentTeam
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    className={`w-4 h-4 me-3 text-blue-600 border-gray-300 rounded focus:ring-blue-500 ${
                      option.hasTeam && !option.isCurrentTeam
                        ? "cursor-not-allowed"
                        : ""
                    }`}
                    checked={selectedValues.includes(option.value)}
                    onChange={() => handleCheckboxChange(option.value)}
                    disabled={option.hasTeam && !option.isCurrentTeam}
                  />
                  <span className="ml-2 text-gray-700">
                    {option.label || option.name}
                  </span>
                </label>
              ))
            ) : (
              <div className="p-3 text-center text-gray-500 text-sm">
                {fallbackMessage || "No options found"}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
