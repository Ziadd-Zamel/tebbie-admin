import { useQuery } from "@tanstack/react-query";
import ErrorMessage from "./ErrorMessage";
import Loader from "./Loader";
import { getRefunds } from "../utlis/https";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Pagination from "../components/Pagination";
import { useNavigate } from "react-router-dom";

const Refunds = () => {
  const token = localStorage.getItem("authToken");
  const { t, i18n } = useTranslation();
  const direction = i18n.language === "ar" ? "rtl" : "ltr";
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const refundsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 600);
    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);
  const {
    data: refundsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["refunds", token, debouncedSearchTerm],
    queryFn: () =>
      getRefunds({
        token,
        hospitalname: encodeURIComponent(debouncedSearchTerm),
      }),
  });

  const indexOfLastCoupon = currentPage * refundsPerPage;
  const indexOfFirstCoupon = indexOfLastCoupon - refundsPerPage;
  const currentRefund = refundsData?.slice(
    indexOfFirstCoupon,
    indexOfLastCoupon
  );
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
  const totalPages =
    refundsData?.length > 0
      ? Math.ceil(refundsData.length / refundsPerPage)
      : 0;
  if (isLoading) return <Loader />;
  if (error) return <ErrorMessage />;
  return (
    <section dir={direction} className="container mx-auto p-6 bg-gray-50">
      <div className="my-10">
        <input
          type="text"
          name="name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={t("hospitalNameSearch")}
          className="border border-gray-300 rounded-lg py-2 px-4 bg-white h-[50px] focus:outline-none focus:border-primary w-full lg:w-[494px]"
        />
      </div>

      <div className="overflow-x-auto md:w-full w-[90vw] md:text-md text-sm">
        <table className="w-full bg-white shadow-md">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-4">#</th>
              <th className="p-4 whitespace-nowrap">{t("hospital")}</th>
              <th className="p-4">number of booking</th>
            </tr>
          </thead>
          <tbody>
            {currentRefund.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center p-4">
                  {t("noData")}
                </td>
              </tr>
            ) : (
              currentRefund.map((refund ,index) => (
                <tr
                  onClick={() => navigate(`/refunds/${refund.hospital.id}`)}
                  key={index}
                  className="text-center border border-b  hover:bg-gray-100 cursor-pointer"
                >
                  <td className="p-4">{index}</td>
                  <td className="p-4 whitespace-nowrap">
                    {refund.hospital.name}
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    {refund.booking_count}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </section>
  );
};

export default Refunds;
