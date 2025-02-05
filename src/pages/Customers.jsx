import React, { useState } from "react";
import DropdownMenu from "../components/productsComponents/DropdownMenu";
import { useTranslation } from "react-i18next";

const initialData = [
  {
    id: 1,
    numberOfProduct: "123456789",
    name: "منتج 1",
    mobileNumber: "01147200658",
    status: "متوفر",
    image: "https://via.placeholder.com/40",
    checked: true,
  },
  {
    id: 2,
    numberOfProduct: "123456790",
    name: "منتج 2",
    mobileNumber: "01147200658",
    status: "غير متوفر",
    image: "https://via.placeholder.com/40",
    checked: false,
  },
  {
    id: 3,
    numberOfProduct: "123456791",
    name: "منتج 3",
    mobileNumber: "01147200658",
    status: "اخر قطعة",
    image: "https://via.placeholder.com/40",
    checked: false,
  },
  {
    id: 4,
    numberOfProduct: "123456792",
    name: "منتج 4",
    mobileNumber: "01147200658",
    status: "غير متوفر",
    image: "https://via.placeholder.com/40",
    checked: false,
  },
  {
    id: 5,
    numberOfProduct: "123456793",
    name: "منتج 5",
    mobileNumber: "01147200658",
    status: "متوفر",
    image: "https://via.placeholder.com/40",
    checked: false,
  },
  {
    id: 6,
    numberOfProduct: "123456794",
    name: "منتج 6",
    mobileNumber: "01147200658",
    status: "غير متوفر",
    image: "https://via.placeholder.com/40",
    checked: false,
  },
  {
    id: 7,
    numberOfProduct: "123456795",
    name: "منتج 7",
    mobileNumber: "01147200658",
    status: "متوفر",
    image: "https://via.placeholder.com/40",
    checked: false,
  },
  {
    id: 8,
    numberOfProduct: "123456796",
    name: "منتج 8",
    mobileNumber: "01147200658",
    status: "غير متوفر",
    image: "https://via.placeholder.com/40",
    checked: true,
  },
  {
    id: 9,
    numberOfProduct: "123456797",
    name: "منتج 9",
    mobileNumber: "01147200658",
    status: "متوفر",
    image: "https://via.placeholder.com/40",
    checked: false,
  },
  {
    id: 10,
    numberOfProduct: "123456798",
    name: "منتج 10",
    mobileNumber: "01147200658",
    status: "اخر قطعة",
    image: "https://via.placeholder.com/40",
    checked: false,
  },
  {
    id: 11,
    numberOfProduct: "123456799",
    name: "منتج 11",
    mobileNumber: "01147200658",
    status: "متوفر",
    image: "https://via.placeholder.com/40",
    checked: false,
  },
  {
    id: 12,
    numberOfProduct: "123456800",
    name: "منتج 12",
    mobileNumber: "01147200658",
    status: "اخر قطعة",
    image: "https://via.placeholder.com/40",
    checked: false,
  },
  {
    id: 13,
    numberOfProduct: "123456801",
    name: "منتج 13",
    mobileNumber: "01147200658",
    status: "متوفر",
    image: "https://via.placeholder.com/40",
    checked: true,
  },
  {
    id: 14,
    numberOfProduct: "123456802",
    name: "منتج 14",
    mobileNumber: "01147200658",
    status: "اخر قطعة",
    image: "https://via.placeholder.com/40",
    checked: false,
  },
  {
    id: 15,
    numberOfProduct: "123456803",
    name: "منتج 15",
    mobileNumber: "01147200658",
    status: "متوفر",
    image: "https://via.placeholder.com/40",
    checked: false,
  },
  {
    id: 16,
    numberOfProduct: "123456804",
    name: "منتج 16",
    mobileNumber: "01147200658",
    status: "غير متوفر",
    image: "https://via.placeholder.com/40",
    checked: true,
  },
  {
    id: 17,
    numberOfProduct: "123456805",
    name: "منتج 17",
    mobileNumber: "01147200658",
    status: "متوفر",
    image: "https://via.placeholder.com/40",
    checked: false,
  },
  {
    id: 18,
    numberOfProduct: "123456806",
    name: "منتج 18",
    mobileNumber: "01147200658",
    status: "غير متوفر",
    image: "https://via.placeholder.com/40",
    checked: false,
  },
  {
    id: 19,
    numberOfProduct: "123456807",
    name: "منتج 19",
    mobileNumber: "01147200658",
    status: "متوفر",
    image: "https://via.placeholder.com/40",
    checked: true,
  },
  {
    id: 20,
    numberOfProduct: "123456808",
    name: "منتج 20",
    mobileNumber: "01147200658",
    status: "غير متوفر",
    image: "https://via.placeholder.com/40",
    checked: false,
  },
];

const Customers = () => {
  const [data, setData] = useState(initialData);
  const [filterSort, setFilterSort] = useState("");
  const [headerChecked, setHeaderChecked] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const { i18n, t } = useTranslation();
  const direction = i18n.language === "ar" ? "rtl" : "ltr";

  const handleFilterSortChange = (event) => {
    setFilterSort(event.target.value);
  };

  const handleSwitchChange = (id) => {
    if (headerChecked) {
      setData(
        data.map((product) =>
          product.id === id
            ? { ...product, checked: !product.checked }
            : product
        )
      );
    }
  };

  const handleHeaderCheckboxChange = () => {
    setHeaderChecked((CheckedState) => !CheckedState);
  };

  const handleDelete = (productId) => {
    setData(data.filter((item) => item.id !== productId));
    console.log(`Deleting product with id: ${productId}`);
  };

  const handleEdit = (productId) => {
    console.log(`Editing product with id: ${productId}`);
  };

  const getFilteredSortedData = () => {
    let filteredData = [...data];

    if (filterSort === "available") {
      filteredData = filteredData.filter((item) => item.status === "متوفر");
    } else if (filterSort === "not-available") {
      filteredData = filteredData.filter((item) => item.status === "غير متوفر");
    } else if (filterSort === "highest-price") {
      filteredData = filteredData.sort((a, b) => b.price - a.price);
    } else if (filterSort === "lowest-price") {
      filteredData = filteredData.sort((a, b) => a.price - b.price);
    }

    return filteredData;
  };

  const filteredData = getFilteredSortedData();

  const handleDropdownToggle = (id) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  return (
    <section dir={direction} className="container mx-auto md:px-4 px-2 py-8">
      <div className="w-full bg-white rounded-lg md:p-8 p-2">
        <div className="flex justify-end py-6">
          <select
            className="px-4 py-3 rounded-lg w-auto border-[1px] border-[#787486]"
            onChange={handleFilterSortChange}
          >
            <option value="">تصنيف حسب</option>
            <option value="available">متوفر</option>
            <option value="not-available">غير متوفر</option>
            <option value="highest-price">الأعلى سعراً</option>
            <option value="lowest-price">الأقل سعراً</option>
          </select>
        </div>

        <div className="overflow-x-auto md:w-full w-[100dvw]">
          <table className="w-full border-collapse border md:text-lg text-md almarai-normal border-transparent">
            <thead className="bg-[#E6F6F5] h-[60px] rounded-xl ">
              <tr>
                <th className="border border-transparent text-start px-2 py-6">
                  <label>
                    <input
                      type="checkbox"
                      checked={headerChecked}
                      onChange={handleHeaderCheckboxChange}
                      className="mx-10 text-primary InputPrimary "
                    />
                    {t("clientName")}
                  </label>
                </th>
                <th className="border border-transparent text-center px-2 py-6">
                  {t("email")}
                </th>
                <th className="border border-transparent px-2 ">
                  {t("phone")}
                </th>
                <th className="border border-transparent px-2 ">
                  {t("phone")}
                </th>
                <th className="border border-transparent  px-2"></th>
              </tr>
            </thead>
            <tbody className="text-[#737791]">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    لا توجد بيانات
                  </td>
                </tr>
              ) : (
                filteredData.map((row) => (
                  <tr key={row.id}>
                    <td className="border border-transparent  py-6  ">
                      <label className="flex items-center cursor-pointer space-x-5">
                        <input
                          type="checkbox"
                          checked={row.checked}
                          onChange={() => handleSwitchChange(row.id)}
                          className="mx-10 InputPrimary min-w-[18px] "
                          disabled={!headerChecked}
                        />
                   
                        <div className="mr-2">{row.numberOfProduct}</div>
                      </label>
                    </td>
                    <td className="border border-transparent py-2 px-2 text-center">
                      {row.name}
                    </td>
                    <td className="border border-transparent py-2 px-2 text-center">
                      {row.mobileNumber}
                    </td>

                    <td className="border border-transparent py-2 px-2 text-center">
                      {row.status}
                    </td>
                    <td className="border border-transparent py-2 px-2 text-center">
                      <div className="flex items-center gap-2 min-w-[22px]">
                        <DropdownMenu
                          isOpen={openDropdownId === row.id}
                          onEdit={() => handleEdit(row.id)}
                          onDelete={() => handleDelete(row.id)}
                          onToggle={() => handleDropdownToggle(row.id)}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default Customers;
