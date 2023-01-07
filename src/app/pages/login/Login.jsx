import { Grid } from "@mui/material";
import { useSelector } from "react-redux";
import Form from "./components/Form";
import { Navigate } from "react-router-dom";
import React from "react";
import Notification from "../../../common/components/Notification";

export default function Login() {
  const token = useSelector((state) => state.user.token);
  const user = useSelector((state) => state.user.user);

  if (token) {
    const pathsMap = {
      admin: "/dashboard",
      company: "/user-dashboard",
    };
    return <Navigate to={pathsMap[user.role]} replace />;
  }

  return (
    <Grid
      container
      sx={{
        minHeight: "calc(100vh - 48px)",
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Grid item xs={12}>
        <Form />
      </Grid>
    </Grid>
  );
}
