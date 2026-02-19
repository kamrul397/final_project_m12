import React from "react";
import { useForm } from "react-hook-form";
import useAuth from "../../hooks/useAuth";
import SocialLogin from "./SocialLogin";
import { Link, useLocation, useNavigate } from "react-router";

const Login = () => {
  const { signInUser } = useAuth();
  const location = useLocation();

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const handleLogin = (data) => {
    console.log("data", data);
    signInUser(data.email, data.password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("Logged In User:", user);
        // Redirect to the intended page after successful login
        const from = location.state || "/";
        navigate(from, { replace: true });
      })
      .catch((error) => {
        console.error("Login Error:", error);
      });
  };
  return (
    <form onSubmit={handleSubmit(handleLogin)}>
      <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4 mx-auto">
        <h3 className="text-3xl text-center">Welcome back</h3>

        {/* email */}
        <label className="label">Email</label>
        <input
          type="email"
          {...register("email", { required: true })}
          className="input"
          placeholder="Email"
        />
        {errors.email?.type === "required" && (
          <span className="text-red-500">This field is required</span>
        )}
        {/* password */}
        <label className="label">Password</label>
        <input
          type="password"
          {...register("password", { required: true, minLength: 6 })}
          className="input"
          placeholder="Password"
        />
        {errors.password?.type === "required" && (
          <span className="text-red-500">This field is required</span>
        )}

        <button className="btn btn-neutral mt-4">Login</button>
        <div>
          <a className="link link-hover">Forgot password?</a>
        </div>
        <p>
          new user? please{" "}
          <Link to="/register" state={location.state} className="text-blue-500">
            register
          </Link>
        </p>
        <SocialLogin></SocialLogin>
      </fieldset>
    </form>
  );
};

export default Login;
