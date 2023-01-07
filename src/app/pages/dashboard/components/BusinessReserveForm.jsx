import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import {
  Grid,
  TextField,
  Box,
  Checkbox,
  FormControlLabel,
  Typography,
} from "@mui/material";
import DialogTitle from "@mui/material/DialogTitle";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { DataGrid } from "@mui/x-data-grid";
import { finishLoader, startLoader } from "../../../../features/user/userSlice";
import axiosInstance from "../../../../common/helpers/axios.instance";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { EVENT_STATUS } from "../../../../common/constans/constants";
import dateHelper from "../../../../common/helpers/dateHelper";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import ExcelExport, {
  statusMap,
} from "../../../../common/components/ExcelExport";

const typeAlbanianMap = {
  "Nga aplikacion": true,
  "Nga paneli": true,
};

export default function BusinessesReserveForm({ handleClose, business }) {
  const isLoading = useSelector((state) => state.user.isLoading);

  const columns = [
    { field: "name", headerName: "Emri", width: 150 },
    { field: "locationName", headerName: "Fusha", width: 150 },
    {
      field: "startDate",
      headerName: "Data (fillon)",
      width: 200,
      valueGetter: (params) => dateHelper(params.row.startDate),
    },
    {
      field: "endDate",
      headerName: "Data (mbaron)",
      width: 200,
      valueGetter: (params) => dateHelper(params.row.endDate),
    },

    {
      field: "price",
      headerName: "Çmimi",
      width: 130,
    },
    {
      field: "isUserReservation",
      headerName: "Tipi",
      width: 130,
      valueGetter: (params) =>
        params.row.isUserReservation ? "Nga aplikacion" : "Nga paneli",
    },
    {
      field: "status",
      headerName: "Statusi",
      width: 130,
      valueGetter: (params) => statusMap[params.row.status],
    },
    {
      field: "isWeekly",
      headerName: "I perhershem",
      width: 130,
      valueGetter: (params) => (params.row.isWeekly ? "Po" : "Jo"),
    },
  ];

  const dispatch = useDispatch();
  const [events, setEvents] = React.useState([]);
  const [filters, setFilters] = React.useState({
    status: {
      draft: true,
      waiting_for_confirmation: true,
      confirmed: true,
      completed: true,
      canceled: true,
    },
    type: {
      "Nga aplikacion": true,
      "Nga paneli": true,
    },
    time: {
      from: new Date(2022, 7, 31, 0),
      to: new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate() + 1
      ),
    },
    isWeekly: true,
  });

  const fetchEventsByComplexId = async (id) => {
    dispatch(startLoader());
    try {
      const events = await axiosInstance.get(
        process.env.REACT_APP_BASE_API + `/complexes/${id}/events`
      );

      setEvents(events.data.data.events);
    } catch (error) {
      console.log({ error });
    }
    dispatch(finishLoader());
  };

  React.useEffect(() => {
    fetchEventsByComplexId(business?.id);
  }, []);

  const handleChange = (value, timeType) => {
    if (!value) return;
    value =
      timeType === "from"
        ? new Date(value["$y"], value["$M"], value["$D"], 0, 0, 0)
        : new Date(value["$y"], value["$M"], value["$D"], 23, 59, 59);
    setFilters((prevState) => ({
      ...prevState,
      time: { ...prevState.time, [timeType]: value },
    }));
  };

  const handleSearch = async () => {
    dispatch(startLoader());
    try {
      const events = await axiosInstance.post(
        process.env.REACT_APP_BASE_API + `/complexes/${business.id}/events`,
        filters
      );
      setEvents(events.data.data.events);
    } catch (error) {
      console.log({ error });
    }
    dispatch(finishLoader());
  };

  return (
    <>
      <DialogTitle color="primary">Rezervimet</DialogTitle>
      <DialogContent>
        <Box
          paddingY={1}
          sx={{ display: "flex", justifyContent: "space-between" }}
        >
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker
              label="Data e fillimit te eventit"
              inputFormat="DD/MM/YYYY"
              value={filters?.time?.from}
              onChange={(value) => handleChange(value, "from")}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker
              label="Data e mbarimit te eventit"
              inputFormat="DD/MM/YYYY"
              value={filters?.time?.to}
              onChange={(value) => handleChange(value, "to")}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
        </Box>

        <Box paddingY={1}>
          <Typography variant="body1" color="primary">
            Zgjidhni statusin e rezervimit
          </Typography>
          {Object.keys(EVENT_STATUS).map((key) => (
            <FormControlLabel
              key={key}
              value={EVENT_STATUS[key]}
              control={<Checkbox checked={filters.status[EVENT_STATUS[key]]} />}
              label={key}
              labelPlacement="end"
              onChange={() =>
                setFilters((prevState) => ({
                  ...prevState,
                  status: {
                    ...prevState.status,
                    [EVENT_STATUS[key]]: !prevState.status[EVENT_STATUS[key]],
                  },
                }))
              }
            />
          ))}
        </Box>

        <Box paddingY={1}>
          <Typography variant="body1" color="primary">
            Zgjidhni tipin e rezervimit
          </Typography>
          {Object.keys(typeAlbanianMap).map((key) => (
            <FormControlLabel
              key={key}
              value={typeAlbanianMap[key]}
              control={<Checkbox checked={filters.type[key]} />}
              label={key}
              labelPlacement="end"
              onChange={() =>
                setFilters((prevState) => ({
                  ...prevState,
                  type: {
                    ...prevState.type,
                    [key]: !prevState.type[key],
                  },
                }))
              }
            />
          ))}
          <FormControlLabel
            value={filters.isWeekly}
            control={<Checkbox checked={filters.isWeekly} />}
            label="I perhershem"
            labelPlacement="end"
            onChange={() =>
              setFilters((prevState) => ({
                ...prevState,
                isWeekly: !prevState.isWeekly,
              }))
            }
          />
        </Box>

        <Grid
          container
          justifyContent="center"
          sx={{
            minHeight: "700px",
          }}
        >
          <Grid item xs={12}>
            <DataGrid
              sx={{
                "&.MuiDataGrid-root": {
                  ".MuiDataGrid-columnHeaderTitleContainer": {
                    color: "#08C47C",
                    fontSize: "1.1rem",
                  },
                },
              }}
              rows={events}
              columns={columns}
              pageSize={15}
              rowsPerPageOptions={[5]}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          disabled={isLoading}
          onClick={handleClose}
          variant="contained"
          color="error"
        >
          Mbyll
        </Button>
        <Button
          disabled={isLoading}
          onClick={handleSearch}
          variant="contained"
          color="primary"
        >
          Kerko
        </Button>
        <Button
          disabled={isLoading}
          onClick={() => fetchEventsByComplexId(business?.id)}
          variant="contained"
          color="primary"
        >
          Shfaq pa filtra
        </Button>
        <ExcelExport data={JSON.parse(JSON.stringify(events))} />
      </DialogActions>
    </>
  );
}
