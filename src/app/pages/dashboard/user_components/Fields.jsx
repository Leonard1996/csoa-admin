import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Grid, Button, Box } from "@mui/material";
import axiosInstance from "../../../../common/helpers/axios.instance";
import { useDispatch, useSelector } from "react-redux";
import { finishLoader, startLoader } from "../../../../features/user/userSlice";
import EditFieldModal from "./EditFieldModal";

export function ddMmYyyyFormater(date) {
  const yyyy = date.getFullYear();
  let mm = date.getMonth() + 1; // Months start at 0!
  let dd = date.getDate();

  if (dd < 10) dd = "0" + dd;
  if (mm < 10) mm = "0" + mm;

  return dd + "/" + mm + "/" + yyyy;
}

export default function Fields() {
  const columns = [
    {
      field: "index",
      headerName: "Nr.",
      width: 70,
      renderCell: (index) => index.api.getRowIndex(index.row.id) + 1,
    },
    { field: "name", headerName: "Emri", width: 140 },
    { field: "dimensions", headerName: "Dimensionet", width: 140 },
    {
      field: "price",
      headerName: "Çmimi",
      width: 240,
    },
    {
      field: "sports",
      headerName: "Sportet",
      width: 280,
    },
    {
      field: "actions",
      headerName: "Veprimet",
      sortable: false,
      width: 350,
      renderCell: (params) => {
        return (
          <>
            <Box paddingRight={1}>
              <Button
                variant="contained"
                color="primary"
                disabled={!params.row.ts_deleted}
                onClick={() => toggleActivity(params.row.id)}
              >
                Aktivizo
              </Button>
            </Box>
            <Button
              variant="contained"
              color="error"
              disabled={params.row.ts_deleted}
              onClick={() => toggleActivity(params.row.id)}
            >
              Pezullo
            </Button>
            <Box paddingLeft={1}>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => openEditFieldModal(params.row.id)}
              >
                Modifiko
              </Button>
            </Box>
          </>
        );
      },
    },
  ];

  const toggleActivity = async (id) => {
    dispatch(startLoader());
    try {
      await axiosInstance.get(
        process.env.REACT_APP_BASE_API + `/activity/locations/toggle?id=${id}`
      );
      await fetchFields();
    } catch (error) {
      console.log("error");
    }
    dispatch(finishLoader());
  };

  const openEditFieldModal = (id) => {
    setModal((m) => ({ ...m, id, isOpen: true }));
  };

  const editField = async (id, fields) => {
    dispatch(startLoader());
    try {
      await axiosInstance.patch(
        process.env.REACT_APP_BASE_API + `/locations/${id}`,
        fields
      );
      await fetchFields();
      handleClose();
    } catch (error) {
      console.log("error");
    }
    dispatch(finishLoader());
  };

  const handleClose = () => {
    setModal((m) => ({ ...m, isOpen: false }));
  };
  const [fields, setFields] = React.useState([]);
  const [modal, setModal] = React.useState({
    isOpen: false,
    handleClose,
    id: null,
  });
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();

  const fetchFields = async () => {
    dispatch(startLoader());
    try {
      let fields = await axiosInstance.get(
        process.env.REACT_APP_BASE_API + `/v2/complexes/${user.id}/locations`
      );
      const locations = fields.data.data.map((location) => {
        let sports = "";

        if (location.isFootball) sports += `futboll, `;
        if (location.isBasketball) sports += `basketboll, `;
        if (location.isVolleyball) sports += `volejboll, `;
        if (location.isTennis) sports += `tenis, `;
        return {
          ...location,
          sports: sports.substring(0, sports.length - 2),
        };
      });
      setFields(locations);
    } catch (error) {
      console.log({ error });
    }
    dispatch(finishLoader());
  };

  React.useEffect(() => {
    fetchFields();
  }, []);

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
            rows={fields}
            columns={columns}
            pageSize={15}
            rowsPerPageOptions={[5]}
          />
        </Grid>
      </Grid>
      <EditFieldModal {...modal} editField={editField} />
    </>
  );
}
