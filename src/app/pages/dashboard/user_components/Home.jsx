import { Grid, TextField } from "@mui/material";
import { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../../../../common/helpers/axios.instance";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import { Checkbox, Divider, Button, Typography } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import FileBase64 from "react-file-base64";
import { FileUploader } from "react-drag-drop-files";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import Autocomplete from "@mui/material/Autocomplete";
import { CITIES } from "../../../../common/constans/constants";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import TabPanel from "./TabPanel";
import FieldForm from "./FieldForm";
import FinalStep from "./FinalStep";
import { updateComplexId } from "../../../../features/user/userSlice";

const fileTypes = ["JPG", "PNG", "GIF", "JPEG"];
const inputs = [
  { type: "text", name: "name", label: "Emri" },
  { type: "text", name: "phone", label: "Nr. telefonit" },
  { type: "number", name: "longitude", label: "Gjatesia gjeografike" },
  { type: "number", name: "latitude", label: "Gjeresia gjeografike" },
  { type: "text", name: "address", label: "Adresa" },
];

const checkboxes = [
  { name: "Bar", value: false },
  { name: "Dushe", value: false },
  { name: "Parkim", value: false },
  { name: "Kënd Lojrash", value: false },
  { name: "Fushë e mbyllur", value: false },
];

const sports = [
  { name: "Futboll", value: false },
  { name: "Tenis", value: false },
  { name: "Volejboll", value: false },
  { name: "Basketboll", value: false },
];

function loadXHR(url) {
  return new Promise(function (resolve, reject) {
    try {
      var xhr = new XMLHttpRequest();
      xhr.open("GET", process.env.REACT_APP_BASE_API + "/" + url);
      xhr.responseType = "blob";
      xhr.onerror = function () {
        reject("Network error.");
      };
      xhr.onload = function () {
        if (xhr.status === 200) {
          resolve(xhr.response);
        } else {
          reject("Loading error:" + xhr.statusText);
        }
      };
      xhr.send();
    } catch (err) {
      reject(err.message);
    }
  });
}

export default function Home() {
  const [stats, setStats] = useState({
    fromPanel: 0,
    fromApp: 0,
  });

  const [fileBanner, setFileBanner] = useState();
  const [fileAvatar, setFileAvatar] = useState();
  const [fields, setFields] = useState({
    locations: [],
  });
  const [files, setFiles] = useState([]);
  const [entries, setEntries] = useState([]);
  const [step, setStep] = useState(0);
  const [requestState, setRequestState] = useState({
    isError: false,
    isSuccess: false,
    isLoading: false,
  });

  const [current, setCurrent] = useState(0);

  const complexId = useSelector((state) => state.user.user.complexId);

  const fetchStatistics = async () => {
    let statistics = null;
    let fromApp = null;
    try {
      if (complexId) {
        statistics = await axiosInstance.get(
          process.env.REACT_APP_BASE_API + `/dashboard-statistics/${complexId}`
        );
        fromApp = statistics.data.data.filter(
          (s) => s.isUserReservation
        ).length;
      }

      setStats({
        fromPanel: statistics ? statistics.data.data.length - fromApp : 0,
        fromApp: fromApp ?? 0,
      });
    } catch (error) {
      console.log({ error });
    }
  };

  const fetchComplexData = async () => {
    if (complexId) {
      try {
        const result = await axiosInstance(
          process.env.REACT_APP_BASE_API + "/complexes/" + complexId
        );
        setFileAvatar({ base64: result.data.data.complex[0]?.avatar });
        setFileBanner({ base64: result.data.data.complex[0]?.banner });
        delete result.data.data.complex[0].avatar;
        delete result.data.data.complex[0].banner;
        const from = new Date();
        from.setMinutes(0);
        const to = new Date();
        to.setMinutes(0);
        const entries = [];
        const files = [];
        const promises = [];
        for (const attachment of result.data.data.complex?.[0].attachments) {
          promises.push(loadXHR(attachment.name));
        }

        const blobs = await Promise.all(promises);
        blobs.forEach((blob, _index) => {
          const file = new File(
            [blob],
            result.data.data.complex?.[0].attachments[_index].originalName
          );
          const objectFile = {};
          for (const key in file) {
            objectFile[key] = file[key];
          }
          files.push({
            ...objectFile,
            url: URL.createObjectURL(file),
          });
          entries.push(file);
        });

        setEntries(entries);
        setFiles(files);

        setFields({
          ...result.data.data.complex?.[0],
          ...result.data.data.complex?.[0]?.facilities,
          ...result.data.data.complex?.[0]?.sports,
          from: from.setHours(
            +result.data.data.complex?.[0]?.workingHours.from
          ),
          to: to.setHours(+result.data.data.complex?.[0]?.workingHours.to),
          locations: [],
        });
      } catch (error) {
        console.log(error);
        alert("Ndodhi nje gabim!");
      }
    }
  };

  useEffect(() => {
    fetchComplexData();
    fetchStatistics();
  }, []);

  const handleFileChange = async (entries) => {
    setCurrent((c) => c + 1);
    if (files.length + entries.length > 10) {
      alert("Nuk mund te ngarkoni me shume se 10 imazhe");
      return;
    }
    setEntries((e) => Array.from(entries).concat(e));
    let entriesWithUrl = [...entries].map(async (entry) => {
      const fileContents = {};
      for (const attribute in entry) {
        fileContents[attribute] = entry[attribute];
      }
      return {
        ...fileContents,
        url: URL.createObjectURL(entry),
      };
    });
    entriesWithUrl = await Promise.all(entriesWithUrl);
    setFiles((prevFiles) => [...prevFiles, ...entriesWithUrl]);
  };

  const handleDeleteFile = (file) => {
    console.log(file, entries, files);
    const updatedEntries = Array.from(entries).filter(
      (f) => f.name !== file.name
    );

    const updatedFiles = files.filter((f) => f.name !== file.name);
    setEntries(updatedEntries);
    setFiles(updatedFiles);
  };

  const dispatch = useDispatch();

  useEffect(() => {
    fetchComplexData();
  }, [complexId]);

  const handleSubmit = async () => {
    try {
      setRequestState((s) => ({ ...s, isLoading: true }));

      const formData = new FormData();

      formData.append(
        "fields",
        JSON.stringify({ ...fields, fileAvatar, fileBanner, complexId })
      );

      for (const entry of entries) {
        formData.append("files", entry);
      }

      const result = await axiosInstance.post(
        process.env.REACT_APP_BASE_API + `/v2/complexes`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setRequestState((s) => ({ ...s, isLoading: false, isSuccess: true }));
      dispatch(updateComplexId(result.data.data));
    } catch (error) {
      console.log({ error });
      setRequestState({ isLoading: false, isError: true, isSuccess: false });
    }
    setTimeout(() => {
      setRequestState({ isSuccess: false, isLoading: false, isError: false });
    }, 2500);
  };
  return (
    <>
      <Grid container>
        <Box m={2}>
          {" "}
          <Card>
            <CardContent>
              Rezervime nga paneli per kete muaj: {stats.fromPanel}
            </CardContent>
          </Card>
        </Box>
        <Box m={2}>
          <Card>
            <CardContent>
              Rezervime nga aplikacioni per kete muaj: {stats.fromApp}
            </CardContent>
          </Card>
        </Box>
      </Grid>
      <Grid container>
        <Grid
          item
          xs={12}
          sx={{
            justifyContent: "center",
            display: "flex",
            marginTop: "32px",
            padding: "16px",
          }}
        >
          <Card sx={{ width: "100%", minHeight: "600px" }}>
            <CardContent>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                  value={step}
                  onChange={(e, value) => {
                    if (value !== 2)
                      setFields((f) => ({ ...f, locations: [] }));
                    setStep(value);
                  }}
                >
                  <Tab label="Krijo / Modifiko Kompleksin" />
                  <Tab label="Krijo Fusha" />
                  <Tab label="Perfundo" />
                </Tabs>
              </Box>
              <TabPanel step={step} index={0}>
                <Box m={2}>
                  <form>
                    <Grid container columnGap={1}>
                      <Grid item xs={4}>
                        <Grid container rowSpacing={2}>
                          {inputs.map((input) => (
                            <Grid item xs={12} key={input.name}>
                              <TextField
                                type={input.type}
                                name={input.name}
                                label={input.label}
                                fullWidth
                                value={fields[input.name] ?? ""}
                                onChange={(e) =>
                                  setFields((f) => ({
                                    ...f,
                                    [e.target.name]: e.target.value,
                                  }))
                                }
                              />
                            </Grid>
                          ))}
                          <Grid item xs={12}>
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
                                  onChange={(e) =>
                                    setFields((f) => ({
                                      ...f,
                                      rawCity: e.target.value,
                                    }))
                                  }
                                />
                              )}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={7}>
                        <Grid container>
                          {checkboxes.map((checkbox, index) => (
                            <Grid
                              item
                              xs={index < 3 ? 2 : 3}
                              key={checkbox.name}
                            >
                              <Checkbox
                                checked={Boolean(fields[checkbox.name])}
                                onChange={(e) =>
                                  setFields((f) => ({
                                    ...f,
                                    [checkbox.name]: e.target.checked,
                                  }))
                                }
                              />

                              {checkbox.name}
                            </Grid>
                          ))}
                          <Grid item xs={12}>
                            <Divider />
                          </Grid>
                          {sports.map((sport, index) => (
                            <Grid item xs={index < 3 ? 2 : 3} key={sport.name}>
                              <Checkbox
                                checked={Boolean(fields[sport.name])}
                                onChange={(e) =>
                                  setFields((f) => ({
                                    ...f,
                                    [sport.name]: e.target.checked,
                                  }))
                                }
                              />

                              {sport.name}
                            </Grid>
                          ))}
                          <Grid item xs={12}>
                            <Box marginBottom={2}>
                              <Divider />
                            </Box>
                          </Grid>
                          <Grid item xs={2} />
                          <Grid item xs={4}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <TimePicker
                                label="Hapet ne oren"
                                value={fields?.from ?? new Date()}
                                name="from"
                                onChange={(e) =>
                                  setFields((f) => ({ ...f, from: e?.["$d"] }))
                                }
                                renderInput={(params) => (
                                  <TextField {...params} />
                                )}
                              />
                            </LocalizationProvider>
                          </Grid>
                          <Grid item xs={4}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <TimePicker
                                label="Mbyllet ne oren"
                                name="to"
                                value={fields?.to ?? new Date()}
                                onChange={(e) =>
                                  setFields((f) => ({ ...f, to: e?.["$d"] }))
                                }
                                renderInput={(params) => (
                                  <TextField {...params} />
                                )}
                              />
                            </LocalizationProvider>
                          </Grid>

                          <Grid item xs={4}></Grid>
                          <Grid item xs={12}>
                            <Box margin={2}></Box>
                          </Grid>
                          <Grid item xs={2}></Grid>
                          {/* start of base64 */}

                          <Grid item xs={4}>
                            <Box marginBottom={1}>
                              <Typography variant="body1" color="primary">
                                Ngarkoni foton e banerit te kompleksit
                              </Typography>
                              <div>
                                <FileBase64
                                  multiple={false}
                                  onDone={setFileBanner}
                                />
                                <Button
                                  variant="contained"
                                  color="error"
                                  onClick={() => setFileBanner(null)}
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
                                  <img
                                    hight="auto"
                                    width={150}
                                    src={fileBanner.base64}
                                  />
                                )}
                              </Box>
                            </Box>
                          </Grid>
                          {/* end of base64  */}
                          <Grid item xs={4}>
                            <Box marginBottom={1}>
                              <Typography variant="body1" color="primary">
                                Ngarkoni foton e profilit te kompleksit
                              </Typography>
                              <div>
                                <FileBase64
                                  multiple={false}
                                  onDone={setFileAvatar}
                                />
                                <Button
                                  variant="contained"
                                  color="error"
                                  onClick={() => setFileAvatar(null)}
                                  sx={{
                                    maxHeight: "21px",
                                    maxWidth: "253px",
                                  }}
                                >
                                  Fshij foton
                                </Button>
                              </div>

                              <Box paddingY={1}>
                                {fileAvatar?.base64 && (
                                  <img
                                    height="auto"
                                    width={150}
                                    src={fileAvatar.base64}
                                  />
                                )}
                              </Box>
                            </Box>
                          </Grid>
                          <Grid item xs={12}>
                            <Box marginBottom={1}>
                              <Typography variant="body1" color="primary">
                                Ngarkoni fotot e fushave (max 10)
                              </Typography>
                              <FileUploader
                                key={current}
                                multiple={true}
                                handleChange={handleFileChange}
                                name="file"
                                types={fileTypes}
                                label="Kliko ose terhiq dhe lesho imazhet"
                              />
                            </Box>
                          </Grid>
                          <Grid item xs={12}>
                            <Box p={2}>
                              <Grid container>
                                {files.map((file) => (
                                  <Grid
                                    item
                                    xs={4}
                                    key={Math.floor(
                                      1000000 + Math.random() * 9000000
                                    )}
                                  >
                                    <Box margin={1}>
                                      <div
                                        style={{
                                          position: "relative",
                                        }}
                                      >
                                        <CancelOutlinedIcon
                                          sx={{
                                            fill: "red",
                                            position: "absolute",
                                            right: 2,
                                            top: 0,
                                            cursor: "pointer",
                                          }}
                                          onClick={() => handleDeleteFile(file)}
                                        />
                                        <img
                                          style={{ border: "1px solid black" }}
                                          src={file.url}
                                          height="auto"
                                          width="100%"
                                        />
                                        <Typography variant="caption">
                                          {file.name}
                                        </Typography>
                                      </div>
                                    </Box>
                                  </Grid>
                                ))}
                              </Grid>
                            </Box>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </form>
                </Box>
              </TabPanel>
              <TabPanel step={step} index={1}>
                <FieldForm setFields={setFields} fields={fields} />
              </TabPanel>
              <TabPanel step={step} index={2}>
                <FinalStep
                  handleSubmit={handleSubmit}
                  requestState={requestState}
                />
              </TabPanel>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}
