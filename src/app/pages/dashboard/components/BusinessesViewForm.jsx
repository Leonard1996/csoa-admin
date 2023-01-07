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
  Autocomplete,
} from "@mui/material";
import DialogTitle from "@mui/material/DialogTitle";
import React from "react";
import { useSelector } from "react-redux";
import FileBase64 from "react-file-base64";
import { useEffect } from "react";
import { sports, facilities } from "./BusinessModal";
import { CITIES } from "../../../../common/constans/constants";
import axiosInstance from "../../../../common/helpers/axios.instance";

export default function BusinessesViewForm({
  handleClose,
  handleUpdate,
  business,
}) {
  const isLoading = useSelector((state) => state.user.isLoading);

  const [fields, setFields] = React.useState({
    sports: {
      Futboll: false,
      Basketboll: false,
      Volejboll: false,
      Tenis: false,
    },
    facilities: {
      "Fushë e mbyllur": false,
      Dushe: false,
      "Kënd Lojrash": false,
      Bar: false,
      Parkim: false,
    },
  });

  const handleFile = (field, content) => {
    setFields((prevState) => ({
      ...prevState,
      [field]: content ? content.base64 : null,
    }));
  };

  const fetchImages = async (business) => {
    try {
      const {
        data: {
          data: { banner, avatar },
        },
      } = await axiosInstance(
        process.env.REACT_APP_BASE_API + `/complexes/${business.id}/images`
      );

      setFields({
        ...business,
        banner,
        avatar,
      });
    } catch (error) {
      console.log({ error });
    }
  };

  useEffect(() => {
    fetchImages(business);
  }, [business]);

  const handleChange = (event) => {
    setFields((prevFields) => ({
      ...prevFields,
      [event.target.name]: event.target.value,
    }));
  };
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
                    onChange={handleChange}
                    name="name"
                    fullWidth
                    value={fields.name ?? ""}
                  />
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box marginY={1}>
                  <TextField
                    label="Telefoni"
                    onChange={handleChange}
                    name="phone"
                    fullWidth
                    value={fields.phone ?? ""}
                  />
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box marginY={1}>
                  <Autocomplete
                    disablePortal
                    options={CITIES}
                    value={fields?.city ?? ""}
                    sx={{ width: "100%" }}
                    onChange={(e, city) =>
                      setFields((f) => ({
                        ...f,
                        city,
                      }))
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Qyteti"
                        fullWidth
                        value={fields?.city ?? ""}
                      />
                    )}
                  />
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box marginY={1}>
                  <TextField
                    label="Adresa"
                    onChange={handleChange}
                    name="address"
                    fullWidth
                    value={fields.address ?? ""}
                  />
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box marginY={1}>
                  <TextField
                    label="Gjeresia gjeografike"
                    onChange={handleChange}
                    name="latitude"
                    fullWidth
                    value={fields.latitude ?? ""}
                  />
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box marginY={1}>
                  <TextField
                    label="Gjatesia gjeografike"
                    onChange={handleChange}
                    name="longitude"
                    fullWidth
                    value={fields.longitude ?? ""}
                  />
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box marginY={1}>
                  <Typography variant="body1" color="primary">
                    Zgjidhni sportet
                  </Typography>
                  {sports.map((sport) => {
                    return (
                      <FormControlLabel
                        key={sport}
                        value={sport ?? ""}
                        control={
                          <Checkbox
                            checked={Boolean(fields?.sports?.[sport]) ?? null}
                          />
                        }
                        label={sport}
                        labelPlacement="end"
                        onChange={() =>
                          setFields((prevState) => {
                            return {
                              ...prevState,
                              sports: {
                                ...prevState?.sports,
                                [sport]: !prevState?.sports?.[sport],
                              },
                            };
                          })
                        }
                      />
                    );
                  })}
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
                      value={facility ?? ""}
                      control={
                        <Checkbox
                          checked={fields?.facilities?.[facility] ?? null}
                        />
                      }
                      label={facility}
                      labelPlacement="end"
                      onChange={() =>
                        setFields((prevState) => {
                          return {
                            ...prevState,
                            facilities: {
                              ...prevState?.facilities,
                              [facility]: !prevState?.facilities?.[facility],
                            },
                          };
                        })
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
                    <FileBase64
                      multiple={false}
                      onDone={(banner) => handleFile("avatar", banner)}
                    />
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleFile("avatar")}
                      sx={{
                        maxHeight: "21px",
                        maxWidth: "253px",
                      }}
                    >
                      Fshij foton
                    </Button>
                  </div>

                  <Box paddingY={1}>
                    {fields?.avatar && (
                      <img height="auto" width={200} src={fields?.avatar} />
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
                    <FileBase64
                      multiple={false}
                      onDone={(banner) => handleFile("banner", banner)}
                    />
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleFile("banner")}
                      sx={{
                        maxHeight: "21px",
                        maxWidth: "253px",
                      }}
                    >
                      Fshij foton
                    </Button>
                  </div>

                  <Box paddingY={1}>
                    {fields?.banner && (
                      <img hight="auto" width={200} src={fields?.banner} />
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
          onClick={() => handleUpdate(fields)}
          variant="contained"
          color="primary"
        >
          <span style={{ color: "white" }}>Ruaj</span>
        </Button>
      </DialogActions>
    </>
  );
}
