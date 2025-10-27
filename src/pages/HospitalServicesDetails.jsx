/* eslint-disable react/prop-types */
import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ErrorMessage from "./ErrorMessage";
import Loader from "./Loader";
import Pagination from "../components/Pagination";
import {
  getHospitalServiceReportById,
  cancelHospitalServiceBooking,
} from "../utlis/https";
import { utils, writeFile } from "xlsx";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const HospitalServicesDetails = () => {
  const token = localStorage.getItem("authToken");
  const { hospitalId } = useParams();
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();

  const [currentPage, setCurrentPage] = useState(1);
  const statesPerPage = 10;
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [status, setStatus] = useState(""); // "completed" | "pending" | "deleted" | ""

  const {
    data = { hospital_name: "", bookings: [] },
    isLoading,
    error,
  } = useQuery({
    queryKey: [
      "hospital-services-details",
      token,
      hospitalId,
      fromDate,
      toDate,
      status,
    ],
    queryFn: () =>
      getHospitalServiceReportById({
        token,
        hospital_id: hospitalId,
        from_date: fromDate,
        to_date: toDate,
        status: status === "deleted" ? undefined : status,
        deleted: status === "deleted" ? true : undefined,
      }),
    enabled: !!token && !!hospitalId,
    keepPreviousData: true,
  });

  const filteredBookings = useMemo(() => {
    const list = Array.isArray(data?.bookings) ? data.bookings : [];

    const isWithinDateRange = (createdAt) => {
      if (!fromDate && !toDate) return true;
      const onlyDate = (val) => {
        const str = String(val || "");
        return str.includes(" ") ? str.split(" ")[0] : str;
      };
      const created = onlyDate(createdAt);
      if (fromDate && created < fromDate) return false;
      if (toDate && created > toDate) return false;
      return true;
    };

    const matchesStatus = (row) => {
      if (!status) return true;
      const s = String(row?.booking_status || "").toLowerCase();
      if (status === "completed") return s === "completed" || s === "finished";
      if (status === "pending") return s === "pending";
      if (status === "deleted")
        return !!row?.deleted_at || s === "cancelled" || s === "canceled";
      return true;
    };

    return list.filter(
      (row) => isWithinDateRange(row?.booking_created_at) && matchesStatus(row)
    );
  }, [data?.bookings, fromDate, toDate, status]);

  const totalPages =
    Math.ceil((filteredBookings.length || 0) / statesPerPage) || 1;
  const currentStates = useMemo(
    () =>
      filteredBookings.slice(
        (currentPage - 1) * statesPerPage,
        currentPage * statesPerPage
      ),
    [filteredBookings, currentPage]
  );

  const renderBookingStatus = (status) => {
    const normalized = String(status || "").toLowerCase();
    const commonClasses =
      "px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap";
    if (normalized === "cancelled" || normalized === "canceled") {
      return (
        <span className={`bg-red-100 text-red-700 ${commonClasses}`}>
          {t("cancelled")}
        </span>
      );
    }
    if (normalized === "completed" || normalized === "finished") {
      return (
        <span className={`bg-green-100 text-green-700 ${commonClasses}`}>
          {t("finished")}
        </span>
      );
    }
    if (normalized === "pending") {
      return (
        <span className={`bg-yellow-100 text-yellow-800 ${commonClasses}`}>
          {t("pending")}
        </span>
      );
    }
    return (
      <span className={`bg-gray-100 text-gray-700 ${commonClasses}`}>
        {t(normalized) || t("unknown")}
      </span>
    );
  };

  const renderPaymentStatus = (paymentStatus) => {
    const normalized = String(paymentStatus || "").toLowerCase();
    const commonClasses =
      "px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap";
    if (normalized === "paid") {
      return (
        <span className={`bg-green-100 text-green-700 ${commonClasses}`}>
          {t("paid") || "paid"}
        </span>
      );
    }
    if (normalized === "unpaid") {
      return (
        <span className={`bg-orange-100 text-orange-700 ${commonClasses}`}>
          {t("unpaid") || "unpaid"}
        </span>
      );
    }
    return (
      <span className={`bg-gray-100 text-gray-700 ${commonClasses}`}>
        {t(normalized) || t("unknown")}
      </span>
    );
  };

  const { mutate: CancelBooking } = useMutation({
    mutationFn: async (id) => {
      return cancelHospitalServiceBooking({ bookingId: id, token });
    },
    onSuccess: () => {
      toast.success(t("booking_deleted") || "Booking cancelled successfully");
      queryClient.invalidateQueries([
        "hospital-services-details",
        token,
        hospitalId,
      ]);
    },
    onError: () => {
      toast.error(t("error_occurred") || "An error occurred");
    },
  });

  const handleCancelBooking = (id) => {
    CancelBooking(id);
  };

  const handleCancelBookingConfirm = (bookingId) => {
    Swal.fire({
      title: t("are_you_sure") || "Are you sure?",
      text:
        t("cannotRestoreBookingAfterCancel") ||
        "You won't be able to restore this booking after canceling!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: t("cancel_booking") || "Cancel Booking",
      cancelButtonText: t("close") || "Close",
    }).then((result) => {
      if (result.isConfirmed) {
        handleCancelBooking(bookingId);
        Swal.fire({
          title: t("canceled") || "Cancelled!",
          text:
            t("bookingCanceledSuccessfully") ||
            "Booking cancelled successfully.",
          icon: "success",
          confirmButtonColor: "#3CAB8B",
        });
      }
    });
  };

  if (error) return <ErrorMessage message={error.message} />;

  return (
    <div className="p-4 sm:p-8 w-full mx-auto" dir={i18n.dir()}>
      <div className="bg-white min-h-screen p-4 rounded-2xl w-full overflow-x-auto ">
        <div className="flex flex-col sm:flex-row justify-between items-center my-4 gap-4">
          <h1 className="font-bold md:text-xl text-lg lg:text-2xl flex items-center gap-2 text-gray-800">
            {t("hospital_services_report")}{" "}
            {data?.hospital_name ? `- ${data.hospital_name}` : ""}
          </h1>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="w-full md:w-1/3">
            <label className="block mb-1 text-sm font-medium">
              {t("fromDate")}
            </label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => {
                setFromDate(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="w-full md:w-1/3">
            <label className="block mb-1 text-sm font-medium">
              {t("toDate")}
            </label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => {
                setToDate(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="w-full md:w-1/3">
            <label className="block mb-1 text-sm font-medium">
              {t("status")}
            </label>
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="">{t("showAll")}</option>
              <option value="completed">{t("finished")}</option>
              <option value="pending">{t("pending")}</option>
              <option value="deleted">{t("cancelled")}</option>
            </select>
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => {
              const rows = Array.isArray(filteredBookings)
                ? filteredBookings
                : [];
              if (!rows.length) return;
              try {
                const worksheet = utils.json_to_sheet(
                  rows.map((row) => ({
                    [t("slot_date")]: row.slot_date || t("Na"),
                    [t("slot_from")]: row.slot_from || t("Na"),
                    [t("slot_to")]: row.slot_to || t("Na"),
                    [t("booking_status")]: row.booking_status || t("Na"),
                    [t("payment_status")]: row.payment_status || t("Na"),
                    [t("total_price")]: row.total_price || t("Na"),
                    [t("tabi_commission")]: row.tabi_commission || t("Na"),
                    [t("hospital_commission")]:
                      row.hospital_commission || t("Na"),
                    [t("service_name")]: row.service_name || t("Na"),
                    [t("main_service_name")]: row.main_service_name || t("Na"),
                    [t("name")]: row.name || t("Na"),
                    [t("gender")]: row.gender || t("Na"),
                    [t("age")]: row.age || t("Na"),
                    [t("phone")]: row.phone || t("Na"),
                    [t("cancellation_reason")]:
                      row.cancellation_reason || t("Na"),
                  }))
                );
                const wb = utils.book_new();
                utils.book_append_sheet(wb, worksheet, "Hospital Services");
                writeFile(
                  wb,
                  `${data?.hospital_name || "Hospital"}_Services_Report.xlsx`
                );
              } catch (e) {
                // ignore if xlsx not available
              }
            }}
            disabled={!filteredBookings.length}
            className="px-6 h-10 flex items-center justify-center gap-2 bg-gradient-to-br from-[#33A9C7] to-[#3CAB8B] text-white rounded-lg hover:from-[#2A8AA7] hover:to-[#2F8B6B] focus:outline-none focus:ring-2 focus:ring-[#3CAB8B] transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label={t("Excel-Export")}
            type="button"
          >
            {t("Excel-Export")}
          </button>
          <button
            onClick={() => {
              setFromDate("");
              setToDate("");
              setStatus("");
              setCurrentPage(1);
            }}
            className="text-sm bg-gradient-to-bl from-[#33A9C7] to-[#3AAB95] px-4 py-2 text-white rounded-lg font-semibold"
          >
            {t("clearFilter")}
          </button>
        </div>

        <div className="w-full rounded-lg border border-gray-200 bg-white shadow-sm overflow-x-auto">
          <div className="min-w-full">
            <table
              style={{ direction: "ltr" }}
              className="min-w-[1200px] w-full bg-white text-sm"
            >
              <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                <tr>
                  {[
                    "cancellation_reason",
                    "slot_date",
                    "slot_from",
                    "slot_to",
                    "booking_status",
                    "payment_status",
                    "total_price",
                    "tabi_commission",
                    "hospital_commission",
                    "service_name",
                    "main_service_name",
                    "phone",
                    "gender",
                    "age",
                    "name",
                  ].map((key) => (
                    <th
                      key={key}
                      className="py-3 px-3 text-center transition-colors whitespace-nowrap"
                    >
                      {t(key)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm">
                {isLoading ? (
                  <tr>
                    <td colSpan={15} className="py-8 text-center">
                      <Loader />
                    </td>
                  </tr>
                ) : currentStates.length > 0 ? (
                  currentStates.map((row, index) => (
                    <tr
                      key={row.booking_id || index}
                      className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-3 px-3 text-center">
                        {String(row?.booking_status || "").toLowerCase() ===
                        "pending" ? (
                          <button
                            onClick={() =>
                              handleCancelBookingConfirm(row.booking_id)
                            }
                            className="px-4 py-2 flex items-center gap-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 transition-colors text-sm"
                          >
                            {t("cancel")}
                          </button>
                        ) : (
                          <div className="max-w-[240px] truncate">
                            {row?.cancellation_reason || "-"}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        {row.slot_date}
                      </td>
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        {row.slot_from}
                      </td>
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        {row.slot_to}
                      </td>
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        {renderBookingStatus(row.booking_status)}
                      </td>
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        {renderPaymentStatus(row.payment_status)}
                      </td>
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        {row.total_price}
                      </td>
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        {row.tabi_commission}
                      </td>
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        {row.hospital_commission}
                      </td>
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        {row.service_name}
                      </td>
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        {row.main_service_name}
                      </td>
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        {row.name}
                      </td>
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        {row.gender === "male"
                          ? t("male")
                          : row.gender === "female"
                          ? t("female")
                          : row.gender}
                      </td>
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        {row.age}
                      </td>
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        {row.phone}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={15} className="py-8 text-center text-gray-500">
                      {t("noData")}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {data?.bookings?.length > 1 && (
          <div className="flex justify-between items-end mt-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
            <p className="text-2xl text-gray-500 text-end">
              {t("Total")}: {data?.bookings?.length || 0}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HospitalServicesDetails;
