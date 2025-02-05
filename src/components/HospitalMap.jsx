import React, { useEffect, useState } from "react";
import { GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100%",
  height: "300px",
};

const HospitalMap = ({ hospital }) => {
  const [center, setCenter] = useState(null);
  const [showInfoWindow, setShowInfoWindow] = useState(false); 

  useEffect(() => {
    if (hospital && hospital.lat && hospital.long) {
      const lat = parseFloat(hospital.lat);
      const lng = parseFloat(hospital.long);
      setCenter({ lat, lng });
    }
  }, [hospital]);

  if (!center) {
    return <div>Loading map...</div>;
  }

  return (
    <div className="md:w-1/2 w-full">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={16}
      >
        <Marker
          position={center}
          onClick={() => setShowInfoWindow(true)} 
        />
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
