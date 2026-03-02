import React from "react";
import { Link } from "react-router";

const PaymentCancel = () => {
  return (
    <div>
      <h2 className="text-4xl">Payment Cancelled</h2>
      <Link to="/dashboard/my-percels" className="btn btn-primary mt-5">
        Back to My Percels
      </Link>
    </div>
  );
};

export default PaymentCancel;
