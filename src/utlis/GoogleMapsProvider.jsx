import React from "react";
import { LoadScript } from "@react-google-maps/api";

const GoogleMapsProvider = ({ children }) => {
  return (
    <LoadScript googleMapsApiKey="AIzaSyByGILjqDwyW9fMzjnXSCcPB11K8qboJEI">
      {children}
    </LoadScript>
  );
};

export default GoogleMapsProvider;
