import { useQuery } from "@tanstack/react-query";
import React from "react";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { FiEdit } from "react-icons/fi";
import { FaMagnifyingGlass, FaTrash } from "react-icons/fa6";
import Swal from "sweetalert2";
import { Link } from "react-router";

const MyPercels = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    data: percels = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["myPercels", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/percels?email=${user?.email}`);
      return res.data;
    },
  });

  const handlePercelDelete = (percelId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.delete(`/percels/${percelId}`).then((res) => {
          if (res.data.deletedCount > 0) {
            Swal.fire("Deleted!", "Parcel deleted successfully.", "success");
            refetch();
          }
        });
      }
    });
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2>All of my parcels {percels.length}</h2>

      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Parcel Name</th>
              <th>Type</th>
              <th>Weight</th>
              <th>Receiver</th>
              <th>District</th>
              <th>Phone</th>
              <th>Cost</th>
              <th>Created At</th>
              <th>Payment Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {percels.map((percel, index) => (
              <tr key={percel._id}>
                <th>{index + 1}</th>
                <td>{percel.percelName}</td>
                <td>{percel.percelType}</td>
                <td>{percel.percelWeight} kg</td>
                <td>{percel.receiverName}</td>
                <td>{percel.receiverDistrict}</td>
                <td>{percel.receiverPhoneNumber}</td>
                <td>{percel.cost} ৳</td>

                <td>
                  {percel.createdAt
                    ? new Date(percel.createdAt).toLocaleString()
                    : "N/A"}
                </td>

                {/* ✅ FIXED PAYMENT COLUMN */}
                <td>
                  {percel.paymentStatus === "paid" ? (
                    <span className="text-green-500 font-bold">Paid</span>
                  ) : (
                    <Link to={`/dashboard/payment/${percel._id}`}>
                      <button className="btn btn-sm btn-primary text-black">
                        Pay Now
                      </button>
                    </Link>
                  )}
                </td>

                <td>
                  <button className="btn btn-square btn-sm ml-2 hover:bg-blue-500 hover:text-white">
                    <FiEdit />
                  </button>

                  <button className="btn btn-square btn-sm ml-2 hover:bg-blue-500 hover:text-white">
                    <FaMagnifyingGlass />
                  </button>

                  <button
                    className="btn btn-square btn-sm ml-2 hover:bg-red-500 hover:text-white"
                    onClick={() => handlePercelDelete(percel._id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyPercels;
