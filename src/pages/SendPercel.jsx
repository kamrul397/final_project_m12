import React, { use } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useLoaderData } from "react-router";
import Swal from "sweetalert2";

const SendPercel = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
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
    const filteredDistricts = serviceCenters.filter(
      (center) => center.region === region,
    );
    return filteredDistricts.map((center) => center.district);
  };

  const handleSendPercel = (data) => {
    const isSameDistrict = senderRegion === receiverRegion;
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
    console.log(data);
    // console.log(cost);
    Swal.fire({
      title: `Agree with our cost? ${cost} BDT`,
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Yes! Agreed.",
      denyButtonText: `Don't Agree`,
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          `Your parcel is sent to ${data.receiverName} in ${data.receiverRegion}!`,
          "",
          "success",
        );
      } else if (result.isDenied) {
        Swal.fire("Parcel is not sent!", "", "info");
      }
    });
  };
  return (
    <div>
      <div className="h2 text-5xl font-bold">Send a Percel</div>
      <form
        onSubmit={handleSubmit(handleSendPercel)}
        className="space-y-6 mt-6 p-3 text-black bg-base-200 rounded-box border border-base-300 w-full  mx-auto"
      >
        {/* percel type */}
        <div>
          <label className="label mr-5">
            <input
              type="radio"
              {...register("percelType", { required: true })}
              value="document"
              className="radio"
              defaultChecked
            />
            Document
          </label>
          <label className="label">
            <input
              type="radio"
              {...register("percelType", { required: true })}
              value="non-document"
              className="radio"
            />
            Non-Document
          </label>
        </div>
        {/* percel info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <fieldset className="fieldset">
            <label className="label">Percel Name</label>
            <input
              type="text"
              className="input w-full"
              placeholder="Percel Name"
              {...register("percelName", { required: true })}
            />
          </fieldset>
          <fieldset className="fieldset">
            <label className="label">Percel Weight (kg)</label>
            <input
              type="number"
              className="input w-full"
              placeholder="Percel Weight (kg)"
              {...register("percelWeight", { required: true })}
            />
          </fieldset>
        </div>
        {/* two column */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* sender info */}
          <div>
            <h2 className="text-2xl font-semibold">Sender Information</h2>
            <fieldset className="fieldset">
              {/* sender name */}
              <label className="label">Sender Name</label>
              <input
                type="text"
                className="input w-full"
                placeholder="Sender Name"
                {...register("senderName", { required: true })}
              />
              {/* sender email */}
              <label className="label mt-4">Sender Email</label>
              <input
                type="email"
                className="input w-full"
                placeholder="Sender Email"
                {...register("senderEmail")}
              />
              {/* sender region */}
              <fieldset className="fieldset">
                <legend className="fieldset-legend">Sender region</legend>
                <select
                  defaultValue="Pick a region"
                  className="select w-full"
                  {...register("senderRegion", { required: true })}
                >
                  <option disabled={true}>Pick a region</option>
                  {regions.map((region, index) => (
                    <option key={index} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
              </fieldset>
              {/* sender District */}
              <fieldset className="fieldset">
                <legend className="fieldset-legend">Sender District</legend>
                <select
                  defaultValue="Pick a district"
                  className="select w-full"
                  {...register("senderDistrict", { required: true })}
                >
                  <option disabled={true}>Pick a district</option>
                  {districtByRegion(senderRegion).map((district, index) => (
                    <option key={index} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
              </fieldset>

              {/* sender phone Number */}
              <label className="label mt-4">Sender Phone Number</label>
              <input
                type="number"
                className="input w-full"
                placeholder="Sender Phone Number"
                {...register("senderPhoneNumber", { required: true })}
              />
            </fieldset>
          </div>
          {/* receiver info */}
          <div>
            <h2 className="text-2xl font-semibold">Receiver Information</h2>
            <fieldset className="fieldset">
              {/* receiver name */}
              <label className="label">Receiver Name</label>
              <input
                type="text"
                className="input w-full"
                placeholder="Receiver Name"
                {...register("receiverName", { required: true })}
              />
              {/* receiver email */}
              <label className="label mt-4">Receiver Email</label>
              <input
                type="email"
                className="input w-full"
                placeholder="Receiver Email"
                {...register("receiverEmail")}
              />
              {/* receiver region */}
              <fieldset className="fieldset">
                <legend className="fieldset-legend">Receiver region</legend>
                <select
                  defaultValue="Pick a region"
                  className="select w-full"
                  {...register("receiverRegion", { required: true })}
                >
                  <option disabled={true}>Pick a region</option>
                  {regions.map((region, index) => (
                    <option key={index} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
              </fieldset>
              {/* receiver District */}
              <fieldset className="fieldset">
                <legend className="fieldset-legend">Receiver District</legend>
                <select
                  defaultValue="Pick a district"
                  className="select w-full"
                  {...register("receiverDistrict", { required: true })}
                >
                  <option disabled={true}>Pick a district</option>
                  {districtByRegion(receiverRegion).map((district, index) => (
                    <option key={index} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
              </fieldset>
              {/* receiver phone Number */}
              <label className="label mt-4">Receiver Phone Number</label>
              <input
                type="number"
                className="input w-full"
                placeholder="Receiver Phone Number"
                {...register("receiverPhoneNumber", { required: true })}
              />
            </fieldset>
          </div>
        </div>
        <input
          type="submit"
          value="Send Percel"
          className="btn btn-primary text-black"
        />
      </form>
    </div>
  );
};

export default SendPercel;
