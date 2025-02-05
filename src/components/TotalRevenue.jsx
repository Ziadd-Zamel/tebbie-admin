import { useTranslation } from "react-i18next";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const TotalRevenue = () => {
  const { t, i18n } = useTranslation();

  const data = [
    { day: "Monday", online: 4000, offline: 2400 },
    { day: "Tuesday", online: 3000, offline: 1398 },
    { day: "Wednesday", online: 2000, offline: 9800 },
    { day: "Thursday", online: 2780, offline: 3908 },
    { day: "Friday", online: 1890, offline: 4800 },
    { day: "Saturday", online: 2390, offline: 3800 },
    { day: "Sunday", online: 20000, offline: 10000 }, 
  ];

  return (
    <div className={` ${i18n.language === 'ar' ? 'text-right' : 'text-left'}`}>
           <p className="font-bold p-5 text-xl md:text-2xl mb-5">
        {t('TotalRevenueTitle')}
      </p>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 10,
            left: 0,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="0" vertical={false} />
          <XAxis
            axisLine={false} 
            dataKey="day"
          />
          <YAxis
            axisLine={false}
            domain={[0, 25000]} 
            ticks={[0, 5000, 10000, 15000, 20000, 25000]} 
            tickFormatter={(value) => `${value / 1000}k`} 
          />
          <Tooltip />
          <Legend />
          <Bar
            dataKey="online"
            fill="#0095FF"
            radius={[4, 4, 0, 0]}
            barSize={12}
          />
          <Bar
            dataKey="offline"
            fill="#00E096"
            radius={[4, 4, 0, 0]}
            barSize={12}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TotalRevenue;
