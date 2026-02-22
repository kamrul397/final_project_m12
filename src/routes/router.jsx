import { createBrowserRouter, Router } from "react-router";
import RootLayout from "../layouts/RootLayout";
import Home from "../pages/Home";
import Coverage from "../pages/Coverages/Coverage";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import PrivateRoutes from "./PrivateRoutes";
import Rider from "../pages/Rider";
import SendPercel from "../pages/SendPercel";
import DashboardLayout from "../layouts/DashboardLayout";
import MyPercels from "../pages/Dashboard/MyPercels";
import Payment from "../pages/Dashboard/Payment";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout></RootLayout>,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "send-percel",
        element: (
          <PrivateRoutes>
            <SendPercel></SendPercel>
          </PrivateRoutes>
        ),
        loader: () => fetch("/ServiceCenter.json").then((res) => res.json()),
      },
      {
        path: "rider",
        element: (
          <PrivateRoutes>
            <Rider></Rider>
          </PrivateRoutes>
        ),
      },
      {
        path: "/coverage",
        Component: Coverage,
        loader: () => fetch("/ServiceCenter.json").then((res) => res.json()),
      },
    ],
  },
  {
    path: "/",
    Component: AuthLayout,
    children: [
      // auth related routes can be added here
      {
        path: "login",
        Component: Login,
      },
      {
        path: "register",
        Component: Register,
      },
    ],
  },
  {
    path: "dashboard",
    element: (
      <PrivateRoutes>
        <DashboardLayout></DashboardLayout>
      </PrivateRoutes>
    ),
    children: [
      {
        path: "my-percels",
        element: <MyPercels></MyPercels>,
      },
      {
        path: "payment/:percelId",
        element: <Payment></Payment>,
      },
    ],
  },
]);

export default router;
