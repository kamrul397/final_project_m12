import React, { use, useRef } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useLoaderData } from "react-router";
import { map } from "leaflet";

const Coverage = () => {
  const ServiceCenters = useLoaderData();
  console.log(ServiceCenters);
  const position = [23.685, 90.3563];
  const mapRef = useRef();

  const handleSearch = (event) => {
    event.preventDefault();
    const location = event.target.location.value;
    console.log("Searching for location:", location);
    // Implement search functionality here
    const district = ServiceCenters.find((c) =>
      c.district.toLowerCase().includes(location.toLowerCase()),
    );
    if (district) {
      const coordinares = [district.latitude, district.longitude];
      console.log("Found district coordinates:", coordinares);
      mapRef.current.setView(coordinares, 12);
    } else {
      console.log("District not found");
    }
  };
  return (
    <div className="m-20  p-10 w-full h-[500px] mx-auto">
      <h2 className="text-5xl">We are available in 64 districts</h2>
      {/* search bar */}
      <div>
        <form onSubmit={handleSearch} className="my-5 w-1/2">
          <label className="input">
            <svg
              className="h-[1em] opacity-50"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2.5"
                fill="none"
                stroke="currentColor"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </g>
            </svg>
            <input
              type="search"
              className="grow"
              placeholder="Search"
              name="location"
            />
          </label>
        </form>
      </div>
      {/*  */}
      <div>
        <MapContainer
          center={position}
          zoom={8}
          scrollWheelZoom={true}
          ref={mapRef}
          className="h-96 w-full "
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {ServiceCenters.map((center, index) => (
            <Marker position={[center.latitude, center.longitude]} key={index}>
              <Popup>
                <strong>{center.district}</strong>
                <br />
                Coverage Area: {center.covered_area.join(", ")}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default Coverage;
