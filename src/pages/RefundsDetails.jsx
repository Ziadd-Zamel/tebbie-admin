import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getRefundsDetails, postRefund } from "../utlis/https";
import Loader from "./Loader";
import ErrorMessage from "./ErrorMessage";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { FaCheck } from "react-icons/fa";
import Pagination from "../components/Pagination";
import { useParams } from "react-router-dom";

const RefundsDetails = () => {
  const token = localStorage.getItem("authToken");
  const { t, i18n } = useTranslation();
  const direction = i18n.language === "ar" ? "rtl" : "ltr";
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRefundId, setSelectedRefundId] = useState(null);
  const refundsPerPage = 10;
  const queryClient = useQueryClient();
  const { refundsId } = useParams();

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
    queryKey: ["refunds-details", token, debouncedSearchTerm ,refundsId],
    queryFn: () => getRefundsDetails({ token, doctorname: debouncedSearchTerm ,hospitalId:refundsId }),
  });

  const { mutate: handleAcceptRefund } = useMutation({
    mutationFn: ({ id }) => postRefund({ booking_id: id, token }),
    onError: (error, context) => {
      if (context?.previousCoupons) {
        queryClient.setQueryData(["refunds-details"], context.previousCoupons);
      }
      alert(`Failed to delete. Please try again ${error}`);
    },
    onSettled: () => {
      queryClient.invalidateQueries(["refunds-details"]);
    },
  });

  const handleOpenDialog = (id) => {
    setSelectedRefundId(id);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedRefundId(null);
  };

  const handleConfirmAccept = () => {
    if (selectedRefundId) {
      handleAcceptRefund({ id: selectedRefundId });
    }
    handleCloseDialog();
  };

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
      {/* Input for search */}
      <div className="my-10">
        <input
          type="text"
          name="name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={t("doctorNameSearch")}
          className="border border-gray-300 rounded-lg py-2 px-4 bg-white h-[50px] focus:outline-none focus:border-primary w-full lg:w-[494px]"
        />
      </div>
      {/* Table for refunds */}
      <div className="overflow-x-auto md:w-full w-[90vw] md:text-md text-sm">
        <table className="w-full bg-white shadow-md">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-4">#</th>
              <th className="p-4 whitespace-nowrap">{t("doctorName")}</th>
              <th className="p-4 whitespace-nowrap">{t("patientName")}</th>
              <th className="p-4 whitespace-nowrap">{t("hospital")}</th>
              <th className="p-4 whitespace-nowrap">{t("price")}</th>
              <th className="p-4 whitespace-nowrap">{t("date")}</th>
              <th className="p-4">{t("Actions")}</th>
            </tr>
          </thead>
          <tbody>
            {currentRefund.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center p-4">
                  {t("noData")}{" "}
                </td>
              </tr>
            ) : (
              currentRefund.map((refund) => (
                <tr key={refund.id} className="text-center border border-b">
                  <td className="p-4">{refund.id}</td>
                  <td className="p-4">{refund.doctor.name}</td>
                  <td className="p-4 whitespace-nowrap">{refund.user.name}</td>
                  <td className="p-4 whitespace-nowrap">
                    {refund.hospital.name}
                  </td>
                  <td className="p-4 whitespace-nowrap">{refund.price}</td>
                  <td className="p-4 whitespace-nowrap">{refund.date}</td>
                  <td className="p-4 flex justify-center items-center">
                    <div>
                      <button
                        onClick={() => handleOpenDialog(refund.id)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <FaCheck size={25} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="md"
        sx={{
          "& .MuiDialog-paper": {
            padding: "16px",
            borderRadius: "12px",
            boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.1)",
            width: "400px",
            maxWidth: "90vw",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: "bold",
            fontSize: "1.25rem",
            color: "#333",
          }}
        >
          {t("confirmAction")}
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            sx={{
              fontSize: "1rem",
              color: "#666",
              paddingBottom: "16px",
            }}
          >
            {t("confirmDelete")}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "flex-end", gap: 1 }}>
          <Button
            onClick={handleCloseDialog}
            color="secondary"
            variant="outlined"
            sx={{
              padding: "6px 16px",
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: "500",
            }}
          >
            {t("cancel")}
          </Button>
          <Button
            onClick={handleConfirmAccept}
            color="primary"
            variant="contained"
            sx={{
              padding: "6px 16px",
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: "500",
            }}
          >
            {t("confirm")}
          </Button>
        </DialogActions>
      </Dialog>
    </section>
  );
};

export default RefundsDetails;
