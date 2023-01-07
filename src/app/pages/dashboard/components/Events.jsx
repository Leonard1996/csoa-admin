import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Grid, Button, Box } from "@mui/material";
import axiosInstance from "../../../../common/helpers/axios.instance";
import { useDispatch } from "react-redux";
import { finishLoader, startLoader } from "../../../../features/user/userSlice";
import PlayersList from "./PlayersList";
import dateHelper from "../../../../common/helpers/dateHelper";
import { useState } from "react";

export default function Events() {
  const columns = [
    {
      field: "id",
      headerName: "Rendi",
      width: 75,
    },
    {
      field: "creator",
      headerName: "Organizator",
      width: 220,
    },
    {
      field: "email",
      headerName: "Email organizatori",
      width: 220,
    },
    {
      field: "phoneNumber",
      headerName: "Tel organizatori",
      width: 220,
    },
    {
      field: "startDate",
      headerName: "Data",
      width: 400,
      valueGetter: (params) => dateHelper(params.row.startDate),
    },
    { field: "sport", headerName: "Sporti", width: 220 },
    { field: "name", headerName: "Vendi", width: 220 },
    {
      field: "actions",
      headerName: "Veprimet",
      sortable: false,
      width: 500,
      renderCell: (params) => {
        return (
          <>
            <Box paddingRight={1}>
              <Button
                variant="contained"
                color="primary"
                disabled={!params.row.tsDeleted}
                onClick={() => changeStatus(params.row.id)}
              >
                Aktivizo
              </Button>
            </Box>
            <Box paddingRight={1}>
              <Button
                variant="contained"
                color="error"
                disabled={params.row.tsDeleted}
                onClick={() => changeStatus(params.row.id)}
              >
                Pezullo
              </Button>
            </Box>
            <Button
              variant="contained"
              color="info"
              onClick={() => showPlayers(params.row.id)}
            >
              Shfaq lojtaret
            </Button>
          </>
        );
      },
    },
  ];

  const changeStatus = async (id) => {
    dispatch(startLoader());
    try {
      await axiosInstance.post(
        process.env.REACT_APP_BASE_API + `/events/${id}/toggle`
      );
      await fetchEvents();
    } catch (error) {
      console.log("error");
    }
    dispatch(finishLoader());
  };

  const showPlayers = async (id) => {
    dispatch(startLoader());
    try {
      const players = await axiosInstance.get(
        process.env.REACT_APP_BASE_API + `/events/${id}/players`
      );
      setPlayersModal({
        players: players.data.data.players,
        isOpen: true,
        onClose,
      });
    } catch (error) {
      console.log("error");
    }
    dispatch(finishLoader());
  };

  const onClose = () =>
    setPlayersModal((prevState) => ({ ...prevState, isOpen: false }));

  const [events, setEvents] = React.useState([]);
  const [playersModal, setPlayersModal] = React.useState({
    players: [],
    isOpen: false,
    onClose,
  });

  const dispatch = useDispatch();

  const fetchEvents = async () => {
    dispatch(startLoader());
    try {
      const events = await axiosInstance.get(
        process.env.REACT_APP_BASE_API + "/events" + `?page=${page}`
      );
      setEvents(events.data.data.events);
      setCount(events.data.data.count);
    } catch (error) {
      console.log({ error });
    }
    dispatch(finishLoader());
  };

  // React.useEffect(() => {
  //   fetchEvents();
  // }, []);

  const [page, setPage] = useState(0);
  const [count, setCount] = useState(0);

  React.useEffect(() => {
    fetchEvents();
  }, [page]);

  return (
    <>
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
            rowsPerPageOptions={[15]}
            page={page}
            onPageChange={(newPage) => setPage(newPage)}
            pagination
            paginationMode="server"
            rowCount={count}
          />
        </Grid>
      </Grid>
      <PlayersList {...playersModal} />
    </>
  );
}
