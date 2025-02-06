import React, { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { useTranslation } from 'react-i18next';

const Profits = () => {
  const [activeTab, setActiveTab] = useState('monthly');

  const monthlyData = [
    { name: 'Jan', profit: 4000 },
    { name: 'Feb', profit: 3000 },
    { name: 'Mar', profit: 2000 },
    { name: 'Apr', profit: 2780 },
    { name: 'May', profit: 1890 },
    { name: 'Jun', profit: 2390 },
    { name: 'Jul', profit: 3490 },
    { name: 'Aug', profit: 2000 },
    { name: 'Sep', profit: 2780 },
    { name: 'Oct', profit: 1890 },
    { name: 'Nov', profit: 2390 },
    { name: 'Dec', profit: 3490 },
  ];

  const yearlyData = [
    { name: '2020', profit: 24000 },
    { name: '2021', profit: 35000 },
    { name: '2022', profit: 30000 },
    { name: '2023', profit: 45000 },
  ];

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const data = activeTab === 'monthly' ? monthlyData : yearlyData; 
  const { t, i18n } = useTranslation();


  return (
    <div >
      <p className="font-bold text-lg md:text-xl mb-4 text-start p-6">{t('Profits')}</p>

      <div className="flex justify-center">
        <button
          className={`px-6 py-2 mx-2 font-semibold text-white rounded-md transition ${
            activeTab === 'monthly' ? 'bg-[#FF92AE] shadow-md' : 'bg-gray-400 hover:bg-[#FF92AE]  '
          }`}
          onClick={() => handleTabClick('monthly')}
        >
          {t('Monthly')}
        </button>
        <button
          className={`px-6 py-2 mx-2 font-semibold text-white rounded-md transition ${
            activeTab === 'yearly' ? 'bg-[#4C6FFF] shadow-md' : 'bg-gray-400 hover:bg-[#4C6FFF]'
          }`}
          onClick={() => handleTabClick('yearly')}
        >
          {t('Yearly')}
        </button>
      </div>

      {/* Chart Display */}
      <div className='w-full h-[250px]' >
      <ResponsiveContainer width="100%" height={250}>
          <LineChart
            data={data}
            margin={{
              top: 20, right: 30, left: 20, bottom: 5,
            }}
          >
            <XAxis axisLine={false} tickLine={false} dataKey="name" />
            <YAxis axisLine={false} tickLine={false} />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="profit" 
              stroke={activeTab === 'monthly' ? '#FF92AE' : '#4C6FFF'} 
              strokeWidth={4} 
              activeDot={{ r: 8 }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Profits;
