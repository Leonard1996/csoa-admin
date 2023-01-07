import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const token = useSelector((state) => state.user.token);

  if (!Boolean(token)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;
