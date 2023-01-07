import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Grid } from "@mui/material";
import axiosInstance from "../../../../common/helpers/axios.instance";
import { useDispatch } from "react-redux";
import { finishLoader, startLoader } from "../../../../features/user/userSlice";
import dateHelper from "../../../../common/helpers/dateHelper";
import { useMediaQuery } from "@mui/material";
import NotificationsMobile, { getElapsedTime } from "./NotificationsMobile";
import { statusMap } from "../../../../common/components/ExcelExport";

export default function Notifications() {
  const [minutes, setMinutes] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setMinutes((m) => m + 1);
    }, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const columns = [
    {
      field: "id",
      headerName: "Id",
      width: 50,
    },
    {
      field: "creator",
      headerName: "Emri",
      width: 220,
    },
    {
      field: "startDate",
      headerName: "Data",
      width: 400,
      valueGetter: (params) => dateHelper(params.row.startDate),
    },
    {
      // field: "startDate",
      headerName: "Koha nga rezervimi (min)",
      width: 250,
      valueGetter: (params) => getElapsedTime(params.row.tsCreated),
    },
    { field: "sport", headerName: "Sporti", width: 220 },
    { field: "location", headerName: "Fusha", width: 220 },
    { field: "name", headerName: "Kompleksi", width: 220 },
    {
      field: "status",
      headerName: "Statusi",
      width: 220,
      valueGetter: (params) => statusMap[params.row.status],
    },
  ];

  const [events, setEvents] = React.useState([]);

  const dispatch = useDispatch();

  const fetchEvents = async () => {
    dispatch(startLoader());
    try {
      const events = await axiosInstance.get(
        process.env.REACT_APP_BASE_API + "/events" + "?page=" + page
      );
      setEvents(events.data.data.events);
      setCount(events.data.data.count);
    } catch (error) {
      console.log({ error });
    }
    dispatch(finishLoader());
  };

  const [page, setPage] = React.useState(0);
  const [count, setCount] = React.useState(0);
  const isPhone = useMediaQuery("(max-width:600px)");

  React.useEffect(() => {
    fetchEvents();
  }, [page]);

  return (
    <>
      {!isPhone ? (
        <Grid
          container
          justifyContent="center"
          sx={{
            minHeight: "calc(100vh - 48px)",
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
              page={page}
              onPageChange={(newPage) => setPage(newPage)}
              pagination
              rowCount={count}
              paginationMode="server"
            />
          </Grid>
        </Grid>
      ) : (
        <NotificationsMobile
          count={count}
          events={events}
          page={page}
          setPage={setPage}
        />
      )}
    </>
  );
}
