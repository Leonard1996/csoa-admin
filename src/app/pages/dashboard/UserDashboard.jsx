import { Grid } from "@mui/material";
import Menu from "./components/Menu";
import { Route, Routes } from "react-router-dom";
import Home from "./user_components/Home";
import Fields from "./user_components/Fields";
import Booking from "./user_components/Booking";
import Calendar from "./user_components/Calendar";

export default function UserDashboard() {
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
          <Route exact path="/" element={<Home />} />
          <Route exact path="/fields" element={<Fields />} />
          <Route exact path="/calendar" element={<Calendar />} />
          <Route exact path="/reservations" element={<Booking />} />
        </Routes>
      </Grid>
    </Grid>
  );
}
