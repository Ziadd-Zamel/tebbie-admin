import React, { useRef, useState } from "react";
import { uploadImage } from "../assets";

const AddCategory = () => {
  const [Image, setImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  return (
    <section
      dir="rtl"
      className="container flex justify-center  mx-auto px-4 h-full py-8"
    >
      <div className="bg-white rounded-3xl md:p-8 p-0 w-full">
        <form>
          <div className="grid grid-cols-1 md:grid-cols-12 lg:gap-6 gap-0 mt-6">
            <div className="md:col-span-8 p-4 lg:px-10">
              <div className="mb-6">
                <div className="px-3 mb-6 md:mb-12">
                  <label
                    className="block text-md almarai-bold mb-4"
                    htmlFor="grid-first-name"
                  >
                    اسم الفئة
                  </label>
                  <input
                    type="text"
                    placeholder="اسم الفئة"
                    className="border border-gray-100 rounded-xl py-2 px-4 bg-[#F7F8FA] h-[50px] focus:outline-none focus:border-primary w-full"
                  />
                </div>
              </div>

              <div className="mb-6">
                <div className=" px-3 mb-6 md:mb-12">
                  <label
                    className="block text-md almarai-semibold mb-4"
                    htmlFor="grid-first-name"
                  >
                    Tags
                  </label>
                  <input
                    type="text"
                    placeholder="اسم المنتج"
                    className="border border-gray-100 rounded-xl py-2 px-4 bg-[#F7F8FA] h-[50px] focus:outline-none focus:border-primary w-full"
                  />
                </div>
              </div>

              <div className="mb-6">
                <div className=" px-3 mb-6 md:mb-12">
                  <label
                    className="block text-md almarai-semibold mb-4"
                    htmlFor="grid-first-name"
                  >
                    الحالة
                  </label>
                  <input
                    type="text"
                    placeholder="الحالة"
                    className="border border-gray-100 rounded-xl py-2 px-4 bg-[#F7F8FA] h-[50px] focus:outline-none focus:border-primary w-full"
                  />
                </div>
              </div>
            </div>
            <div className="col-span-4 p-4">
              <span
                onClick={handleImageClick}
                className="flex flex-col items-start mb-7 cursor-pointer"
              >
                <label className="almarai-bold mb-4" htmlFor="input">
                  صورة الفئة
                </label>
                {!Image && (
                  <img src={uploadImage} alt="Example Image" className="mb-4" />
                )}
                {Image && (
                  <img
                    src={URL.createObjectURL(Image)}
                    alt="Selected category"
                    className="w-full h-auto border-primary border-2"
                  />
                )}
                <input
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  type="file"
                  id="category-image"
                  accept="image/*"
                  className="hidden"
                />
              </span>
              <button className="mt-6 bg-[#FFB948] py-4  hover:bg-[#e4bf84]  w-full px-4 text-white rounded-lg">
                حفظ
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default AddCategory;
