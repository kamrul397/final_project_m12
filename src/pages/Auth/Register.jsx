import React from "react";
import { useForm } from "react-hook-form";
import useAuth from "../../hooks/useAuth";
import SocialLogin from "./SocialLogin";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router";

const Register = () => {
  const { registerUser, updateUserProfile } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  console.log("location", location);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const handleRegistration = (data) => {
    console.log("data", data);
    const profileImg = data.photoURL[0];
    registerUser(data.email, data.password)
      .then((userCredential) => {
        const user = userCredential.user;
        // store image to image hosting server
        const formData = new FormData();
        formData.append("image", profileImg);
        const image_URL_API = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_host}`;
        axios
          .post(image_URL_API, formData)
          .then((response) => {
            if (response.data.success) {
              const imgURL = response.data.data.display_url;
              console.log("Image URL:", imgURL);
              // You can now use the imgURL as needed, e.g., update user profile
              const profile = {
                displayName: data.name,
                photoURL: imgURL,
              };
              updateUserProfile(profile)
                .then(() => {
                  console.log("User profile updated successfully");
                  // Redirect to the intended page after successful registration
                  navigate(location.state || "/", { replace: true });
                })
                .catch((error) => {
                  console.error("Profile Update Error:", error);
                });
            }
          })
          .catch((error) => {
            console.error("Image Upload Error:", error);
          });
        console.log("Registered User:", user);
      })
      .catch((error) => {
        console.error("Registration Error:", error);
      });
  };
  return (
    <div>
      <form
        onSubmit={handleSubmit(handleRegistration)}
        className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4 mx-auto"
      >
        <h3 className="text-3xl text-center">Welcome to ZapShift</h3>
        <p className="text-center">Create your account to get started</p>
        <fieldset className="fieldset">
          {/* name */}
          <label className="label">Name</label>
          <input
            type="text"
            {...register("name", { required: true })}
            className="input"
            placeholder="Name"
          />
          {errors.name && (
            <span className="text-red-500">Name is required</span>
          )}
          {/* image */}
          <label className="label">Photo URL</label>
          <input
            type="file"
            {...register("photoURL", { required: true })}
            className="file-input"
            placeholder="Photo URL"
          />
          {errors.photoURL && (
            <span className="text-red-500">Photo is required</span>
          )}
          {/* email */}
          <label className="label">Email</label>
          <input
            type="email"
            {...register("email", { required: true })}
            className="input"
            placeholder="Email"
          />
          {errors.email && (
            <span className="text-red-500">This field is required</span>
          )}
          {/* password */}
          <label className="label">Password</label>
          <input
            type="password"
            {...register("password", {
              required: true,
              minLength: 6,
              pattern: /[A-Za-z]{3}.*[!@#$%^&*]/,
            })}
            className="input"
            placeholder="Password"
          />
          {errors.password?.type === "required" && (
            <span className="text-red-500">This field is required</span>
          )}
          {errors.password?.type === "minLength" && (
            <span className="text-red-500">
              Password must be at least 6 characters
            </span>
          )}
          {errors.password?.type === "pattern" && (
            <span className="text-red-500">
              Password must contain a special character
            </span>
          )}

          <button className="btn btn-neutral mt-4">Register</button>
          <p className="text-md mt-2">
            already have an account? please{" "}
            <Link state={location.state} to="/login" className="text-blue-500">
              login
            </Link>
          </p>
        </fieldset>
        <SocialLogin></SocialLogin>
      </form>
    </div>
  );
};

export default Register;
