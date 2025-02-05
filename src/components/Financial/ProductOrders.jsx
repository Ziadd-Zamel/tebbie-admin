import { useTranslation } from "react-i18next";
import { RadialBarChart, RadialBar, Legend, ResponsiveContainer } from 'recharts';

const ProductOrders = () => {
  const { t } = useTranslation();

  const data = [
    {
      name: 'Finished',
      value: 120,
      fill: '#ff6f61',
    },
    {
      name: 'Pending',
      value: 90,
      fill: '#FFA550',
    },
    {
      name: 'Rejected',
      value: 100,
      fill: '#7F68FA',
    },
  ];

  // Calculate total orders
  const totalOrders = data.reduce((acc, item) => acc + item.value, 0);

  const renderTotalLabel = () => {
    return (
      <foreignObject x="35%" y="42%" width="30%" height="50">
        <div className="flex flex-col items-center justify-center text-md text-gray-800 font-bold text-center">
          <span>Total</span>
          <span>{totalOrders}</span>
        </div>
      </foreignObject>
    );
  };
  
  
  // Custom legend content
  const renderCustomLegend = () => (
      <ul >
        {data.map((entry, index) => (
          <li className="flex  justify-between" key={`item-${index}`} style={{ marginBottom: '5px', color: entry.fill }}>
            <span className="font-bold">{entry.name}: </span>
            <span>{entry.value}</span>
          </li>
        ))}
      </ul>
  );

  return (
    <div>
      <p className="font-bold text-md md:text-xl p-4">{t("ProductOrders")}</p>
      <div className="flex  flex-col justify-center items-center ">
      <ResponsiveContainer width="100%" height={300}>
          <RadialBarChart
            cx="50%" cy="50%"
            innerRadius="30%" outerRadius="90%"
            barSize={14} data={data}
            startAngle={90} endAngle={450}
          >
            <RadialBar
              minAngle={18}
              label={false} // Remove the numbers inside the bars
              background
              clockWise
              dataKey="value"
            />
            {renderTotalLabel()}
          </RadialBarChart>
        </ResponsiveContainer>
   </div>
        {/* Custom Legend under the chart */}
        {renderCustomLegend()}
    </div>
  );
};

export default ProductOrders;
