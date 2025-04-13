/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import {
  GoogleMap,
  InfoWindow,
  Marker,
  Autocomplete,
} from "@react-google-maps/api";
import { useTranslation } from "react-i18next";

const mapContainerStyle = {
  width: "100%",
  height: "50vh",
};

const HospitalMap = ({ marker, onMapClick, hospitalData }) => {
  const { t } = useTranslation();

  const [center, setCenter] = useState({
    lat: 32.8872,
    lng: 13.1913,
  });
  const [selectedMarker, setSelectedMarker] = useState(marker);
  const [showInfoWindow, setShowInfoWindow] = useState(false);
  const [autocomplete, setAutocomplete] = useState(null);

  useEffect(() => {
    if (hospitalData && hospitalData.lat && hospitalData.long) {
      const lat = parseFloat(hospitalData.lat);
      const lng = parseFloat(hospitalData.long);
      setCenter({ lat, lng });
      setSelectedMarker({ lat, lng });
      setShowInfoWindow(true);
    }
  }, [hospitalData]);

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      if (place.geometry) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const newPosition = { lat, lng };

        setCenter(newPosition);
        setSelectedMarker(newPosition);
        setShowInfoWindow(true);

        if (onMapClick) {
          onMapClick({ latLng: { lat: () => lat, lng: () => lng } });
        }
      } else {
        console.error("No geometry available for this place");
      }
    }
  };

  const handleMapClick = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setSelectedMarker({ lat, lng });
    setCenter({ lat, lng });
    if (onMapClick) {
      onMapClick(event);
    }
  };

  return (
    <div className="relative">
      <div className="absolute top-4 end-4 z-10 w-1/3">
        <Autocomplete
          onLoad={(auto) => setAutocomplete(auto)}
          onPlaceChanged={onPlaceChanged}
          restrictions={{ country: "LY" }}
        >
          <input
            type="text"
            placeholder={t("hospitalNameSearch")}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </Autocomplete>
      </div>

      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={13}
        onClick={handleMapClick}
      >
        {selectedMarker && (
          <Marker
            position={{ lat: selectedMarker.lat, lng: selectedMarker.lng }}
            onClick={() => setShowInfoWindow(true)}
          />
        )}

        {showInfoWindow && selectedMarker && (
          <InfoWindow
            position={{ lat: selectedMarker.lat, lng: selectedMarker.lng }}
            onCloseClick={() => setShowInfoWindow(false)}
          >
            <div>
              <h3 className="text-lg font-semibold">
                {hospitalData?.name || "Selected Location"}
              </h3>
              <p>
                {hospitalData?.address ||
                  `Lat: ${selectedMarker.lat.toFixed(
                    4
                  )}, Lng: ${selectedMarker.lng.toFixed(4)}`}
              </p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
};

export default HospitalMap;
