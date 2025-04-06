import { Outlet } from "react-router-dom";
import GoogleMapsProvider from "../utlis/GoogleMapsProvider";

const HospitalLayout = () => {
  return (
    <main>
      <GoogleMapsProvider>
        <Outlet />
      </GoogleMapsProvider>
    </main>
  );
};

export default HospitalLayout;
