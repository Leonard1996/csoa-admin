import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import {
  Grid,
  TextField,
  Box,
  Checkbox,
  FormControlLabel,
  Typography,
  Autocomplete,
} from "@mui/material";
import DialogTitle from "@mui/material/DialogTitle";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { finishLoader, startLoader } from "../../../../features/user/userSlice";
import axiosInstance from "../../../../common/helpers/axios.instance";
import FileBase64 from "react-file-base64";
import BusinessesViewForm from "./BusinessesViewForm";
import BusinessReserveForm from "./BusinessReserveForm";
import BusinessCalendarModal from "./BusinessCalendarModal";
import { CITIES } from "../../../../common/constans/constants";

export const sports = ["Futboll", "Basketboll", "Volejboll", "Tenis"];
export const facilities = [
  "Fushë e mbyllur",
  "Dushe",
  "Kënd Lojrash",
  "Bar",
  "Parkim",
];

export default function BusinessModal({ isOpen, handleClose, type, business }) {
  const types = {
    create: {
      size: "sm",
      component: (props) => <CreateForm {...props} />,
    },
    edit: {
      size: "sm",
      component: (props) => {
        return <BusinessesViewForm {...props} />;
      },
    },
    reserve: {
      size: "xl",
      component: (props) => {
        return <BusinessReserveForm {...props} />;
      },
    },
    calendar: {
      size: "xl",
      component: (props) => {
        return <BusinessCalendarModal {...props} />;
      },
    },
  };

  const dispatch = useDispatch();

  const handleSubmit = async (fields) => {
    dispatch(startLoader());
    try {
      await axiosInstance.post(
        process.env.REACT_APP_BASE_API + "/complexes",
        fields
      );
    } catch (error) {
      console.log({ error });
    }
    dispatch(finishLoader());
    handleClose();
  };

  const handleUpdate = async (fields) => {
    dispatch(startLoader());
    try {
      await axiosInstance.patch(
        process.env.REACT_APP_BASE_API + "/complexes",
        fields
      );
    } catch (error) {
      console.log({ error });
    }
    dispatch(finishLoader());
    handleClose();
  };

  return (
    <Dialog
      fullWidth={true}
      maxWidth={types[type]?.size}
      open={isOpen}
      onClose={handleClose}
    >
      {types[type]?.component({
        handleSubmit,
        handleClose,
        business,
        handleUpdate,
      })}
    </Dialog>
  );
}

const CreateForm = ({ handleClose, handleSubmit }) => {
  const isLoading = useSelector((state) => state.user.isLoading);
  const nameRef = React.useRef(null);
  const phoneRef = React.useRef(null);
  const addressRef = React.useRef(null);
  const [city, setCity] = React.useState();
  const longitudeRef = React.useRef(null);
  const latitudeRef = React.useRef(null);
  const [checks, setChecks] = React.useState({
    Futboll: false,
    Basketboll: false,
    Volejboll: false,
    Tenis: false,
    "Fushë e mbyllur": false,
    Dushe: false,
    "Kënd Lojrash": false,
    Bar: false,
    Parkim: false,
  });
  const [file, setFile] = React.useState();
  const [fileBanner, setFileBanner] = React.useState();
  return (
    <>
      <DialogTitle color="primary">Fusni te dhenat e komplekist</DialogTitle>
      <DialogContent>
        <Grid container>
          <Grid item xs={12}>
            <Grid container>
              <Grid item xs={12}>
                <Box marginTop={1}>
                  <TextField
                    label="Emri"
                    inputRef={nameRef}
                    name="name"
                    fullWidth
                  />
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box marginY={1}>
                  <TextField
                    label="Telefoni"
                    inputRef={phoneRef}
                    name="phone"
                    fullWidth
                  />
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box marginY={1}>
                  <Autocomplete
                    disablePortal
                    options={CITIES}
                    sx={{ width: "100%" }}
                    onChange={(e, city) => setCity(city)}
                    renderInput={(params) => (
                      <TextField {...params} label="Qyteti" fullWidth />
                    )}
                  />
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box marginY={1}>
                  <TextField
                    label="Adresa"
                    inputRef={addressRef}
                    name="address"
                    fullWidth
                  />
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box marginY={1}>
                  <TextField
                    label="Gjeresia gjeografike"
                    inputRef={latitudeRef}
                    name="latitude"
                    fullWidth
                  />
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box marginY={1}>
                  <TextField
                    label="Gjatesia gjeografike"
                    inputRef={longitudeRef}
                    name="longitude"
                    fullWidth
                  />
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box marginY={1}>
                  <Typography variant="body1" color="primary">
                    Zgjidhni sportet
                  </Typography>
                  {sports.map((sport) => (
                    <FormControlLabel
                      key={sport}
                      value={sport}
                      control={<Checkbox checked={checks[sport]} />}
                      label={sport}
                      labelPlacement="end"
                      onChange={() =>
                        setChecks((prevState) => ({
                          ...prevState,
                          [sport]: !prevState[sport],
                        }))
                      }
                    />
                  ))}
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box marginBottom={1}>
                  <Typography variant="body1" color="primary">
                    Zgjidhni sherbimet
                  </Typography>
                  {facilities.map((facility) => (
                    <FormControlLabel
                      key={facility}
                      value={facility}
                      control={<Checkbox checked={checks[facility]} />}
                      label={facility}
                      labelPlacement="end"
                      onChange={() =>
                        setChecks((prevState) => ({
                          ...prevState,
                          [facility]: !prevState[facility],
                        }))
                      }
                    />
                  ))}
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box marginBottom={1}>
                  <Typography variant="body1" color="primary">
                    Ngarkoni foton e profilit te kompleksit
                  </Typography>
                  <div>
                    <FileBase64 multiple={false} onDone={setFile} />
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => setFile()}
                      sx={{
                        maxHeight: "21px",
                        maxWidth: "253px",
                      }}
                    >
                      Fshij foton
                    </Button>
                  </div>

                  <Box paddingY={1}>
                    {file?.base64 && (
                      <img height="auto" width={200} src={file.base64} />
                    )}
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box marginBottom={1}>
                  <Typography variant="body1" color="primary">
                    Ngarkoni foton e banerit te kompleksit
                  </Typography>
                  <div>
                    <FileBase64 multiple={false} onDone={setFileBanner} />
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => setFileBanner()}
                      sx={{
                        maxHeight: "21px",
                        maxWidth: "253px",
                      }}
                    >
                      Fshij foton
                    </Button>
                  </div>

                  <Box paddingY={1}>
                    {fileBanner?.base64 && (
                      <img hight="auto" width={200} src={fileBanner.base64} />
                    )}
                  </Box>
                </Box>
              </Grid>
            </Grid>
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
          onClick={() => {
            handleSubmit({
              name: nameRef.current.value,
              phone: phoneRef.current.value,
              address: addressRef.current.value,
              city,
              longitude: longitudeRef.current.value,
              latitude: latitudeRef.current.value,
              ...checks,
              avatar: file?.base64,
              banner: fileBanner?.base64,
            });
          }}
          variant="contained"
          color="primary"
        >
          <span style={{ color: "white" }}>Ruaj</span>
        </Button>
      </DialogActions>
    </>
  );
};
