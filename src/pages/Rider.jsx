import React from "react";
import { useForm, useWatch } from "react-hook-form";
import useAuth from "../hooks/useAuth";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { useLoaderData } from "react-router";
import Swal from "sweetalert2";

const Rider = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const serviceCenters = useLoaderData();

  const regionsDuplicate = serviceCenters.map((center) => center.region);
  const regions = [...new Set(regionsDuplicate)];

  const districtByRegion = (region) => {
    if (!region) return [];
    const filteredDistricts = serviceCenters.filter(
      (center) => center.region === region,
    );
    return filteredDistricts.map((center) => center.district);
  };
  const handleRiderSubmit = (data) => {
    // You can send this data to your backend API using axiosSecure
    axiosSecure
      .post("/riders", data)
      .then((res) => {
        if (res.data.insertedId) {
          // Optionally, show a success message to the user
          Swal.fire(
            "Success!",
            "Your application has been submitted.",
            "success",
          );
        }
      })
      .catch((error) => {
        console.error("Error registering rider:", error);
        // Optionally, show an error message to the user
      });
  };
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      {/* Header Section */}
      <div className="border border-dashed border-gray-300 p-6 mb-10">
        <h2 className="text-4xl font-bold text-green-700">Be a Rider</h2>
        <p className="mt-3 text-gray-600 max-w-xl">
          Enjoy fast, reliable parcel delivery with zero hassle. From personal
          packages to business shipments — we deliver on time, every time.
        </p>
      </div>

      {/* Form Section */}
      <div className="border border-dashed border-gray-300 p-8">
        <h3 className="text-2xl font-semibold mb-6">Tell us about yourself</h3>

        <form
          onSubmit={handleSubmit(handleRiderSubmit)}
          className="space-y-5 max-w-lg"
        >
          {/* Name */}
          <div>
            <label className="block mb-1 text-sm font-medium">Your Name</label>
            <input
              type="text"
              placeholder="Your Name"
              className="input input-bordered w-full"
              {...register("name", { required: true })}
            />
          </div>
          {/* Driving License */}
          <div>
            <label className="block mb-1 text-sm font-medium">
              Driving License Number
            </label>
            <input
              type="text"
              placeholder="Driving License Number"
              className="input input-bordered w-full"
              {...register("licenseNumber", { required: true })}
            />
          </div>
          {/* Email */}
          <div>
            <label className="block mb-1 text-sm font-medium">Your Email</label>
            <input
              type="email"
              defaultValue={user?.email}
              readOnly
              className="input input-bordered w-full bg-gray-100"
              {...register("email")}
            />
          </div>
          Region
          <div>
            <label className="block mb-1 text-sm font-medium">
              Your Region
            </label>
            <select
              className="select select-bordered w-full"
              {...register("region", { required: true })}
            >
              <option value="">Select your Region</option>
              {regions.map((region, index) => (
                <option key={index} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </div>
          {/* District */}
          <div>
            <label className="block mb-1 text-sm font-medium">
              Your District
            </label>
            <select
              className="select select-bordered w-full"
              {...register("district", { required: true })}
            >
              <option value="">Select your District</option>
              {districtByRegion(useWatch({ control, name: "region" })).map(
                (district, index) => (
                  <option key={index} value={district}>
                    {district}
                  </option>
                ),
              )}
            </select>
          </div>
          {/* NID */}
          <div>
            <label className="block mb-1 text-sm font-medium">NID No</label>
            <input
              type="text"
              placeholder="NID"
              className="input input-bordered w-full"
              {...register("nid", { required: true })}
            />
          </div>
          {/* Bike Information */}
          <div>
            <label className="block mb-1 text-sm font-medium">
              Bike Information
            </label>
            <input
              type="text"
              placeholder="Bike Information"
              className="input input-bordered w-full"
              {...register("bikeInfo", { required: true })}
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary text-black w-full mt-4"
          >
            Submit Application
          </button>
        </form>
      </div>
    </div>
  );
};

export default Rider;
