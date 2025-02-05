import { useTranslation } from "react-i18next";
import {
  addPersonIcon,
  exportIcon,
  productSoldIcon,
  totalOrderIcon,
  totalSalesIcon,
} from "../../assets";

const TodaySales = () => {
  const { t } = useTranslation();

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <div>
          <p className="font-bold text-xl md:text-2xl">{t("today-sales")}</p>
          <p className="text-slate-500 text-lg md:text-xl py-2">
            {t("Sales-Summary")}
          </p>
        </div>
        <div>
          <img alt="export Icon" src={exportIcon} className="h-full w-full" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 flex-wrap">
        <div className="bg-[#F3E8FF] p-4 rounded-xl flex flex-col items-start shrink-0">
          <img alt="addPersonIcon" src={addPersonIcon} className="h-8 w-8 mb-2" />
          <div className="font-bold text-xl">8</div>
          <h1 className="font-semibold text-md">New Customers</h1>
          <p className="text-[#4079ED] my-2 text-sm">0.5% from yesterday</p>
        </div>
        <div className="bg-[#DCFCE7] p-4 rounded-xl flex flex-col items-start">
          <img alt="productSoldIcon" src={productSoldIcon} className="h-8 w-8 mb-2" />
          <div className="font-bold text-xl">5</div>
          <h1 className="font-semibold text-md">Product Sold</h1>
          <p className="text-[#4079ED] my-2 text-sm">0.5% from yesterday</p>
        </div>
        <div className="bg-[#FFF4DE] p-4 rounded-xl flex flex-col items-start">
          <img alt="totalOrderIcon" src={totalOrderIcon} className="h-8 w-8 mb-2" />
          <div className="font-bold text-xl">300</div>
          <h1 className="font-semibold text-md">Total Orders</h1>
          <p className="text-[#4079ED] my-2 text-sm">0.5% from yesterday</p>
        </div>
        <div className="bg-[#FFE2E5] p-4 rounded-xl flex flex-col items-start">
          <img alt="totalSalesIcon" src={totalSalesIcon} className="h-8 w-8 mb-2" />
          <div className="font-bold text-xl">$1k</div>
          <h3 className="font-semibold text-md">Total Sales</h3>
          <p className="text-[#4079ED] my-2 text-sm">0.5% from yesterday</p>
        </div>
      </div>
    </>
  );
};

export default TodaySales;
