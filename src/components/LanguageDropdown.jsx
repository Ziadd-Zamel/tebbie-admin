import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { down, egyptIcon, englishIcon } from '../assets';

const LanguageDropdown = () => {
  const { i18n } = useTranslation();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
    setDropdownOpen(false); // Close dropdown after selection
  };

  const direction = i18n.language === 'ar' ? 'rtl' : 'ltr';

  return (
    <div className="relative z-50">
      <button onClick={toggleDropdown} className="flex items-center">
        <img 
          src={i18n.language === 'ar' ? egyptIcon : englishIcon} 
          alt="Language Icon" 
          className={`w-8 bg-cover ${direction === 'rtl' ? 'ml-2' : 'mr-2'}`}
        />
        {i18n.language === 'ar' ? 'العربية' : 'English'}
        <img
          src={down}
          className={`transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : 'rotate-0'} ${direction === 'rtl' ? 'mr-2' : 'ml-2'}`}
          alt="Dropdown Icon"
        />
      </button>
      {dropdownOpen && (
        <div className={`absolute ${direction === 'rtl' ? 'right-8' : 'left-8'} mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg`}>
          <button
            onClick={() => changeLanguage('ar')}
            className={`flex items-center px-4 py-2 ${direction === 'rtl' ? 'text-right' : 'text-left'}`}
          >
            <img src={egyptIcon} alt="علم مصر" className={`w-8 bg-cover ${direction === 'rtl' ? 'ml-2' : 'mr-2'}`} />
            العربية
          </button>
          <button
            onClick={() => changeLanguage('en')}
            className={`flex items-center px-4 py-2 ${direction === 'rtl' ? 'text-right' : 'text-left'}`}
          >
            <img src={englishIcon} alt="English icon" className={`w-8 bg-cover ${direction === 'rtl' ? 'ml-2' : 'mr-2'}`} />
            English
          </button>
        </div>
      )}
    </div>
  );
};

export default LanguageDropdown;
