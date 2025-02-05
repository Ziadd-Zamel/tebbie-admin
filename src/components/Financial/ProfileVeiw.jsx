import React from "react";
import { useTranslation } from "react-i18next";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Sample data for the bar chart
const data = [
  { name: "User 1", Users: 10, Recruiters: 5, Incognito: 3 },
  { name: "User 2", Users: 15, Recruiters: 10, Incognito: 5 },
  { name: "User 3", Users: 20, Recruiters: 15, Incognito: 8 },
  { name: "User 4", Users: 25, Recruiters: 20, Incognito: 10 },
  { name: "User 5", Users: 30, Recruiters: 25, Incognito: 12 },
];

// Custom legend component
const CustomLegend = () => {
  return (
    <div className="flex justify-end mb-2">
      <div className="flex items-center space-x-2">
      <span className="ml-1">Users</span>
        <div className="w-3 h-3 rounded-full bg-[#7895FF]" ></div>
      </div>
      <div className="flex items-center space-x-2">
      <span className="ml-1">Recruiters</span>

        <div className="w-3 h-3 rounded-full bg-[#FF92AE]" ></div>
      </div>
      <div className="flex items-center space-x-2">
      <span className="ml-1">Incognito</span>
        <div className="w-3 h-3 rounded-full bg-[#FFA500]" ></div>
      </div>
    </div>
  );
};

const ProfileView = () => {
  const { t } = useTranslation();

  return (
    <div className="p-4 ">
      <p className="font-bold text-md md:text-xl mb-4">{t("ProfileView")}</p>
      
      {/* Custom Legend Above the Chart */}
      <CustomLegend />

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis axisLine={false} tickLine={false} dataKey="name" />
          <YAxis axisLine={false} tickLine={false} />
          <Tooltip formatter={(value) => `${value}`} />
          <Bar barSize={8} radius={[4, 4, 4, 4]} dataKey="Users" fill="#7895FF" />
          <Bar barSize={8} radius={[4, 4, 4, 4]} dataKey="Recruiters" fill="#FF92AE" />
          <Bar barSize={8} radius={[4, 4, 4, 4]} dataKey="Incognito" fill="#FFA500" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProfileView;
