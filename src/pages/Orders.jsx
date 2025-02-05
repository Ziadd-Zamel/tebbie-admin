import React, { useState } from "react";
import { arrowDown, headePhoneIcon, mouseIcon, profile } from "../assets";
import { Link } from "react-router-dom";

const Orders = () => {
  const [openOrder, setOpenOrder] = useState(null); // Track the open order

  const toggleOrder = (orderId) => {
    setOpenOrder(openOrder === orderId ? null : orderId); // Toggle the order accordion
  };
  const initialData = [
    {
      orderId: "ORD001",
      customer: {
        name: "محمد أحمد",
        image: profile,
        email: "mohamed.ahmed@example.com",
        phone: "01012345678",
      },
      status: "معلقة",
      paymentMethod: "نقدى",
      timeAndDate: "2024-09-02 14:30",
      items: [
        {
          id: 2,
          productID: "524789",
          name: "ماوس آبل",
          quantity: "2 قطع",
          image: mouseIcon,
          price: 1000,
        },
      ],
      totalPrice: 1000,
      address: "123 شارع المثال، القاهرة، مصر",
      requestOrder: {
        status: "اتمام الطلب",
        result: "تم الطلب",
        date: "10-03-2024, 04:36 ص",
      },
      bill: {
        status: "تجهيز الطلب",
        result: "تم تجهيز الطلب",
        date: "10-03-2024",
      },
      shipping: {
        status: "قيد الشحن",
        date: "2024-09-03",
      },
    },
    {
      orderId: "ORD002",
      customer: {
        name: "أحمد علي",
        image: profile,
        email: "ahmed.ali@example.com",
        phone: "01098765432",
      },
      status: "قيد التنفيذ",
      paymentMethod: "نقدى",
      timeAndDate: "2024-09-03 10:15",
      items: [
        {
          id: 4,
          productID: "524789",
          name: "ماوس آبل",
          quantity: "1 قطع",
          image: mouseIcon,
          price: 1000,
        },
      ],
      totalPrice: 1000,
      address: "456 شارع المثال، القاهرة، مصر",
      requestOrder: {
        status: "اتمام الطلب",
        result: "تم الطلب",
        date: "11-03-2024, 09:00 ص",
      },
      bill: {
        status: "تجهيز الطلب",
        result: "تم تجهيز الطلب",
        date: "11-03-2024",
      },
      shipping: {
        status: "قيد الشحن",
        date: "2024-09-04",
      },
    },
    {
      orderId: "ORD003",
      customer: {
        name: "علي سعيد",
        image: profile,
        email: "ali.saeed@example.com",
        phone: "01234567890",
      },
      status: "تم التنفيذ",
      paymentMethod: "نقدى",
      timeAndDate: "2024-09-04 16:45",
      items: [
        {
          id: 5,
          productID: "302014",
          name: "سماعة رأس",
          quantity: "2 قطع",
          image: headePhoneIcon,
          price: 379,
        },
      ],
      totalPrice: 758,
      address: "789 شارع المثال، القاهرة، مصر",
      requestOrder: {
        status: "اتمام الطلب",
        result: "تم الطلب",
        date: "12-03-2024, 11:30 ص",
      },
      bill: {
        status: "تجهيز الطلب",
        result: "تم تجهيز الطلب",
        date: "12-03-2024",
      },
      shipping: {
        status: "قيد الشحن",
        date: "2024-09-05",
      },
    },
    {
      orderId: "ORD004",
      customer: {
        name: "خالد مصطفى",
        image: profile,
        email: "khaled.mostafa@example.com",
        phone: "01122334455",
      },
      status: "ملغية",
      paymentMethod: "نقدى",
      timeAndDate: "2024-09-05 08:20",
      items: [
        {
          id: 6,
          productID: "524789",
          name: "ماوس آبل",
          quantity: "اخر قطعة",
          image: mouseIcon,
          price: 1000,
        },
      ],
      totalPrice: 1000,
      address: "101 شارع المثال، القاهرة، مصر",
      requestOrder: {
        status: "اتمام الطلب",
        result: "تم الطلب",
        date: "13-03-2024, 07:45 ص",
      },
      bill: {
        status: "تجهيز الطلب",
        result: "تم تجهيز الطلب",
        date: "13-03-2024",
      },
      shipping: {
        status: "ملغى",
        date: "2024-09-06",
      },
    },
    {
      orderId: "ORD005",
      customer: {
        name: "عبدالله سمير",
        image: profile,
        email: "abdullah.samir@example.com",
        phone: "01111223344",
      },
      status: "مرتجع",
      paymentMethod: "نقدى",
      timeAndDate: "2024-09-06 12:00",
      items: [
        {
          id: 7,
          productID: "302014",
          name: "سماعة رأس",
          quantity: "1 قطع",
          image: headePhoneIcon,
          price: 379,
        },
        {
          id: 8,
          productID: "5547849",
          name: "ماوس آبل",
          quantity: "اخر قطعة",
          image: mouseIcon,
          price: 1000,
        },
      ],
      totalPrice: 1379,
      address: "202 شارع المثال، القاهرة، مصر",
      requestOrder: {
        status: "اتمام الطلب",
        result: "تم الطلب",
        date: "14-03-2024, 02:00 م",
      },
      bill: {
        status: "تجهيز الطلب",
        result: "تم تجهيز الطلب",
        date: "14-03-2024",
      },
      shipping: {
        status: "مرتجع",
        date: "2024-09-07",
      },
    },
  ];
  
  return (
    <>
      <section dir="rtl" className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-3xl h-full p-8  w-full">
          <div className="bg-[#F9FAFB] w-full border-[#E9EBF8] border-[1px] rounded-lg">
            <div className="flex items-center justify-between md:p-10 p-5">
              <h1 className="text-2xl font-bold">طلبات المتجر </h1>
              <select className="px-8 py-4 rounded-lg w-auto border-[1px] border-[#787486]">
                <option value="">تصنيف حسب</option>
                <option value="available">متوفر</option>
                <option value="not-available">غير متوفر</option>
                <option value="highest-price">الأعلى سعراً</option>
                <option value="lowest-price">الأقل سعراً</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 py-10">
            {initialData.map((order) => (
              <div
                key={order.orderId}
                className={`bg-white p-4 rounded-lg border-[1px] border-[#E9EBF8] overflow-hidden transition-all duration-500  ${
                  openOrder === order.orderId ? "h-auto" : "h-[90px]"
                }`}
              >
                <div className="flex justify-between items-center">
                  <Link className="flex gap-4 items-center">
                    <img
                      alt={order.customer.name}
                      className="bg-cover w-14"
                      src={order.customer.image}
                    />
                    <h3 className="text-xl font-bold">{order.customer.name}</h3>
                  </Link>
                  <div className="flex items-center gap-4">
                    <span>{order.status}</span>
                    <button onClick={() => toggleOrder(order.orderId)}>
                      <img
                        alt="arrow"
                        src={arrowDown}
                        className={`transform transition-transform duration-500 ${
                          openOrder === order.orderId ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  </div>
                </div>
                {openOrder === order.orderId && (
                  <div className="pt-4">
                    <ul className="mt-2">
                      <li className="space-y-5 text-lg">
                        <div className="flex justify-between">
                          <span>رقم الطلب</span>
                          <span className="font-semibold"> {order.orderId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>الوقت و التاريخ</span>
                          <span className="font-semibold"> {order.timeAndDate}</span>
                        </div>
                        <div className="w-full h-[1px] bg-black"></div>
                        <div className="flex justify-between">
                          <span>طريقة الدفع</span>
                          <span className="font-semibold"> {order.paymentMethod}</span>
                        </div>
                        <div className="flex justify-between">
                          <span> السعر</span>
                          <span className="font-semibold"> {order.totalPrice} جم</span>
                        </div>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Orders;
