import { useState, useEffect } from "react";
import { GoogleMap, InfoWindow, Marker } from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100%",
  height: "50vh",
};

const HospitalMap = ({ marker, onMapClick, hospitalData }) => {
  const [center, setCenter] = useState({
    lat: 30.0131, 
    lng: 31.2089,
  });
  const [selectedMarker, setSelectedMarker] = useState(marker);
  const [showInfoWindow, setShowInfoWindow] = useState(false); 

  useEffect(() => {
    if (hospitalData && hospitalData.lat && hospitalData.long) {
      const lat = parseFloat(hospitalData.lat);
      const lng = parseFloat(hospitalData.long);

      setCenter({ lat, lng });
      setSelectedMarker({ lat, lng });
    }
  }, [hospitalData]);

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={center} 
      zoom={13}
      onClick={onMapClick}
    >
      {selectedMarker && (
        <Marker
          position={{ lat: selectedMarker.lat, lng: selectedMarker.lng }}
        />
      )}
         {showInfoWindow && (
          <InfoWindow
            position={center}
            onCloseClick={() => setShowInfoWindow(false)}
          >
            <div>
              <h3 className="text-lg font-semibold">{hospitalData.name}</h3>
              <p>{hospitalData.address}</p>
            </div>
          </InfoWindow>
        )}
    </GoogleMap>
  );
};

export default HospitalMap;
