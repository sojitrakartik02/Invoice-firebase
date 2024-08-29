import React, { Component } from "react";
import Login from "./components/login/Login";
import "./App.css";
import Register from "./components/register/Register";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from "./components/dashboard/Dashboard";
import Home from "./components/dashboard/Home";
import Invoices from "./components/dashboard/Invoices";
import NweInvoice from "./components/dashboard/NweInvoice";
import Setting from "./components/dashboard/Setting";
import Details from "./components/dashboard/Details";

const App = () => {
  const myRouter = createBrowserRouter([
    { path: "", Component: Login },
    { path: "/login", Component: Login },
    { path: "/register", Component: Register },
    {
      path: "/dashboard",
      Component: Dashboard,
      children: [
        { path: "", Component: Home },
        { path: "home", Component: Home },
        { path: "invoices", Component: Invoices },
        { path: "newInvoice", Component: NweInvoice },
        { path: "setting", Component: Setting },
        { path: "invoice-details", Component: Details },
      ],
    },
  ]);

  return (
    <div>
      <RouterProvider router={myRouter}></RouterProvider>
    </div>
  );
};

export default App;
