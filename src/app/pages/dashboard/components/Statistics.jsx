import { Grid, Box } from "@mui/material";
import StatisticsCard from "./StatisticsCard";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import axiosInstance from "../../../../common/helpers/axios.instance";
import { startLoader, finishLoader } from "../../../../features/user/userSlice";

const keys = {
  userStatistics: "Numri i perdoruesve",
  complexCount: "Numri i komplekseve",
  reservations: "Numri i rezervimeve kete muaj",
  userReservations: "Rezervime nga sistemi",
  complexReservations: "Rezervime nga komplekset",
};

export default function Statistics() {
  const [stats, setStats] = useState([]);
  const dispatch = useDispatch();
  const fetchStatistics = async () => {
    dispatch(startLoader());
    try {
      const stats = await axiosInstance.get(
        process.env.REACT_APP_BASE_API + "/dashboard-statistics"
      );
      setStats(stats.data.data.results);
    } catch (error) {}
    dispatch(finishLoader());
  };

  useEffect(() => {
    fetchStatistics();
  }, []);
  return (
    <Grid container gap={2}>
      {Object.keys(stats).map((stat, _index) => (
        <Grid item xs={3} key={_index}>
          <Box p={2}>
            <StatisticsCard description={keys[stat]} amount={stats[stat]} />
          </Box>
        </Grid>
      ))}
    </Grid>
  );
}
