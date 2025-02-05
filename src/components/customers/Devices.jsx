import React from 'react'
import { useTranslation } from 'react-i18next';

const Devices = () => {
    const { t, i18n } = useTranslation();
    
    
    const initialData = [
        {
          id: 1,
          name: "منتج 1",
          date: "25/04/2024",
          image: "https://via.placeholder.com/40",
          status: "جديد",
        },
        {
          id: 2,
          name: "منتج 2",
          date: "25/04/2024",
          image: "https://via.placeholder.com/40",
          status: "جديد",
        },
        {
          id: 3,
          name: "منتج 3",
          date: "25/04/2024",
          image: "https://via.placeholder.com/40",
          status: "جديد",
        },
      ];
  return (
    <table className="w-full  border-collapse border text-md md:text-lg almarai-normal border-transparent">
    <thead className="bg-[#E6F6F5] rounded-xl py-5 h-16 w-full">
      <tr>
        <th className="border border-transparent text-start ">
          <span>
            <input type="checkbox" className=" InputPrimary mx-4 " />
            {t("devices")}
          </span>
        </th>
        <th className="border border-transparent">{t("status")}</th>
        <th className="border border-transparent">
          {t("deviceStatus")}
        </th>
      </tr>
    </thead>
    <tbody className="text-[#737791]">
      {initialData.length === 0 ? (
        <tr>
          <td colSpan="3" className="text-center py-4">
            {t("noData")}
          </td>
        </tr>
      ) : (
        initialData.map((row) => (
          <tr key={row.id}>
            <td className="border border-transparent py-6">
              <span className="flex items-center  cursor-pointer space-x-5">
                <input type="checkbox" className="mx-4 InputPrimary" />
                <img
                  src={row.image}
                  alt={row.name}
                  className="w-14 h-14 "
                />
                <div className="">{row.name}</div>
              </span>
            </td>
            <td className="border border-transparent py-6 text-center ">
              {row.date}
            </td>
            <td className="border border-transparent text-center py-6">
              <span className="px-4 py-2 text-primary bg-[#E6F6F5] rounded-lg border-primary border-[1px]">
                {row.status}
              </span>
            </td>
          </tr>
        ))
      )}
    </tbody>
  </table>
  )
}

export default Devices
