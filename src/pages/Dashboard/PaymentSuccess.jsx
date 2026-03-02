import React, { useEffect } from "react";
import { useSearchParams } from "react-router";
import useAxiosSecure from "./../../hooks/useAxiosSecure";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        if (sessionId) {
          const res = await axiosSecure.patch(
            `/payment-success?session_id=${sessionId}`,
          );
          console.log(res.data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    verifyPayment();
  }, [sessionId, axiosSecure]);

  return (
    <div className="text-center mt-10">
      <h2 className="text-4xl font-bold text-green-600">Payment Successful</h2>
      <p className="mt-4">Session ID: {sessionId}</p>
    </div>
  );
};

export default PaymentSuccess;
