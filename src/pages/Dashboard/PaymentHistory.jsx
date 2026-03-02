import React from "react";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";

const PaymentHistory = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    data: payments = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["payments", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/payments?email=${user.email}`);
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="text-center mt-10 text-xl">
        Loading Payment History...
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">Payment History</h2>

      {payments.length === 0 ? (
        <div className="text-gray-500">No payment history found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full border">
            <thead className="bg-base-300">
              <tr>
                <th>#</th>
                <th>Parcel ID</th>
                <th>Transaction ID</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {payments.map((payment, index) => (
                <tr key={payment._id}>
                  <td>{index + 1}</td>

                  <td className="text-sm">{payment.percelId}</td>

                  <td className="text-sm">{payment.transactionId}</td>

                  <td>
                    {payment.amount} {payment.currency?.toUpperCase()}
                  </td>

                  <td>
                    <span
                      className={`badge ${
                        payment.paymentStatus === "paid"
                          ? "badge-success"
                          : "badge-error"
                      }`}
                    >
                      {payment.paymentStatus}
                    </span>
                  </td>

                  <td>{new Date(payment.paidAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;
