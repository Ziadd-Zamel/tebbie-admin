import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { exportIcon } from '../../assets';

const data = [
  { name: '1', something: 2, Recruitres: 2 },
  { name: '2', something: 4, Recruitres: 5 },
  { name: '3', something: 6, Recruitres: 7 },
  { name: '4', something: 7, Recruitres: 10 },
  { name: '5', something: 9, Recruitres: 11 },
  { name: '6', something: 10, Recruitres: 12 },
  { name: '7', something: 13, Recruitres: 12 },
  { name: '8', something: 13, Recruitres: 13 },
  { name: '9', something: 15, Recruitres: 16 },
  { name: '10', something: 16, Recruitres: 15 },
  { name: '11', something: 17, Recruitres: 18 },
  { name: '12', something: 19, Recruitres: 24 },
];

const CustomLegend = ({ payload, onMouseEnter, onMouseLeave }) => {
  return (
    <div className="flex justify-start mb-2 px-4"> {/* Adjusted to justify-start */}
      {payload.map((entry, index) => (
        <div
          key={`item-${index}`}
          className="flex items-center ms-4 cursor-pointer"
          onMouseEnter={() => onMouseEnter(entry)}
          onMouseLeave={() => onMouseLeave(entry)}
        >
          <div
            className="w-3 h-3 rounded-full m-1"
            style={{ backgroundColor: entry.color }} 
          ></div>
                    <span>{entry.value}</span>

        </div>
      ))}
    </div>
  );
};

const Statistcs = () => {
  const { t } = useTranslation();

  const [opacity, setOpacity] = useState({
    Recruitres: 1,
    something: 1,
  });

  const handleMouseEnter = (o) => {
    const { dataKey } = o;
    setOpacity((op) => ({ ...op, [dataKey]: 0.5 }));
  };

  const handleMouseLeave = (o) => {
    const { dataKey } = o;
    setOpacity((op) => ({ ...op, [dataKey]: 1 }));
  };

  return (
    <div className="w-full rounded-lg">
      <div className="flex justify-between p-5">
        <p className="font-bold text-md md:text-xl">{t("Statistcs")}</p>
        <img src={exportIcon} alt="Export Icon" />
      </div>
      <div > 
        <CustomLegend
          payload={[
            { value: 'Recruitres', color: '#4C6FFF' },
            { value: 'Something', color: '#FF92AE' },
          ]}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        />
      <div className=' h-[250px]' >
      <ResponsiveContainer width="100%" height={250}>
      <LineChart
            data={data}
            margin={{ top: 0, right: 0, left: 0, bottom: 0 }} 
          >
            <XAxis dataKey="name" axisLine={false} tickLine={false} />
            <YAxis
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `${value} h`}
            />
            <Tooltip formatter={(value) => `${value} `} />
            <Line
              type="monotone"
              dataKey="Recruitres"
              strokeOpacity={opacity.Recruitres}
              stroke="#4C6FFF"
              strokeWidth={3}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="something"
              strokeOpacity={opacity.something}
              stroke="#FF92AE"
              strokeWidth={3}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
</div>
      </div>
    </div>
  );
};

export default Statistcs;
