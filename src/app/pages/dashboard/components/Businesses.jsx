import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Grid, Button, Box } from "@mui/material";
import axiosInstance from "../../../../common/helpers/axios.instance";
import { useDispatch } from "react-redux";
import { finishLoader, startLoader } from "../../../../features/user/userSlice";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import BusinessModal from "./BusinessModal";

export default function Businesses() {
  const columns = [
    {
      field: "name",
      headerName: "Emri",
      width: 220,
    },
    { field: "city", headerName: "Qyteti", width: 220 },
    { field: "phone", headerName: "Telefoni", width: 220 },
    {
      field: "actions",
      headerName: "Veprimet",
      sortable: false,
      width: 800,
      renderCell: (params) => {
        return (
          <>
            <Box paddingRight={1}>
              <Button
                variant="contained"
                color="info"
                onClick={() => handleClickById(params.row.id, "edit")}
              >
                Ndrysho
              </Button>
            </Box>
            <Box paddingRight={1}>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => handleClickById(params.row.id, "calendar")}
              >
                Kalendari
              </Button>
            </Box>
            <Box paddingRight={1}>
              <Button
                variant="contained"
                color="warning"
                onClick={() => handleClickById(params.row.id, "reserve")}
              >
                Rezervimet
              </Button>
            </Box>
            <Box paddingRight={1}>
              <Button
                variant="contained"
                color="primary"
                disabled={!params.row.tsDeleted}
                onClick={() => toggleStatus(params.row.id)}
              >
                <span style={{ color: "white" }}> Aktivizo</span>
              </Button>
            </Box>
            <Button
              variant="contained"
              color="error"
              disabled={params.row.tsDeleted}
              onClick={() => toggleStatus(params.row.id)}
            >
              Pezullo
            </Button>
          </>
        );
      },
    },
  ];

  const toggleStatus = async (id) => {
    dispatch(startLoader());
    try {
      await axiosInstance.patch(
        process.env.REACT_APP_BASE_API + `/complexes/${id}`
      );
      await fetchBusiness(id);
    } catch (error) {
      console.log("error");
    }
    dispatch(finishLoader());
  };

  const fetchBusiness = async (id) => {
    try {
      const business = await axiosInstance.get(
        process.env.REACT_APP_BASE_API + `/complexes/${id}`
      );

      const existingBusinesses = [...businesses];

      const index = existingBusinesses.findIndex(
        (business) => business.id === id
      );

      existingBusinesses[index] = business?.data?.data?.complex[0];
      setBusinesses(existingBusinesses);
    } catch (error) {
      console.log({ error });
      console.log("error");
    }
  };

  const handleClose = () =>
    setBusinessModal((prevState) => ({ ...prevState, isOpen: false }));

  const [businesses, setBusinesses] = React.useState([]);
  const [businessModal, setBusinessModal] = React.useState({
    type: "",
    isOpen: null,
    handleClose,
    business: null,
  });

  const dispatch = useDispatch();

  const fetchBusinesses = async () => {
    dispatch(startLoader());
    try {
      const businesses = await axiosInstance.get(
        process.env.REACT_APP_BASE_API + "/complexes"
      );

      setBusinesses(businesses.data.data.complexes);
    } catch (error) {
      console.log({ error });
    }
    dispatch(finishLoader());
  };

  React.useEffect(() => {
    fetchBusinesses();
  }, []);

  React.useEffect(() => {
    if (businessModal?.isOpen === false) {
      fetchBusinesses();
    }
  }, [businessModal?.isOpen]);

  const handleClick = (type) => {
    setBusinessModal((prevState) => ({ ...prevState, isOpen: true, type }));
  };

  const handleClickById = (id, type) => {
    const business = businesses.find((business) => business.id === id);

    setBusinessModal((prevState) => ({
      ...prevState,
      isOpen: true,
      type,
      business,
    }));
  };

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
          <Box p={1}>
            <Button variant="contained" onClick={() => handleClick("create")}>
              <span style={{ color: "white" }}>Krijo kompleks</span>
              <ControlPointIcon sx={{ fill: "white" }} />
            </Button>
          </Box>
          <DataGrid
            sx={{
              "&.MuiDataGrid-root": {
                ".MuiDataGrid-columnHeaderTitleContainer": {
                  color: "#08C47C",
                  fontSize: "1.1rem",
                },
              },
            }}
            rows={businesses}
            columns={columns}
            pageSize={15}
            rowsPerPageOptions={[5]}
          />
        </Grid>
      </Grid>
      <BusinessModal {...businessModal} />
    </>
  );
}
