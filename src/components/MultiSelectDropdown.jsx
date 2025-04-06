/* eslint-disable react/prop-types */
import  { useState, useEffect } from "react";
import { MenuItem, Select, Checkbox, ListItemText } from "@mui/material";
import { useTranslation } from "react-i18next";

const MultiSelectDropdown = ({ doctors, selectedDoctors, handleDoctorChange ,translation }) => {
  const [selected, setSelected] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    if (selectedDoctors) {
      setSelected(selectedDoctors); 
    }
  }, [selectedDoctors]); 

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;

    const selectedIds = typeof value === "string" ? value.split(",") : value;
    setSelected(selectedIds);
    handleDoctorChange(selectedIds); 
  };

  return (
    <Select
      multiple
      value={selected} 
      onChange={handleChange}
      renderValue={(selected) =>
        selected
          .map((id) => doctors.find((doctor) => doctor.id === id)?.name)
          .join(", ")
      }
      className="border border-gray-300 rounded-lg py-2 px-4 bg-[#F7F8FA] h-[50px] focus:outline-none focus:border-primary w-full "
    >
      <MenuItem disabled value="">
        {t(`${translation}`)}
      </MenuItem>
      {doctors.map((doctor) => (
        <MenuItem key={doctor.id} value={doctor.id}>
          <Checkbox checked={selected.includes(doctor.id)} /> 
          <ListItemText primary={doctor.name} />
        </MenuItem>
      ))}
    </Select>
  );
};

export default MultiSelectDropdown;
