import { LoadScript } from "@react-google-maps/api";

// eslint-disable-next-line react/prop-types
const GoogleMapsProvider = ({ children }) => {
  return (
    <LoadScript googleMapsApiKey="AIzaSyByGILjqDwyW9fMzjnXSCcPB11K8qboJEI">
      {children}
    </LoadScript>
  );
};

export default GoogleMapsProvider;
