import { useTranslation } from "react-i18next";
import SelectAreaMap from "../components/SelectAreaMap";

const SelectArea = () => {
  const { t, i18n } = useTranslation();

  const isArabic = i18n.language === "ar";

  return (
    <section className="container mx-auto px-4 py-8 flex justify-center min-h-screen">
      <div
        dir={isArabic ? "rtl" : "ltr"}
        className="bg-white rounded-3xl w-full p-8 flex flex-col"
      >
        <form className="w-full max-w-6xl mx-auto flex flex-col flex-grow">
          <div className="grid lg:grid-cols-2 grid-cols-1 gap-8">
            <div className="my-5">
              <label className="block almarai-semibold mb-4" htmlFor="teamMembers1">
                {t("selectArea")}
              </label>
              <select className="border border-gray-100 rounded-xl py-2 px-4 bg-[#F7F8FA] h-[50px] focus:outline-none focus:border-primary w-full">
                <option>اختر الفريق</option>
                <option>حمزه</option>
                <option>يوسف</option>
                <option>محمد</option>
              </select>
            </div>
            <div className="my-5">
              <label className="block almarai-semibold mb-4" htmlFor="teamMembers2">
                {t("selectTeam")}
              </label>
              <select className="border border-gray-100 rounded-xl py-2 px-4 bg-[#F7F8FA] h-[50px] focus:outline-none focus:border-primary w-full">
                <option>اختر الفريق</option>
                <option>حمزه</option>
                <option>يوسف</option>
                <option>محمد</option>
              </select>
            </div>
          </div>

          {/* Flex container for the map and button with margin-top auto */}
          <div className="flex flex-col items-center justify-end mt-auto">
            <SelectAreaMap />
            <div className="flex justify-start mt-8 w-full">
              <button
                type="submit"
                className="bg-[#FFB948] text-lg py-2 hover:bg-[#e4bf84] lg:w-[135px] w-full text-white rounded-[8px] focus:outline-none"
              >
                حفظ
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default SelectArea;
