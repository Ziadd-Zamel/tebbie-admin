/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";
import { useTranslation } from "react-i18next";

const mapContainerStyle = {
  width: "100%",
  height: "300px",
};

const HospitalMap = ({ hospital }) => {
  const { t } = useTranslation();
  const [center, setCenter] = useState(null);
  const [showInfoWindow, setShowInfoWindow] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (hospital && hospital.lat && hospital.long) {
      const lat = parseFloat(hospital.lat);
      const lng = parseFloat(hospital.long);
      if (!isNaN(lat) && !isNaN(lng)) {
        setCenter({ lat, lng });
        setError(null);
      } else {
        setError(
          t("invalid_coordinates") || "Hospital coordinates are invalid."
        );
      }
    } else {
      setError(
        t("missing_coordinates") || "Hospital coordinates are not available."
      );
    }
  }, [hospital, t]);

  if (error) {
    return (
      <div className="px-4 w-full text-red-700 font-semibold h-[40vh] flex justify-center items-center">
        <p>{error}</p>
      </div>
    );
  }

  if (!center) {
    return (
      <div className="px-4 w-full">{t("loading_map") || "Loading map..."}</div>
    );
  }

  return (
    <div className="px-4 w-full">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={16}
      >
        <Marker position={center} onClick={() => setShowInfoWindow(true)} />
        {showInfoWindow && (
          <InfoWindow
            position={center}
            onCloseClick={() => setShowInfoWindow(false)}
          >
            <div>
              <h3 className="text-lg font-semibold">{hospital.name}</h3>
              <p>{hospital.address}</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
};

export default HospitalMap;
