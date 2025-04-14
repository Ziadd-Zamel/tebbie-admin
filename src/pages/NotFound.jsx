/* eslint-disable react/no-unescaped-entities */
// src/pages/NotFound.jsx
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const NotFound = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen  flex items-center justify-center relative overflow-hidden">
      {/* Stars background */}
      <div className="absolute inset-0 text-5xl text-red-500"></div>
      
      {/* Content */}
      <div className="text-center text-zinc-700 z-10 p-8">
        <h1 className="text-8xl md:text-9xl font-bold text-red-500 ">
          404
        </h1>
        <h2 className="text-3xl md:text-4xl mt-4 font-semibold">
          {t("Oops! Lost in Space?")}
        </h2>
        <p className="text-lg md:text-xl mt-4 opacity-80 max-w-md mx-auto">
          {t("The page you're looking for seems to have vanished into a black hole!")}
        </p>
        <Link 
          to="/" 
          className="mt-8 inline-block bg-gradient-to-bl from-[#33A9C7] to-[#3AAB95] text-white font-bold py-3 px-6 rounded-full hover:[#02a09b] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_5px_15px_rgba(69,183,209,0.4)]"
        >
          {t("Return to Dashbord")}
        </Link>
      </div>
    </div>
  );
};

export default NotFound;