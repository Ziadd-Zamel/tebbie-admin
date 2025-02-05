import { useTranslation } from "react-i18next";
import { tebbieLoader } from "../assets";

const Loader = () => {
  const { t } = useTranslation();

  return (
    <div className="h-full w-full flex justify-center items-center">
      <img alt="loader" className="w-96" src={tebbieLoader} />
    </div>
  );
};

export default Loader;
