import { useState } from "react";
import {
  BillIcon,
  cash,
  Controller,
  dateandtime,
  emailIcon,
  headePhoneIcon,
  mobileIcon,
  mouseIcon,
  payment,
  profileIcon,
} from "../assets";
import CustomModal from "../components/CustomModal";
import { useTranslation } from "react-i18next";

const OrderDetails = () => {
  const { i18n, t } = useTranslation();
  const circles = [
    { number: 1, selected: false },
    { number: 2, selected: true },
    { number: 3, selected: false },
    { number: 4, selected: false },
    { number: 5, selected: true },
    { number: 6, selected: false },
    { number: 7, selected: false },
    { number: 8, selected: true },
  ];

  const initialData = [
    {
      id: 1,
      ProductID: "302014",
      name: "سماعة رأس",
      quantity: "1 قطع",
      image: headePhoneIcon,
      price: 379,
      total: 379,
    },
    {
      id: 2,
      ProductID: "524789",
      name: "ماوس آبل",
      quantity: "2 قطع",
      image: mouseIcon,
      price: 1000,
      total: 379,
    },
    {
      id: 3,
      ProductID: "524789",
      name: "ماوس آبل",
      quantity: "اخر قطعة",
      image: headePhoneIcon,
      price: 500,
      total: 1000,
    },
  ];
  const direction = i18n.language === "ar" ? "rtl" : "ltr";
  const textAlignment = direction === "rtl" ? "text-right" : "text-left";
  const marginLeftRight = direction === "rtl" ? "ml-4" : "mr-4";

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <section dir={direction} className="container mx-auto px-4 ">
        <div dir="rtl" className="w-full py-8">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-8 ">
            <div className="col-span-1 md:col-span-2 bg-white  rounded-[20px] shadow-sm p-6">
              <h1 className="text-2xl font-bold py-2">{t("request")} #0123456 </h1>
              <div className="w-full h-[1px] bg-[#E8EAED] my-6"></div>

              <div className="flex justify-between">
                <div className="flex gap-6">
                  <div className="rounded-full py-4 px-4  flex justify-center bg-[#E6F6F5]">
                    <img
                      alt="celenderIcon"
                      className="bg-cover"
                      src={dateandtime}
                    />
                  </div>
                  <h3 className="text-[#737791] flex justify-center items-center text-xl ">
                    الوقت والتاريخ
                  </h3>
                </div>
                <h3 className="flex justify-center items-center  text-xl">
                  10-3-2024 04:36 ص
                </h3>
              </div>

              <div className="flex justify-between py-6">
                <div className="flex gap-6">
                  <div className="rounded-full py-4 px-4  flex justify-center bg-[#E6F6F5]">
                    <img alt="paymentIcon" className="bg-cover" src={payment} />
                  </div>
                  <h3 className="text-[#737791] flex justify-center items-center text-xl ">
                    طريقة الدفع
                  </h3>
                </div>
                <h3 className="flex justify-center items-center  text-xl">
                  نقدي
                </h3>
              </div>

              <div className="flex justify-between">
                <div className="flex gap-6">
                  <div className="rounded-full py-5 px-4  flex justify-center bg-[#E6F6F5]">
                    <img alt="cashIcon" className="bg-cover" src={cash} />
                  </div>
                  <h3 className="text-[#737791] flex justify-center items-center text-xl ">
                    المبلغ
                  </h3>
                </div>
                <h3 className="flex justify-center items-center text-xl">
                  1379 جم
                </h3>
              </div>
            </div>

            <div className="col-span-1 md:col-span-2 bg-white  rounded-[20px] shadow-sm p-6">
              <h1 className="text-2xl font-bold py-2"> {t("CustomerData")}</h1>
              <div className="w-full h-[1px] bg-[#E8EAED] my-6"></div>

              <div className="flex justify-between">
                <div className="flex gap-6">
                  <div className="rounded-full py-4 px-4  flex justify-center bg-[#E6F6F5]">
                    <img
                      alt="profileIcon"
                      className="bg-cover"
                      src={profileIcon}
                    />
                  </div>
                  <h3 className="text-[#737791] flex justify-center items-center text-xl ">
                   {t("name")}
                  </h3>
                </div>
                <h3 className="flex justify-center items-center  text-xl">
                  احمد على
                </h3>
              </div>

              <div className="flex justify-between py-6">
                <div className="flex gap-6">
                  <div className="rounded-full py-4 px-4  flex justify-center bg-[#E6F6F5]">
                    <img alt="emailIcon" className="bg-cover" src={emailIcon} />
                  </div>
                  <h3 className="text-[#737791] flex justify-center items-center text-xl ">
                   {t("email")}
                  </h3>
                </div>
                <h3 className="flex justify-center items-center  text-xl">
                  Ahmed@example.com
                </h3>
              </div>

              <div className="flex justify-between">
                <div className="flex gap-6">
                  <div className="rounded-full py-5 px-4  flex justify-center bg-[#E6F6F5]">
                    <img
                      alt="mobileIcon"
                      className="bg-cover w-6"
                      src={mobileIcon}
                    />
                  </div>
                  <h3 className="text-[#737791] flex justify-center items-center text-xl ">
                   {t("phone")}
                  </h3>
                </div>
                <h3 className="flex justify-center items-center text-xl">
                  0123456789
                </h3>
              </div>
            </div>

            <div className="col-span-1 md:col-span-2 bg-white  rounded-[20px] shadow-sm p-6">
              <h1 className="text-2xl font-bold py-2">{t("Documents")}</h1>
              <div className="w-full h-[1px] bg-[#E8EAED] my-6"></div>

              <div className="flex justify-between">
                <div className="flex gap-6">
                  <div className="rounded-full py-4 px-4  flex justify-center bg-[#E6F6F5]">
                    <img alt="BillIcon" className="bg-cover" src={BillIcon} />
                  </div>
                  <h3 className="text-[#737791] flex justify-center items-center text-xl ">
                    الفاتورة
                  </h3>
                </div>
                <h3 className="flex justify-center items-center  text-xl">
                  GWD-5587
                </h3>
              </div>

              <div className="flex justify-between py-6">
                <div className="flex gap-6">
                  <div className="rounded-full py-4 px-4  flex justify-center bg-[#E6F6F5]">
                    <img alt="BillIcon" className="bg-cover" src={BillIcon} />
                  </div>
                  <h3 className="text-[#737791] flex justify-center items-center text-xl ">
                    الشحن
                  </h3>
                </div>
                <h3 className="flex justify-center items-center  text-xl">
                  SHP-2011YTE
                </h3>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mt-6 ">
            <div className="col-span-1 md:col-span-4 bg-white p-6 rounded-[20px] shadow-sm ">
              <h1 className="text-2xl font-bold p-4"> {t("OrderDetails")} </h1>
              <table className="w-full border-collapse border text-xl almarai-normal  border-transparent">
                <thead className="bg-[#E6F6F5] h-[60px] rounded-xl ">
                  <tr>
                    <th className="border-b py-2 px-4 text-start"> {t("Product")}</th>
                    <th className="border-b py-2 px-4 text-center">
                      الرقم التعريفي للمنتج
                    </th>
                    <th className="border-b py-2 px-4 text-center">{t("amount")}</th>
                    <th className="border-b py-2 px-4 text-center">{t("salary")}</th>
                    <th className="border-b py-2 px-4 text-center">{t("total")}</th>
                  </tr>
                </thead>
                <tbody className="text-[#737791]">
                  {initialData.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-4">
                        لا توجد بيانات
                      </td>
                    </tr>
                  ) : (
                    initialData.map((row) => (
                      <tr key={row.id}>
                        <td className="border border-transparent py-4 text-start flex items-center  mx-5">
                          <button
                            className="flex items-center gap-4  "
                            onClick={handleOpenModal}
                          >
                            <img
                              src={row.image}
                              alt={row.name}
                              className="w-16 h-16 bg-cover transition-transform transform-gpu duration-300 ease-in-out rounded-full hover:scale-110 hover:shadow-lg delay-75"
                            />
                            <p> {row.name}</p>
                          </button>
                        </td>
                        <td className="border border-transparent py-4 px-4 text-center">
                          {row.ProductID}
                        </td>
                        <td className="border border-transparent py-4 px-4 text-center">
                          {row.quantity}
                        </td>
                        <td className="border border-transparent py-4 px-4 text-center">
                          {row.price}
                        </td>
                        <td className="border border-transparent py-4 px-4 text-center">
                          {row.total}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="col-span-1 md:col-span-2 space-y-6 ">
              <div className="bg-white  rounded-[20px] shadow-sm flex flex-col justify-center h-[160px]  p-6">
                <h1 className="text-2xl font-bold py-6 ">{t("address")} </h1>
                <div className="flex gap-6">
                  <div className="rounded-full w-14 h-14 flex justify-center items-center bg-[#E6F6F5]">
                    <img alt="addressIcon" className="w-7 h-7" src={BillIcon} />
                  </div>

                  <h3 className="text-black flex justify-center items-center text-xl ">
                    عباس العقاد - مدينة نصر
                  </h3>
                </div>
              </div>
              <div className="bg-white p-8 rounded-[20px] shadow-sm">
                <h1 className="text-2xl font-bold py-6">{t("OrderStatus")} </h1>
                <div className="w-full h-[1px] bg-[#E8EAED] my-6"></div>

                <div>
                  <div className="flex gap-6 items-start relative">
                    <div className="relative flex flex-col items-center">
                      <div className="rounded-full w-14 h-14 flex justify-center items-center bg-[#E6F6F5]">
                        <img
                          alt="addressIcon"
                          className="w-7 h-7"
                          src={BillIcon}
                        />
                      </div>
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 h-24 border-l-2 border-dashed border-gray-300"></div>
                    </div>

                    <div className="text-start">
                      <h3 className="text-black text-xl py-3">اتمام الطلب</h3>
                      <h3 className="text-[#737791] text-xl">تم الطلب</h3>
                      <h3 className="text-[#737791] text-xl">
                        10-03-2024, 04:36 ص
                      </h3>
                    </div>
                  </div>

                  <div className="py-8 flex gap-6 items-start">
                    <div className="relative flex flex-col items-center">
                      <div className="rounded-full w-14 h-14 flex justify-center items-center bg-[#E6F6F5]">
                        <img
                          alt="addressIcon"
                          className="w-7 h-7"
                          src={BillIcon}
                        />
                      </div>
                    </div>

                    <div className="text-start">
                      <h3 className="text-black text-xl py-3">اتمام الطلب</h3>
                      <h3 className="text-[#737791] text-xl">تم الطلب</h3>
                      <h3 className="text-[#737791] text-xl">
                        10-03-2024, 04:36 ص
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <CustomModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            title="customerOrder"
          >
            <div className="flex flex-col container m-auto">
              <div className="flex justify-between items-start p-6 mb-6">
                <div className="grid grid-cols-2 gap-8">
                  {circles.map((circle) => (
                    <div
                      key={circle.number}
                      className="flex gap-2 justify-center items-center"
                    >
                      <div
                        className={`relative bg-white w-5 h-5 rounded-full flex items-center justify-center border-[4px] ${
                          circle.selected
                            ? "border-primary"
                            : "border-[#D9D9D9]"
                        }`}
                      ></div>
                      <p className="font-bold">{circle.number}</p>
                    </div>
                  ))}
                </div>
                <img className="w-56" alt="Controller" src={Controller} />
              </div>
              <div className="mt-auto bg-[#F5F5F7] p-6 font-bold rounded-xl">
                <p className="leading-relaxed text-lg">
                  هنالك العديد من الأنواع المتوفرة لنصوص لوريم إيبسوم، ولكن
                  الغالبية تم تعديلها بشكل ما عبر إدخال بعض النوادر أو الكلمات
                  العشوائية إلى النص. إن كنت تريد أن تستخدم نص لوريم إيبسوم ما،
                  عليك أن تتحقق أولاً أن ليس هناك أي كلمات أو عبارات محرجة أو
                  غير لائقة مخبأة في هذا النص. هنالك العديد من الأنواع المتوفرة
                  لنصوص
                </p>
              </div>
            </div>
          </CustomModal>
        </div>
      </section>
    </>
  );
};

export default OrderDetails;
