import { useQuery } from "@tanstack/react-query";
import { getRechargeCards } from "../utlis/https";
import ErrorMessage from "./ErrorMessage";
import Loader from "./Loader";
import { IoCardOutline } from "react-icons/io5";
import { useState, useEffect } from "react";
import { IoMdAddCircle } from "react-icons/io";
import { Link } from "react-router-dom";
import { FaFileExcel } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import RechargeCardsPagination from "../components/RechargeCardsPagination";

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const RechargeCards = () => {
  const token = localStorage.getItem("authToken");
  const [searchTerm, setSearchTerm] = useState("");
  const [isValid, setIsValid] = useState(undefined);
  const [expireDate, setExpireDate] = useState("");
  const [price, setPrice] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const itemsPerPage = 100;
  const { t, i18n } = useTranslation();
  const direction = i18n.language === "ar" ? "rtl" : "ltr";

  const {
    data: cardData,
    isLoading,
    error,
  } = useQuery({
    queryKey: [
      "recharge-card",
      token,
      currentPage,
      debouncedSearchTerm,
      isValid,
      expireDate,
      price,
    ],
    queryFn: () =>
      getRechargeCards({
        token,
        page: currentPage,
        card_number: debouncedSearchTerm,
        is_valid: isValid,
        expire_date: expireDate,
        price: price,
      }),
  });

  const handleExport = () => {
    const params = new URLSearchParams({
      ...(debouncedSearchTerm && { card_number: debouncedSearchTerm }),
      ...(isValid !== undefined && { is_valid: isValid }),
      ...(expireDate && { expire_date: expireDate }),
      ...(price && { price: price }),
    });
    console.log(params.json());
    const url = `https://tabi.evyx.lol/api/dashboard/v1/recharge-card-export?${params.toString()}`;
    window.open(url, "_blank");
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleIsValidChange = (e) => {
    const value = e.target.value;
    setIsValid(value === "" ? undefined : Number(value));
    setCurrentPage(1);
  };

  const handleExpireDateChange = (e) => {
    setExpireDate(e.target.value);
    setCurrentPage(1);
  };

  const handlePriceChange = (e) => {
    setPrice(e.target.value);
    setCurrentPage(1);
  };

  if (error) {
    return <ErrorMessage />;
  }

  const startIndex = (currentPage - 1) * itemsPerPage;

  return (
    <section dir={direction} className="container mx-auto lg:p-6 p-4 w-full">
      <div className="flex justify-end md:flex-row flex-col gap-2 items-center">
        <Link
          to={"/recharge-card/add-card"}
          className="px-6 py-2 hover:bg-[#048c87] flex justify-center items-center text-white gap-2 bg-gradient-to-bl from-[#33A9C7] to-[#3AAB95] text-lg rounded-[8px] focus:outline-none text-center"
        >
          {t("AddCard")}
          <IoMdAddCircle />
        </Link>
        <button
          onClick={handleExport}
          className="px-6 py-2 border-[#048c87] border-2  text-[#048c87] text-lg rounded-[8px]  flex justify-center items-center gap-2"
        >
          {t("Excel-Export")}
          <FaFileExcel />
        </button>
      </div>
      <div className="my-4 flex flex-col gap-4 md:flex-row md:items-center">
        <div className="flex-1">
          <input
            type="text"
            id="search"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder={t("searchByCardNumber")}
            className="w-full p-2 border border-gray-300 rounded-lg py-3 px-4 bg-white h-[50px] focus:outline-none focus:border-primary"
          />
        </div>
        <div className="flex-1">
          <select
            id="isValid"
            value={isValid === undefined ? "" : isValid}
            onChange={handleIsValidChange}
            className="w-full p-2 border border-gray-300 rounded-lg py-3 px-4 bg-white h-[50px] focus:outline-none focus:border-primary"
          >
            <option value="">{t("allCards")}</option>
            <option value="1">{t("validCards")}</option>
            <option value="0">{t("invalidCards")}</option>
          </select>
        </div>
        <div className="flex-1">
          <input
            type="date"
            id="expireDate"
            value={expireDate}
            onChange={handleExpireDateChange}
            placeholder={t("selectExpireDate")}
            className="w-full p-2 border border-gray-300 rounded-lg py-3 px-4 bg-white h-[50px] focus:outline-none focus:border-primary"
          />
        </div>
        <div className="flex-1">
          <input
            type="number"
            id="price"
            value={price}
            onChange={handlePriceChange}
            placeholder={t("price")}
            className="w-full p-2 border border-gray-300 rounded-lg py-3 px-4 bg-white h-[50px] focus:outline-none focus:border-primary"
          />
        </div>
      </div>
      <div className="overflow-x-auto md:w-full w-[90vw] h-[70vh] overflow-auto">
        <table className="bg-white border border-gray-200 rounded-lg w-full border-spacing-0">
          <thead>
            <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-start">#</th>
              <th className="py-3 px-6 text-left">{t("cardNumber")}</th>
              <th className="py-3 px-6 text-left">{t("validatity")}</th>
              <th className="py-3 px-6 text-left  whitespace-nowrap">
                {t("expireDate")}
              </th>
              <th className="py-3 px-6 text-left whitespace-nowrap">
                {t("price")}
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-600 md:text-lg text-md font-light">
            {isLoading ? (
              <tr>
                <td colSpan="5" className="text-center py-4">
                  <Loader />
                </td>
              </tr>
            ) : cardData?.data?.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="text-center py-4 text-gray-500 text-lg"
                >
                  {t("noCardsFound")}
                </td>
              </tr>
            ) : (
              cardData?.data?.map((card, index) => (
                <tr
                  key={card.id}
                  className="border-b border-gray-200 hover:bg-gray-100"
                >
                  <td className="py-3 px-6 text-left flex items-center gap-3">
                    {index + 1 + startIndex}
                    <IoCardOutline size={30} className="text-gray-500" />
                  </td>
                  <td className="py-3 px-6 text-left">{card.card_number}</td>
                  <td className="py-3 px-6 text-left shrink-0 whitespace-nowrap">
                    <span
                      className={`font-semibold text-white rounded-full py-1 text-sm px-2  whitespace-nowrap ${
                        card.is_valid === 1
                          ? "bg-gradient-to-bl from-[#33A9C7] to-[#3AAB95] text-white"
                          : "bg-red-600"
                      }`}
                    >
                      {card.is_valid === 1 ? t("valid") : t("invalid")}
                    </span>
                  </td>
                  <td className="py-3 px-6 text-left whitespace-nowrap">
                    {card.expire_date}
                  </td>
                  <td className="py-3 px-6 text-left">{card.price}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-end gap-4 flex-wrap p-4">
        <RechargeCardsPagination
          currentPage={currentPage}
          totalPages={cardData?.pagination.total_pages || 1}
          onPageChange={setCurrentPage}
        />
        <p className="md:text-2xl text-xl text-gray-500 text-end">
          {t("total")} : {cardData?.pagination.total || 0}
        </p>
      </div>
    </section>
  );
};

export default RechargeCards;
