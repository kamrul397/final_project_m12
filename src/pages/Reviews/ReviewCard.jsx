import React from "react";
import { FaQuoteLeft } from "react-icons/fa";

const ReviewCard = ({ review }) => {
  return (
    <div className="card bg-base-100 shadow-md rounded-2xl p-6 max-w-md">
      {/* Quote Icon */}
      <FaQuoteLeft className="text-teal-200 text-3xl mb-4" />

      {/* Text */}
      <p className="text-gray-600 leading-relaxed mb-6">{review.review}</p>

      {/* Divider */}
      <div className="border-t border-dashed border-gray-300 my-4"></div>

      {/* User Info */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-teal-900">
          <img src={review.user_photoURL} alt="" />
        </div>

        <div>
          <h4 className="font-semibold text-gray-800">{review.user}</h4>
          <p className="text-sm text-gray-500">Senior Product Designer</p>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
