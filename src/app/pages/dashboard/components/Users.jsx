import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Grid, Button, Box } from "@mui/material";
import axiosInstance from "../../../../common/helpers/axios.instance";
import { useDispatch } from "react-redux";
import { finishLoader, startLoader } from "../../../../features/user/userSlice";

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function ddMmYyyyFormater(date) {
  const yyyy = date.getFullYear();
  let mm = date.getMonth() + 1; // Months start at 0!
  let dd = date.getDate();

  if (dd < 10) dd = "0" + dd;
  if (mm < 10) mm = "0" + mm;

  return dd + "/" + mm + "/" + yyyy;
}

export default function Users() {
  const columns = [
    {
      field: "index",
      headerName: "Nr.",
      width: 70,
      renderCell: (index) => index.api.getRowIndex(index.row.id) + 1,
    },
    {
      field: "email",
      headerName: "Email",
      width: 200,
    },
    { field: "name", headerName: "Emri", width: 130 },
    { field: "sex", headerName: "Seksi", width: 130 },
    {
      field: "birthday",
      headerName: "Datëlindje",
      width: 200,
      valueGetter: (params) => ddMmYyyyFormater(new Date(params.row.birthday)),
    },
    {
      field: "address",
      headerName: "Adresa",
      width: 200,
    },
    {
      field: "footballStars",
      headerName: "Vlerësimi futboll",
      width: 200,
    },
    {
      field: "basketballStars",
      headerName: "Vlerësimi basketboll",
      width: 200,
    },
    {
      field: "tenisStars",
      headerName: "Vlerësimi tenis",
      width: 200,
    },
    {
      field: "voleyballStars",
      headerName: "Vlerësimi volejboll",
      width: 200,
    },
    {
      field: "phoneNumber",
      headerName: "Nr. i telefonit",
      width: 200,
    },
    {
      field: "sports",
      headerName: "Sportet",
      sortable: false,
      width: 250,
      valueGetter: (params) => {
        let sports = ``;
        for (const key in params.row.sports) {
          if (params.row.sports[key]?.picked === true)
            sports += capitalizeFirstLetter(key) + " ";
        }
        return sports;
      },
    },
    {
      field: "actions",
      headerName: "Veprimet",
      sortable: false,
      width: 450,
      renderCell: (params) => {
        return (
          <>
            <Box paddingRight={1}>
              <Button
                variant="contained"
                color="primary"
                disabled={!params.row.tsDeleted}
                onClick={() => toggleActivity(params.row.id)}
              >
                Aktivizo
              </Button>
            </Box>
            <Button
              variant="contained"
              color="error"
              disabled={params.row.tsDeleted}
              onClick={() => toggleActivity(params.row.id)}
            >
              Pezullo
            </Button>
          </>
        );
      },
    },
  ];

  const toggleActivity = async (id) => {
    dispatch(startLoader());
    try {
      await axiosInstance.get(
        process.env.REACT_APP_BASE_API + `/users/toggle?id=${id}`
      );
      await fetchUsers();
    } catch (error) {
      console.log("error");
    }
    dispatch(finishLoader());
  };

  const [users, setUsers] = React.useState([]);
  const dispatch = useDispatch();

  const fetchUsers = async () => {
    dispatch(startLoader());
    try {
      const users = await axiosInstance.get(
        process.env.REACT_APP_BASE_API + "/users"
      );
      setUsers(users.data.data.userData);
    } catch (error) {
      console.log({ error });
    }
    dispatch(finishLoader());
  };

  React.useEffect(() => {
    fetchUsers();
  }, []);

  return (
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
          rows={users}
          columns={columns}
          pageSize={15}
          rowsPerPageOptions={[5]}
        />
      </Grid>
    </Grid>
  );
}
