import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useParams } from "react-router";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const Payment = () => {
  const { percelId } = useParams();
  const axiosSecure = useAxiosSecure();

  const { data: percel, isLoading } = useQuery({
    queryKey: ["percels", percelId],
    queryFn: async () => {
      const res = await axiosSecure.get(`/percels/${percelId}`);
      return res.data;
    },
  });

  const handlePayment = async () => {
    try {
      const paymentData = {
        cost: percel.cost,
        percelName: percel.percelName,
        percelId: percel._id,
        senderEmail: percel.senderEmail,
      };

      const res = await axiosSecure.post("/payment", paymentData);

      // Redirect to Stripe Checkout page
      if (res.data.url) {
        window.location.href = res.data.url;
      }
    } catch (error) {
      console.error("Payment failed:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center mt-10">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="text-center mt-10">
      <h2 className="text-xl font-bold">
        Please pay ${percel.cost} USD for {percel.percelName}
      </h2>

      <button
        onClick={handlePayment}
        className="btn btn-primary text-black mt-5"
      >
        Pay Now
      </button>
    </div>
  );
};

export default Payment;
