import React from "react";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useTranslation } from "react-i18next";
import { realitySales, targetSales } from "../../assets";

const TargetVsReality = () => {
  const { t } = useTranslation();

  // Sample data for Target vs Reality
  const data = [
    { name: "January", Target: 5000, Reality: 4800 },
    { name: "February", Target: 6000, Reality: 5500 },
    { name: "March", Target: 7000, Reality: 7500 },
    { name: "April", Target: 8000, Reality: 7900 },
    { name: "May", Target: 6000, Reality: 8000 },
    { name: "June", Target: 10000, Reality: 7950 },
    { name: "July", Target: 6000, Reality: 8000 },
    { name: "August", Target: 10000, Reality: 7950 },
  ];

  return (
    <div className="overflow-x-auto">
      <p className="font-bold text-xl md:text-2xl m-5">
        {t("TargetVsReality")}
      </p>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <XAxis
            axisLine={false}
            dataKey="name"
            tick={{ fontSize: 10 }}
            interval={0}
          />
          <Tooltip />
          <Bar
            radius={[4, 4, 4, 4]}
            barSize={15}
            dataKey="Target"
            fill="#02A09B"
          />
          <Bar
            radius={[4, 4, 4, 4]}
            barSize={15}
            dataKey="Reality"
            fill="#FFB948"
          />
        </BarChart>
      </ResponsiveContainer>

      <div className="items-center mt-5 space-y-2">
        {/* Reality Sales */}
        <div className="flex justify-between">
          <p className="text-md text-[#02A09B]">24,700</p>
          <div className="flex gap-2">
          <div className="flex flex-col text-end">
          <p className="text-lg  font-bold mt-2">Reality Sales</p>
            <p className="text-sm">Global</p>
            </div>
            <img src={realitySales} />
          </div>
        </div>

        {/* Target Sales */}
        <div className="flex justify-between items-center">
          <p className="text-md text-[#FFB948] ">26,000</p>
          <div className="flex items-center gap-2">
            <div className="flex flex-col text-end">
              <p className="text-md font-bold mt-2">Target Sales</p>
              <p className="text-sm">Commercial</p>
            </div>
            <img src={targetSales} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TargetVsReality;
