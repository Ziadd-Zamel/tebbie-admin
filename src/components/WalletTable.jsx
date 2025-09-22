import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { FaFileExcel } from "react-icons/fa";
import { utils, writeFile } from "xlsx";
import PropTypes from "prop-types";
import Loader from "../pages/Loader";
import { useQuery } from "@tanstack/react-query";
import { getHospitals } from "../utlis/https";
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Box,
  Button,
  Grid,
} from "@mui/material";

const WalletTable = ({
  currentStates,
  isLoading,
  walletData,
  onFilterChange,
  showTotal = false,
  totalLabel = "total_wallet",
}) => {
  const { t } = useTranslation();
  const token = localStorage.getItem("authToken");
  const [filters, setFilters] = useState({
    hospital_id: "",
    date_from: "",
    date_to: "",
  });

  const { data: hospitalsData } = useQuery({
    queryKey: ["hospitals"],
    queryFn: () => getHospitals({ token }),
  });

  const uniqueHospitals = useMemo(() => {
    if (!walletData?.data) return [];
    const hospitals = walletData.data
      .map((item) => item.hospital)
      .filter((hospital) => hospital && hospital.id && hospital.name);

    const unique = hospitals.filter(
      (hospital, index, self) =>
        index === self.findIndex((h) => h.id === hospital.id)
    );
    return unique;
  }, [walletData?.data]);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  const clearFilters = () => {
    const clearedFilters = {
      hospital_id: "",
      date_from: "",
      date_to: "",
    };
    setFilters(clearedFilters);
    if (onFilterChange) {
      onFilterChange(clearedFilters);
    }
  };

  const exportToExcel = () => {
    if (!walletData?.data?.length) return;

    const worksheet = utils.json_to_sheet(
      walletData.data.map((data) => ({
        [t("money")]: data?.money || t("Na"),
        [t("hospital_name")]: data?.hospital?.name || t("Na"),
        [t("model_type")]: data?.model_type || t("Na"),
        [t("date")]: data?.date || t("Na"),
      }))
    );

    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Wallet Data");
    writeFile(workbook, "Wallet_Data_Report.xlsx");
  };

  return (
    <div className="w-full">
      {/* Header with Export Button and Total */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={exportToExcel}
          disabled={!walletData?.data?.length}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FaFileExcel size={20} />
          {t("Excel-Export")}
        </button>
        <div className="flex gap-4 flex-col items-end">
          <h2 className="text-2xl font-bold text-gray-800">
            {t("wallet_data")}
          </h2>
          {showTotal && (
            <div className="text-right">
              <p className="text-xl font-bold text-green-600">
                {t(totalLabel)}: {walletData?.total || 0} د.ل
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Filters */}
      <Box
        sx={{
          direction: "rtl",
          bgcolor: "grey.50",
          p: 2,
          borderRadius: 2,
          mb: 2,
        }}
      >
        <Grid container spacing={2} alignItems="end">
          {/* Hospital Filter */}
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel id="hospital-filter-label">
                {t("filter_by_hospital")}
              </InputLabel>
              <Select
                labelId="hospital-filter-label"
                value={filters.hospital_id}
                label={t("filter_by_hospital")}
                onChange={(e) =>
                  handleFilterChange("hospital_id", e.target.value)
                }
                sx={{ direction: "rtl" }}
              >
                <MenuItem value="">
                  <em>{t("all_hospitals")}</em>
                </MenuItem>
                {(hospitalsData || uniqueHospitals)?.map((hospital) => (
                  <MenuItem key={hospital.id} value={hospital.id}>
                    {hospital.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Date From Filter */}
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              size="small"
              type="date"
              label={t("date_from")}
              value={filters.date_from}
              onChange={(e) => handleFilterChange("date_from", e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
              sx={{ direction: "rtl" }}
            />
          </Grid>

          {/* Date To Filter */}
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              size="small"
              type="date"
              label={t("date_to")}
              value={filters.date_to}
              onChange={(e) => handleFilterChange("date_to", e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
              sx={{ direction: "rtl" }}
            />
          </Grid>

          {/* Clear Filters Button */}
          <Grid item xs={12} md={3}>
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              onClick={clearFilters}
              size="small"
              sx={{ height: "40px" }}
            >
              {t("clear_filters")}
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Scrollable table container */}
      <div className="w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-scroll">
          <table dir="rtl" className="w-full overflow-x-scroll">
            <thead className="sticky top-0 z-10">
              <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-4 text-center whitespace-nowrap border-b border-gray-200 ">
                  {t("money")}
                </th>
                <th className="py-3 px-4 text-center whitespace-nowrap border-b border-gray-200">
                  {t("hospital_name")}
                </th>
                <th className="py-3 px-4 text-center whitespace-nowrap border-b border-gray-200 ">
                  {t("model_type")}
                </th>
                <th className="py-3 px-4 text-center whitespace-nowrap border-b border-gray-200">
                  {t("date")}
                </th>
              </tr>
            </thead>
            <tbody className="text-gray-600 md:text-lg text-md font-light">
              {isLoading ? (
                <tr>
                  <td colSpan="4" className="py-8 px-6 text-center">
                    <Loader />
                  </td>
                </tr>
              ) : currentStates?.length > 0 ? (
                currentStates.map((data, index) => (
                  <tr
                    key={data.id || index}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                        ${data?.money || 0}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div title={data?.hospital?.name}>
                        {data?.hospital_name || t("Na")}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div title={data?.model_type}>
                        {data?.model_type || t("Na")}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      {data?.date || t("Na")}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="py-8 px-6 text-center text-gray-500"
                  >
                    {t("noData")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

WalletTable.propTypes = {
  currentStates: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  walletData: PropTypes.object.isRequired,
  onFilterChange: PropTypes.func,
  showTotal: PropTypes.bool,
  totalLabel: PropTypes.string,
};

export default WalletTable;
