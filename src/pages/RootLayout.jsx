import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useTranslation } from 'react-i18next';

const RootLayout = () => {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;

  return (
    <div className={`min-h-screen w-full flex ${currentLanguage === 'ar' ? 'flex-row-reverse' : ''}`}>
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 rounded-t-[20px] bg-[#F9FAFB]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default RootLayout;
