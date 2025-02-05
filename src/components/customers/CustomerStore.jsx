import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import DropdownMenu from '../productsComponents/DropdownMenu';

const CustomerStore = () => {
  const { i18n ,t} = useTranslation();
  const direction = i18n.language === 'ar' ? 'rtl' : 'ltr';

  const data = [
    {
      BillNumber: '123456789',
      numberOfInvoke: 5,
      date: '2024-10-01',
      salary: '10',
      total: '123456789',
    },
    {
        BillNumber: '123456789',
      numberOfInvoke: 3,
      date: '2024-10-02',
      salary: '20',
      total: '123456789',
    },
    {
      BillNumber: '123456789',
      numberOfInvoke: 2,
      date: '2024-10-03',
      salary: '30',
      total: '123456789',
    },
  ];

  return (
    <div dir={direction} className="flex justify-center">
      <div className="overflow-x-auto lg:w-full w-[90dvw]">
        <table className="min-w-full bg-white h-full">
          <thead>
            <tr className="bg-[#E6F6F5] text-black rounded-xl">
              <th className="py-6 px-2 flex justify-center text-center">
                <input type="checkbox" className="InputPrimary me-2 flex-shrink-0 w-5 h-5" />
                <span>{t("BillNumber")}</span>
              </th>
              <th className="py-6 px-2 text-center"> {t("InvoiceNumber")}</th>
              <th className="py-6 px-2 text-center"> {t("Date")}</th>
              <th className="py-6 px-2 text-center"> {t("salary")}</th>
              <th className="py-6 px-2 text-center">{t("PaymentMethod")}</th>
              <th className="py-6 px-2 text-center"></th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <Row key={index} item={item} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Row = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <tr className="text-gray-600 md:text-lg text-md">
      <td className="py-6 flex  px-2 justify-center text-center  ">
        <input type="checkbox" className="InputPrimary me-2" />
        {item.BillNumber}
      </td>
      <td className="py-6 px-2 text-center">{item.numberOfInvoke}</td>
      <td className="py-6 px-2 text-center">{item.date}</td>
      <td className="py-6 px-2 text-center">{item.salary}LE</td>
      <td className="py-6 px-2 text-center">{item.total}</td>
      <td className="py-6 px-2 text-center min-w-[100px]">
        <DropdownMenu isOpen={isOpen} onToggle={handleToggle} />
      </td>
    </tr>
  );
};

export default CustomerStore;
