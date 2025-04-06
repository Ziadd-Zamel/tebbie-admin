import { useTranslation } from "react-i18next";
import { budgetIcon, CompletionIcon, hoursIcon, taskIcon } from "../assets";
import Profits from "../components/Financial/Profits";
import Statistcs from "../components/Financial/Statistcs";
import ProductOrders from "../components/Financial/ProductOrders";
import ProfileVeiw from "../components/Financial/ProfileVeiw";

const Financial = () => {
  const { t } = useTranslation();

  return (
    <section  className="container max-auto md:px-4 px-2 ">
      <div  className="w-full py-8">
        <div className="grid lg:grid-cols-8 grid-cols-12 gap-4 ">
          <div className="p-6 lg:col-span-2 md:col-span-6 col-span-12 bg-white border-[2px] shadow-sm border-[#EDF2F7] rounded-[20px] ">
            <div className="flex justify-between ">
              <div>
                <p className="font-bold text-[#718096] text-lg md:text-2xl mb-5">
                  {t("Completion")}
                </p>
                <span className="font-bold text-3xl">63%</span>
              </div>
              <div>
                <img src={CompletionIcon} />
              </div>
            </div>
            <div className="flex gap-4 py-3">
              <span className="py-2 rounded-lg text-xl font-extrabold text-[#F16063] px-4 bg-[#FFE6E4]">
                -4 %
              </span>
              <p className="text-[#718096] font-medium text-lg flex items-center">
                since last month
              </p>
            </div>
          </div>
           <div className="lg:col-span-2 md:col-span-6 col-span-12 bg-white p-6  rounded-[20px] border-[2px] border-[#EDF2F7] shadow-sm">
            <div className="flex justify-between">
              <div>
                <p className="font-bold text-[#718096] text-lg md:text-2xl mb-5">
                  {t("totalHours")}
                </p>
                <span className="font-bold text-3xl">1,500</span>
              </div>
              <div>
                <img src={hoursIcon} />
              </div>
            </div>
            <div className="flex gap-4 py-3">
              <span className="py-2 rounded-lg text-xl font-extrabold text-[#66CB9F] px-4 bg-[#DEFFEE]">
              +23 %
              </span>
              <p className="text-[#718096] font-medium text-lg flex items-center">
                since last month
              </p>
            </div>
          </div>
          <div className="lg:col-span-2 md:col-span-6 col-span-12 bg-white p-6  rounded-[20px] border-[2px] border-[#EDF2F7] shadow-sm">
            <div className="flex justify-between">
              <div>
                <p className="font-bold text-[#718096] text-lg md:text-2xl mb-5">
                  {t("Tasks")}
                </p>
                <span className="font-bold text-3xl">215</span>
              </div>
              <div>
                <img src={taskIcon} />
              </div>
            </div>
            <div className="flex gap-4 py-3">
              <span className="py-2 rounded-lg text-xl font-extrabold text-[#66CB9F] px-4 bg-[#DEFFEE]">
              +2 %
              </span>
              <p className="text-[#718096] font-medium text-lg flex items-center">
                since last month
              </p>
            </div>
          </div>
          <div className="lg:col-span-2 md:col-span-6 col-span-12 bg-white p-6  rounded-[20px] border-[2px] border-[#EDF2F7] shadow-sm">
            <div className="flex justify-between">
              <div>
                <p className="font-bold text-[#718096] text-lg md:text-2xl mb-5">
                  {t("Budget")}
                </p>
                <span className="font-bold text-3xl">$17,500.90</span>
              </div>
              <div>
                <img src={budgetIcon} />
              </div>
            </div>
            <div className="flex gap-4 py-3">
              <span className="py-2 rounded-lg text-xl font-extrabold text-[#66CB9F] px-4 bg-[#DEFFEE]">
              +13 %
              </span>
              <p className="text-[#718096] font-medium text-lg flex items-center">
                since last month
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-12 gap-4 mt-6 ">
          <div className="md:col-span-4 col-span-12 bg-white md:p-4 p-2  rounded-[20px] shadow-md w-full">
            <Profits/>
          </div>
          <div className="md:col-span-8 col-span-12 bg-white md:p-4 p-2  rounded-[20px] shadow-md w-full">
            <Statistcs/>
          </div>
        </div>

        <div className="grid md:grid-cols-12  gap-4 mt-6 ">
          <div className="md:col-span-8 col-span-12 bg-white md:p-4 p-2 rounded-[20px] shadow-md w-full">
            <ProfileVeiw/>
          </div>
          <div className="md:col-span-4 col-span-12 bg-white md:p-4 p-2 rounded-[20px] shadow-md w-full">
            <ProductOrders/>
          </div>
        </div>
        
      </div>
    </section>
  );
};

export default Financial;
