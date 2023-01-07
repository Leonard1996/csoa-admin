import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Grid,
  Button,
  Box,
  TextField,
  FormControl,
  MenuItem,
  Select,
  InputLabel,
} from "@mui/material";
import axiosInstance from "../../../../common/helpers/axios.instance";
import { useDispatch } from "react-redux";
import { finishLoader, startLoader } from "../../../../features/user/userSlice";
import { useRef } from "react";
import Popover from "@mui/material/Popover";
import CircularProgress from "@mui/material/CircularProgress";

export function ddMmYyyyFormater(date) {
  const yyyy = date.getFullYear();
  let mm = date.getMonth() + 1; // Months start at 0!
  let dd = date.getDate();

  if (dd < 10) dd = "0" + dd;
  if (mm < 10) mm = "0" + mm;

  return dd + "/" + mm + "/" + yyyy;
}

export default function BusinessUsers() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const passwordEditRef = React.useRef(null);
  const confirmPasswordEditRef = React.useRef(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleClick = (event, id) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChangePassword = async (id) => {
    if (
      passwordEditRef.current.value !== confirmPasswordEditRef.current.value ||
      passwordEditRef.current.value.trim() === ""
    ) {
      alert("Fjalëkalimet e vendosura duhet të jenë te njëjta dhe jo bosh");
      return;
    }
    setIsLoading(true);
    try {
      await axiosInstance.post(
        process.env.REACT_APP_BASE_API + `/users/${id}/changePassword`,
        {
          password: passwordEditRef.current.value,
        }
      );
      //  console.log({ passwordRef, confirmPasswordRef });
    } catch (error) {
      console.log(error);
      alert("Veprimi nuk u krye me sukses");
    }
    setIsLoading(false);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
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
      width: 210,
    },

    {
      field: "complex",
      headerName: "Kompleksi",
      width: 210,
    },

    { field: "name", headerName: "Emri", width: 130 },
    {
      field: "tsCreated",
      headerName: "Data e regjistrimit",
      width: 210,
      renderCell: (index) => ddMmYyyyFormater(new Date(index.row.tsCreated)),
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
            <Box paddingLeft={1}>
              <Button variant="contained" color="primary" onClick={handleClick}>
                Ndrysho Fjalëkalimin
              </Button>
              <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
              >
                <Grid container>
                  {isLoading ? (
                    <Grid item xs={12}>
                      <Box
                        p={2}
                        sx={{ minWidth: "300px", textAlign: "center" }}
                      >
                        <CircularProgress color="primary" />
                      </Box>
                    </Grid>
                  ) : (
                    <>
                      <Grid item xs={6}>
                        <Box p={1}>
                          <TextField
                            type="password"
                            label="Fjalëkalimi i ri"
                            fullWidth
                            inputRef={passwordEditRef}
                          />
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box p={1}>
                          <TextField
                            type="password"
                            label="Konfirmo fjalëkalimin"
                            fullWidth
                            inputRef={confirmPasswordEditRef}
                          />
                        </Box>
                      </Grid>
                      <Grid item xs={12}>
                        <Box p={1} sx={{ textAlign: "center" }}>
                          <Button
                            variant="contained"
                            onClick={() => handleChangePassword(params.row.id)}
                          >
                            <span style={{ color: "white" }}>Konfirmo</span>
                          </Button>
                        </Box>
                      </Grid>
                    </>
                  )}
                </Grid>
              </Popover>
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
        process.env.REACT_APP_BASE_API + `/users/toggle?id=${id}`
      );
      await fetchUsers();
    } catch (error) {
      console.log("error");
    }
    dispatch(finishLoader());
  };

  const [users, setUsers] = React.useState([]);
  const [complexes, setComplexes] = React.useState([]);
  const [selectedComplex, setSelectedComplex] = React.useState([]);
  const dispatch = useDispatch();

  const fetchUsers = async () => {
    dispatch(startLoader());
    const promises = [];
    try {
      promises.push(
        axiosInstance.get(process.env.REACT_APP_BASE_API + "/users-complexes")
      );
      promises.push(
        axiosInstance.get(
          process.env.REACT_APP_BASE_API + "/complexes-minified"
        )
      );
      const result = await Promise.allSettled(promises);
      const complexMap = {};
      for (const complex of result[1].value.data.data) {
        complexMap[complex.id] = complex.name;
      }

      setUsers(
        result[0].value.data.data.map((user) => ({
          ...user,
          complex: complexMap[user.complexId],
        }))
      );
      setComplexes(result[1].value.data.data);
    } catch (error) {
      console.log({ error });
    }
    dispatch(finishLoader());
  };

  React.useEffect(() => {
    fetchUsers();
  }, []);

  const nameRef = useRef(null),
    passwordRef = useRef(null),
    emailRef = useRef(null),
    confirmPasswordRef = useRef(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (passwordRef.current.value !== confirmPasswordRef.current.value) {
      alert("'Password' dhe 'Konfirmo Password' duhet te jene te njejte");
    }

    try {
      await axiosInstance.post(
        process.env.REACT_APP_BASE_API + "/users-complexes",
        {
          email: emailRef.current.value,
          password: passwordRef.current.value,
          name: nameRef.current.value,
          complexId: selectedComplex.id,
        }
      );
      setSelectedComplex(null);
      alert("Perdoruesi u krijua me sukses");
      fetchUsers();
    } catch (error) {
      alert("Perdoruesi nuk u krijua");
      console.log(error);
    }
  };

  return (
    <Grid
      container
      sx={{
        minHeight: "calc(100vh - 48px)",
      }}
    >
      <Grid item xs={8}>
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
      <Grid xs={4}>
        <form onSubmit={handleSubmit}>
          <Box m={2}>
            <TextField
              type="text"
              name="name"
              label="Emri"
              fullWidth
              inputRef={nameRef}
              required
            />
          </Box>
          <Box m={2}>
            <TextField
              type="email"
              name="email"
              label="Email"
              fullWidth
              inputRef={emailRef}
              required
            />
          </Box>
          <Box m={2}>
            <TextField
              type="password"
              name="password"
              label="Password"
              fullWidth
              inputRef={passwordRef}
              required
            />
          </Box>
          <Box m={2}>
            <TextField
              type="password"
              name="confirmPassword"
              label="Konfirmo Password"
              fullWidth
              inputRef={confirmPasswordRef}
              required
            />
          </Box>
          <Box m={2}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Kompleksi</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={complexes?.[0]?.name}
                label="Kompleksi"
                onChange={(event) => setSelectedComplex(event.target.value)}
              >
                {complexes?.map((field) => (
                  <MenuItem key={field.id} value={field}>
                    {field?.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Box m={2}>
            <Button variant="contained" type="submit">
              <span style={{ color: "white" }}>Krijo perdorues kompleksi</span>
            </Button>
          </Box>
        </form>
      </Grid>
    </Grid>
  );
}
