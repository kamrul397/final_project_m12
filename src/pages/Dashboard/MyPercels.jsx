import { useQuery } from "@tanstack/react-query";
import React from "react";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "./../../hooks/useAxiosSecure";
import { FiEdit } from "react-icons/fi";
import { FaMagnifyingGlass, FaTrash } from "react-icons/fa6";
import Swal from "sweetalert2";
import { Link } from "react-router";

const MyPercels = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const { data: percels, refetch } = useQuery({
    queryKey: ["myPercels", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/percels?email=${user?.email}`);
      // console.log(res.data);
      return res.data;
    },
  });
  const handlePercelDelete = (percelId) => {
    // Implement delete functionality here
    // console.log("Delete percel with ID:", percelId);

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        // Proceed with deletion logic
        axiosSecure.delete(`/percels/${percelId}`).then((res) => {
          console.log("Percel deleted:", res.data);
          // Optionally, you can refetch the percels or update the state to reflect the deletion
          refetch(); // Reload the page to reflect the deletion
        });
        // console.log("Deleting percel with ID:", percelId);
      }
    });
  };
  return (
    <div>
      <h2>All of my percels {percels?.length}</h2>
      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th>#</th>
              <th>Parcel Name</th>
              <th>Type</th>
              <th>Weight</th>
              <th>Receiver</th>
              {/* <th>Region</th> */}
              <th>District</th>
              <th>Phone</th>
              <th>Cost</th>
              <th>Created At</th>
              <th>Payment Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {/* row 1 */}
            {percels?.map((percel, index) => (
              <tr key={percel._id}>
                <th>{index + 1}</th>
                <td>{percel.percelName}</td>
                <td>{percel.percelType}</td>
                <td>{percel.percelWeight} kg</td>
                <td>{percel.receiverName}</td>
                {/* <td>{percel.receiverRegion}</td> */}
                <td>{percel.receiverDistrict}</td>
                <td>{percel.receiverPhoneNumber}</td>
                <td>{percel.cost} ৳</td>
                <td>{new Date(percel.createdAt).toLocaleString()}</td>
                {percel.paymentStatus === "paid" ? (
                  <td className="text-green-500 font-bold">Paid</td>
                ) : (
                  <Link to={`/dashboard/payment/${percel._id}`}>
                    <button className="btn btn-sm btn-primary text-black">
                      Pay Now
                    </button>
                  </Link>
                )}
                <td>
                  {/* Action buttons */}

                  <button className="btn btn-square btn-sm ml-2 hover:bg-blue-500 hover:text-white">
                    <FiEdit></FiEdit>
                  </button>
                  <button className="btn btn-square btn-sm ml-2 hover:bg-blue-500 hover:text-white">
                    <FaMagnifyingGlass></FaMagnifyingGlass>
                  </button>
                  <button
                    className="btn btn-square btn-sm ml-2 hover:bg-blue-500 hover:text-white"
                    onClick={() => handlePercelDelete(percel._id)}
                  >
                    <FaTrash></FaTrash>
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
