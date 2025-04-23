import { useQuery } from "@tanstack/react-query";
import { getRechargeCards } from "../utlis/https";
import ErrorMessage from "./ErrorMessage";
import Loader from "./Loader";
import { IoCardOutline } from "react-icons/io5";
import { useState } from "react";
import { IoMdAddCircle } from "react-icons/io";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";
import { FaFileExcel } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import Pagination from "../components/Pagination";
const RechargeCards = () => {
  const token = localStorage.getItem("authToken");
  const [selectedFilter, setSelectedFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { t, i18n } = useTranslation();
  const direction = i18n.language === "ar" ? "rtl" : "ltr";

  const {
    data: cardData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["recharge-card", token],
    queryFn: () => getRechargeCards({ token }),
  });

  if (isLoading) {
    return <Loader />;
  }
  if (error) {
    return <ErrorMessage />;
  }
  const today = new Date();
  const next30Days = new Date();
  const next60Days = new Date();
  const next90Days = new Date();
  next30Days.setDate(today.getDate() + 30);
  next60Days.setDate(today.getDate() + 60);
  next90Days.setDate(today.getDate() + 90);
  const filteredCards = cardData?.recharge_cards.filter((card) => {
    const cardDate = new Date(card.expire_date);
    const matchesSearch = card.card_number
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    if (selectedFilter === "30") {
      return cardDate >= today && cardDate <= next30Days && matchesSearch;
    } else if (selectedFilter === "60") {
      return cardDate > next30Days && cardDate <= next60Days && matchesSearch;
    } else if (selectedFilter === "90") {
      return cardDate > next60Days && cardDate <= next90Days && matchesSearch;
    }
    return matchesSearch;
  });

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPageCards = filteredCards.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  const totalPages = Math.ceil(filteredCards.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleExport = () => {
    const exportData = cardData?.recharge_cards.map((card) => ({
      "Card Number": card.card_number,
      "Expire Date": card.expire_date,
      Price: card.price,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const columnWidths = [{ wch: 20 }, { wch: 15 }, { wch: 10 }];
    worksheet["!cols"] = columnWidths;
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Recharge Cards");
    XLSX.writeFile(workbook, "RechargeCards.xlsx");
  };

  return (
    <section dir={direction} className="container mx-auto lg:p-6 p-4 w-full">
      <div className="flex justify-end md:flex-row flex-col gap-2 items-center">
        <Link
          to={"/recharge-card/add-card"}
          className="px-6 py-2 hover:bg-[#048c87]  flex justify-center items-center text-white  gap-2 bg-gradient-to-bl from-[#33A9C7] to-[#3AAB95] text-lg  rounded-[8px] focus:outline-none  text-center"
        >
          {t("AddCard")}
          <IoMdAddCircle />
        </Link>
        <button
          onClick={handleExport}
          className="px-6 py-2 bg-green-500 text-white text-lg rounded-[8px] hover:bg-green-600 flex justify-center items-center gap-2"
        >
          {t("Excel-Export")}
          <FaFileExcel />
        </button>
      </div>
      <div className="my-4 flex flex-col gap-4 md:flex-row md:items-center">
        <div>
    
          <select
            id="dateFilter"
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="w-full p-2 border  border-gray-300 rounded-lg py-3 px-4 bg-white h-[50px] focus:outline-none focus:border-primary "
          >
          <option value="">{t("showAll")}</option>
  <option value="30">{t("next30Days")}</option>
  <option value="60">{t("next60Days")}</option>
  <option value="90">{t("next90Days")}</option>
          </select>
        </div>
        <div className="flex-1">
   
          <input
            type="text"
            id="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t("searchByCardNumber")}
            className="  w-full p-2 border  border-gray-300 rounded-lg py-3 px-4 bg-white h-[50px] focus:outline-none focus:border-primary"
          />
        </div>
      </div>
      <div className="overflow-x-auto md:w-full w-[90vw]">
        <table className="bg-white border border-gray-200 rounded-lg w-full border-spacing-0">
          <thead>
            <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-start">#</th>
              <th className="py-3 px-6 text-left">{t("cardNumber")}</th>
    <th className="py-3 px-6 text-left">{t("expireDate")}</th>
              <th className="py-3 px-6 text-left">{t("price")} </th>
            </tr>
          </thead>
          <tbody className="text-gray-600 md:text-lg text-md font-light">
            {currentPageCards?.map((card, index) => (
              <tr
                key={card.id}
                className="border-b border-gray-200 hover:bg-gray-100"
              >
                <td className="py-3 px-6 text-left flex items-center gap-3">
                  {index + 1 + startIndex}
                  <IoCardOutline size={30} className="text-gray-500" />
                </td>
                <td className="py-3 px-6 text-left">{card.card_number}</td>
                <td className="py-3 px-6 text-left">{card.expire_date}</td>
                <td className="py-3 px-6 text-left">{card.price}</td>
              </tr>
            ))}
            {filteredCards?.length === 0 && (
              <tr>
                <td
                  colSpan="4"
                  className="text-center py-4 text-gray-500 text-lg"
                >
                       {t("noCardsFound")}

                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-end p-4">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
        <p className="md:text-2xl text-xl text-gray-500 text-end">
        {t("total")} : {filteredCards.length}
        </p>
      </div>
    </section>
  );
};

export default RechargeCards;
