import React from "react";
import { useForm, useWatch } from "react-hook-form";
import { useLoaderData } from "react-router";
import Swal from "sweetalert2";
import useAxiosSecure from "../hooks/useAxiosSecure";
import useAuth from "../hooks/useAuth";

const SendPercel = () => {
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

  const senderRegion = useWatch({
    control,
    name: "senderRegion",
  });

  const receiverRegion = useWatch({
    control,
    name: "receiverRegion",
  });

  const districtByRegion = (region) => {
    if (!region) return [];
    const filteredDistricts = serviceCenters.filter(
      (center) => center.region === region,
    );
    return filteredDistricts.map((center) => center.district);
  };

  const handleSendPercel = async (data) => {
    const isSameDistrict = data.senderRegion === data.receiverRegion;

    const isDocument = data.percelType === "document";

    const percelWeight = parseFloat(data.percelWeight) || 0;

    let cost = 0;

    if (isDocument) {
      cost = isSameDistrict ? 60 : 80;
    } else {
      if (percelWeight <= 3) {
        cost = isSameDistrict ? 110 : 150;
      } else {
        const minCharge = isSameDistrict ? 110 : 150;
        const extraWeight = percelWeight - 3;
        const extraCharge = isSameDistrict
          ? extraWeight * 40
          : extraWeight * 40 + 40;
        cost = minCharge + extraCharge;
      }
    }

    Swal.fire({
      title: `Delivery cost is ${cost} BDT`,
      text: "Do you want to proceed to payment?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Pay Now",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // 1️⃣ Save parcel first
          const parcelData = {
            ...data,
            cost,
            paymentStatus: "unpaid",
            createdAt: new Date(),
          };

          const saveRes = await axiosSecure.post("/percels", parcelData);

          if (saveRes.data.insertedId) {
            const percelId = saveRes.data.insertedId;

            // 2️⃣ Create Stripe session
            const paymentRes = await axiosSecure.post("/payment", {
              percelId,
              percelName: data.percelName,
              cost,
            });

            // 3️⃣ Redirect to Stripe
            window.location.replace(paymentRes.data.url);
          }
        } catch (error) {
          console.error(error);
          Swal.fire("Error", "Something went wrong!", "error");
        }
      }
    });
  };

  return (
    <div>
      <h2 className="text-5xl font-bold mb-6">Send a Percel</h2>

      <form
        onSubmit={handleSubmit(handleSendPercel)}
        className="space-y-6 p-6 bg-base-200 rounded-box border"
      >
        {/* Parcel Type */}
        <div>
          <label className="mr-5">
            <input
              type="radio"
              value="document"
              {...register("percelType", {
                required: true,
              })}
              defaultChecked
            />
            Document
          </label>

          <label>
            <input
              type="radio"
              value="non-document"
              {...register("percelType", {
                required: true,
              })}
            />
            Non-Document
          </label>
        </div>

        {/* Parcel Info */}
        <input
          type="text"
          placeholder="Parcel Name"
          className="input w-full"
          {...register("percelName", {
            required: true,
          })}
        />

        <input
          type="number"
          placeholder="Parcel Weight (kg)"
          className="input w-full"
          {...register("percelWeight", {
            required: true,
          })}
        />

        {/* Sender Info */}
        <h3 className="text-2xl font-semibold">Sender Information</h3>

        <input
          type="text"
          defaultValue={user?.displayName}
          className="input w-full"
          {...register("senderName", {
            required: true,
          })}
        />

        <input
          type="email"
          defaultValue={user?.email}
          className="input w-full"
          {...register("senderEmail")}
        />

        <select
          className="select w-full"
          {...register("senderRegion", {
            required: true,
          })}
        >
          <option value="">Pick Sender Region</option>
          {regions.map((region, index) => (
            <option key={index} value={region}>
              {region}
            </option>
          ))}
        </select>

        <select
          className="select w-full"
          {...register("senderDistrict", {
            required: true,
          })}
        >
          <option value="">Pick Sender District</option>
          {districtByRegion(senderRegion).map((district, index) => (
            <option key={index} value={district}>
              {district}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Sender Phone"
          className="input w-full"
          {...register("senderPhoneNumber", { required: true })}
        />

        {/* Receiver Info */}
        <h3 className="text-2xl font-semibold">Receiver Information</h3>

        <input
          type="text"
          placeholder="Receiver Name"
          className="input w-full"
          {...register("receiverName", {
            required: true,
          })}
        />

        <input
          type="email"
          placeholder="Receiver Email"
          className="input w-full"
          {...register("receiverEmail")}
        />

        <select
          className="select w-full"
          {...register("receiverRegion", {
            required: true,
          })}
        >
          <option value="">Pick Receiver Region</option>
          {regions.map((region, index) => (
            <option key={index} value={region}>
              {region}
            </option>
          ))}
        </select>

        <select
          className="select w-full"
          {...register("receiverDistrict", { required: true })}
        >
          <option value="">Pick Receiver District</option>
          {districtByRegion(receiverRegion).map((district, index) => (
            <option key={index} value={district}>
              {district}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Receiver Phone"
          className="input w-full"
          {...register("receiverPhoneNumber", { required: true })}
        />

        <button type="submit" className="btn btn-primary w-full">
          Send Parcel
        </button>
      </form>
    </div>
  );
};

export default SendPercel;
