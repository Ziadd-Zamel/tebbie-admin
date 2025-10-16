/* eslint-disable react/prop-types */
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaEye, FaEyeSlash, FaStar } from "react-icons/fa";
import Loader from "../../pages/Loader";

const ReviewsReportTable = ({ currentStates, isLoading }) => {
  const [expanded, setExpanded] = useState(null);
  const { t } = useTranslation();

  const toggleExpand = (id) => {
    setExpanded(expanded === id ? null : id);
  };

  const renderStars = (rating) => {
    const numRating = parseFloat(rating);
    const fullStars = Math.floor(numRating);
    return (
      <div className="flex items-center justify-center gap-2">
        {[...Array(5)].map((_, index) => (
          <FaStar
            key={index}
            size={16}
            className={index < fullStars ? "text-yellow-400" : "text-gray-300"}
          />
        ))}
        <span className=" text-sm text-gray-600">({rating})</span>
      </div>
    );
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  const getTypeLabel = (reviewableType) => {
    switch (reviewableType) {
      case "App\\Models\\Hospital":
        return t("hospital");
      case "App\\Models\\Doctor":
        return t("doctor");
      case "App\\Models\\HomeVisit":
        return t("homevisit");
      default:
        return reviewableType;
    }
  };

  return (
    <div className="overflow-x-auto md:w-full w-[90vw]">
      <table className="bg-white border border-gray-200 rounded-lg w-full border-spacing-0">
        <thead>
          <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-center">{t("user_name")}</th>
            <th className="py-3 px-6 text-center">{t("total_reviews")}</th>
            <th className="py-3 px-6 text-center">{t("avg_rating")}</th>
            <th className="py-3 px-6 text-center">{t("reviews")}</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 md:text-lg text-md font-light">
          {isLoading ? (
            <tr>
              <td colSpan="4" className="py-4 px-6 text-center">
                <Loader />
              </td>
            </tr>
          ) : currentStates.length > 0 ? (
            currentStates.map((Review, index) => (
              <>
                <tr
                  key={index}
                  className="border-b border-gray-200 hover:bg-gray-100"
                >
                  <td className="py-2 px-6 text-center">{Review.user_name}</td>
                  <td className="py-2 px-6 text-center">
                    {Review.total_reviews}
                  </td>
                  <td className="py-2 px-6 text-center">
                    {renderStars(Review.avg_rating)}
                  </td>
                  <td className="py-2 px-6 text-center">
                    {Review.reviews.length > 0 && (
                      <button
                        onClick={() => toggleExpand(Review.user_id)}
                        className="text-[#3CAB8B] hover:text-[#4db799]"
                        aria-label={
                          expanded === Review.user_id
                            ? t("hideReviews")
                            : t("showReviews")
                        }
                      >
                        {expanded === Review.user_id ? (
                          <FaEyeSlash size={20} />
                        ) : (
                          <FaEye size={20} />
                        )}
                      </button>
                    )}
                  </td>
                </tr>
                {expanded === Review.user_id && Review.reviews.length > 0 && (
                  <tr>
                    <td colSpan="4" className="py-4 px-6 bg-gray-50">
                      {(() => {
                        const grouped = Review.reviews.reduce((acc, rev) => {
                          const key = rev.reviewable_type || "Unknown";
                          if (!acc[key]) acc[key] = [];
                          acc[key].push(rev);
                          return acc;
                        }, {});

                        const typesOrder = [
                          "App\\Models\\Hospital",
                          "App\\Models\\Doctor",
                          "App\\Models\\HomeVisit",
                        ];

                        const orderedEntries = Object.entries(grouped).sort(
                          ([a], [b]) =>
                            (typesOrder.indexOf(a) === -1
                              ? 999
                              : typesOrder.indexOf(a)) -
                            (typesOrder.indexOf(b) === -1
                              ? 999
                              : typesOrder.indexOf(b))
                        );

                        return (
                          <div className="space-y-8">
                            {orderedEntries.map(([type, reviews]) => (
                              <div key={type} className="space-y-4">
                                <div className="flex items-center justify-between">
                                  <h3 className="text-xl font-bold text-gray-800">
                                    {getTypeLabel(type)}
                                  </h3>
                                  <span className="text-sm text-gray-500">
                                    {reviews.length}
                                  </span>
                                </div>

                                {reviews.map((review, index) => (
                                  <div
                                    key={`${type}-${index}`}
                                    className="flex flex-col p-4 bg-white border border-gray-200 rounded-lg shadow-sm font-semibold"
                                  >
                                    <div className="flex items-center justify-end">
                                      <span className="text-sm bg-gradient-to-bl from-[#33A9C7] to-[#3AAB95] p-2 text-white rounded-xl font-semibold">
                                        {formatDateTime(review.created_at)}
                                      </span>
                                    </div>

                                    <h2 className="mt-2 text-gray-700 text-2xl font-semibold my-2">
                                      {t("user_name")} : {Review.user_name}
                                    </h2>

                                    <div className="flex items-center justify-between my-2">
                                      <div className="flex items-center gap-2">
                                        {renderStars(review.rating)}
                                      </div>
                                    </div>
                                    <p className="mt-2 text-gray-700">
                                      {review.comment}
                                    </p>
                                    {review.name && (
                                      <p className="mt-1 text-sm text-gray-600">
                                        - {review.name}
                                      </p>
                                    )}
                                  </div>
                                ))}
                              </div>
                            ))}
                          </div>
                        );
                      })()}
                    </td>
                  </tr>
                )}
              </>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="py-4 px-6 text-center text-gray-500">
                {t("noData")}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ReviewsReportTable;
