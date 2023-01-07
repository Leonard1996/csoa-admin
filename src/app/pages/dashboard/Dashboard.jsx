import { Grid } from "@mui/material";
import Menu from "./components/Menu";
import Statistics from "./components/Statistics";
import { Route, Routes } from "react-router-dom";
import Users from "./components/Users";
import Events from "./components/Events";
import Notifications from "./components/Notifications";
import Businesses from "./components/Businesses";
import BusinessUsers from "./components/BusinessUsers";

export default function Dashboard() {
  return (
    <Grid
      container
      sx={{
        minHeight: "calc(100vh - 48px)",
      }}
    >
      <Grid item xs={2} sx={{ backgroundColor: "white" }}>
        <Menu />
      </Grid>
      <Grid item xs={10}>
        <Routes>
          <Route exact path="/users" element={<Users />} />
          <Route exact path="/" element={<Statistics />} />
          <Route exact path="/events" element={<Events />} />
          <Route exact path="/notifications" element={<Notifications />} />
          <Route exact path="/businesses" element={<Businesses />} />
          <Route exact path="/businesses" element={<Businesses />} />
          <Route exact path="/business-users" element={<BusinessUsers />} />
        </Routes>
      </Grid>
    </Grid>
  );
}
