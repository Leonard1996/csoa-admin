import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import { Grid, TextField, Box, Checkbox } from "@mui/material";
import DialogTitle from "@mui/material/DialogTitle";
import React from "react";
import { useSelector } from "react-redux";
import { DataGrid } from "@mui/x-data-grid";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import axiosInstance from "../../../../common/helpers/axios.instance";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import dateHelper from "../../../../common/helpers/dateHelper";
import { useState } from "react";
import moment from "moment/moment";
import styles from "./Business.module.css";
import { useEffect } from "react";
import InfoIcon from "@mui/icons-material/Info";
import Tooltip from "@mui/material/Tooltip";

export default function BusinessCalendarModal({
  handleClose,
  business,
  isComplex = false,
}) {
  const today = new Date();
  const [slots, setSlots] = useState({});
  const role = useSelector((state) => state?.user?.user?.role);

  function generateSlots(from, to) {
    const columnsMap = {};

    to = to < from ? 24 + to : to;
    for (let i = to; i > from; i -= activeField?.slotRange / 60) {
      const date = moment(new Date(day.from).setHours(from, 0, 0, 0))
        .add((to - i) * 60, "m")
        .toDate();

      columnsMap[date] = {
        isEmpty: true,
        id: date,
        eventId: null,
        startDate: date,
        endDate: moment(date).add(activeField?.slotRange, "m").toDate(),
      };
    }
    setSlots(columnsMap);
  }

  const [checked, setChecked] = useState({});
  const [isWeekly, setIsWeekly] = useState(false);

  const handleCheckChange = (_event, value, row) => {
    if (value === true) {
      let conditions = 0;
      const endDates = Object.values(checked).map((entries) =>
        JSON.stringify(entries.endDate)
      );

      const startDates = Object.values(checked).map((entries) =>
        JSON.stringify(entries.startDate)
      );

      if (endDates.length && !endDates.includes(JSON.stringify(row.id))) {
        _event.preventDefault();
        _event.stopPropagation();
        conditions++;
      }

      if (
        startDates.length &&
        !startDates.includes(JSON.stringify(row.endDate))
      ) {
        _event.preventDefault();
        _event.stopPropagation();
        conditions++;
      }

      if (conditions === 2) return;
    }

    if (value === false) {
      const orderedDates = Object.values(checked).sort(
        (a, b) => b.startDate - a.startDate
      );
      if (
        JSON.stringify(orderedDates[0].startDate) !== JSON.stringify(row.id) &&
        JSON.stringify(orderedDates[orderedDates.length - 1].startDate) !==
          JSON.stringify(row.id)
      ) {
        _event.preventDefault();
        _event.stopPropagation();
        return;
      }
      const newChecks = JSON.parse(JSON.stringify(checked));
      delete newChecks[row.id];
      setChecked(newChecks);
      return;
    }

    setChecked((prevChecks) => {
      return {
        ...prevChecks,
        [row.id]: {
          startDate: row.startDate,
          endDate: row.endDate,
          value,
        },
      };
    });
  };

  useEffect(() => {
    setChecked({});
  }, [slots]);

  const handleEventClick = async (eventId, groupId) => {
    try {
      const result = window.confirm("Jeni te sigurt qe doni te vazhdoni?");
      if (!result) return;
      await axiosInstance.patch(
        process.env.REACT_APP_BASE_API +
          `/v2/events/${eventId}/confirm?weeklyGroupedId=${groupId}`
      );
      fetchEventsByFieldId(activeField);
      alert("Eventi u Konfirmua");
    } catch (error) {
      alert("Event nuk u konfirmua!");
    }
  };

  const handleDeleteClick = async (eventId, groupId) => {
    const isConfirm = window.confirm(
      "Jeni i sigurt qe doni te refuzoni eventin?"
    );
    if (!isConfirm) return;
    try {
      await axiosInstance.delete(
        process.env.REACT_APP_BASE_API +
          "/events/" +
          eventId +
          "?weeklyGroupedId=" +
          groupId
      );
    } catch (error) {
      console.log({ error });
      alert("Eventi nuk mund te fshihej");
    }
    window.location.reload();
  };

  const handleCancelClick = async (eventId, groupId) => {
    try {
      await axiosInstance.delete(
        process.env.REACT_APP_BASE_API +
          "/events/" +
          eventId +
          "/cancel?weeklyGroupedId=" +
          groupId
      );
    } catch (error) {
      console.log({ error });
      alert("Eventi nuk mund te anullohej");
    }
    window.location.reload();
  };

  const columns = [
    {
      field: "name",
      headerName: "Emri i eventit",
      width: 200,
      renderCell: (params) => {
        if (!params.row.isEmpty) {
          const { startDate, endDate } = params.row;
          const today = new Date(day.from).getDate();
          return (
            <div style={{ display: "flex", justifyContent: "space-evenly" }}>
              <div>{params.row.name}</div>
              {Boolean(params.row.isWeekly) && (
                <Tooltip title={`Kujdes! Ky event është javor `}>
                  <InfoIcon />
                </Tooltip>
              )}
            </div>
          );
        }
        return (
          <Checkbox
            disabled={params.row.id < new Date()}
            key={params.row.id}
            checked={Boolean(checked[params?.row?.id]?.value)}
            onChange={(event, value) =>
              handleCheckChange(event, value, params.row)
            }
          />
        );
      },
    },
    {
      field: "organiser",
      headerName: "Organizatori",
      width: 200,
      options: {
        sort: true,
      },
    },
    {
      field: "organiserPhone",
      headerName: "Tel. i Klientit",
      width: 250,
    },
    {
      field: "phoneNumber",
      headerName: "Tel i organizatori",
      width: 200,
      options: {
        sort: true,
      },
    },
    {
      headerName: "Lloji",
      width: 200,
      valueGetter: (params) => {
        if (params.row.isWeekly !== undefined) {
          return params.row.isWeekly ? "I perhershem" : "Ditor";
        }
        return "";
      },
      options: {
        sort: true,
      },
    },
    {
      field: "startDate",
      headerName: "Data (fillon)",
      width: 200,
      valueGetter: (params) => dateHelper(params.row.startDate),
      options: {
        sort: true,
      },
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
      width: 100,
    },
    {
      field: "id",
      headerName: "Veprime",
      width: 500,
      renderCell: (params) => {
        if (params.row.eventId) {
          if (params.row.status === "confirmed")
            return (
              <>
                <Box marginRight={1}>
                  <Button variant="contained" disabled>
                    Konfirmuar
                  </Button>
                </Box>
                <Button
                  variant="contained"
                  onClick={() => handleCancelClick(params.row.eventId)}
                >
                  Anullo Eventin
                </Button>
                {params.row.weeklyGroupedId && (
                  <Box marginLeft={1}>
                    <Button
                      variant="contained"
                      onClick={() =>
                        handleCancelClick(
                          params.row.eventId,
                          params.row.weeklyGroupedId
                        )
                      }
                    >
                      Anullo Abonimin
                    </Button>
                  </Box>
                )}
              </>
            );
          return (
            <>
              <Box p={1}>
                <Button
                  disabled={
                    role === "admin" ||
                    new Date() > new Date(params.row.startDate)
                  }
                  variant="contained"
                  onClick={() => {
                    if (role === "admin") {
                      return console.log("o daku");
                    }
                    handleEventClick(
                      params.row.eventId,
                      params.row.weeklyGroupedId
                    );
                  }}
                >
                  Prano Eventin
                </Button>
              </Box>
              <Button
                disabled={
                  role === "admin" ||
                  new Date() > new Date(params.row.startDate)
                }
                variant="contained"
                onClick={() => {
                  if (role === "admin") {
                    return console.log("o daku");
                  }
                  handleDeleteClick(
                    params.row.eventId,
                    params.row.weeklyGroupedId
                  );
                }}
              >
                Refuzo Eventin
              </Button>
            </>
          );
        }
        return <p></p>;
      },
    },
    { field: "notes", headerName: "Shenime", width: 200 },
  ];

  const [day, setDay] = React.useState({
    from: new Date(
      today.setUTCHours(
        +business.workingHours.from + new Date().getTimezoneOffset() / 60,
        0,
        0,
        0
      )
    ),
    to: new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() +
        (business.workingHours.to < business.workingHours.from ? 1 : 0),
      business.workingHours.from + new Date().getTimezoneOffset() / 60,
      0,
      0
    ),
  });

  const [events, setEvents] = React.useState([]);
  const [fields, setFields] = React.useState([]);
  const [activeField, setActiveField] = React.useState();

  const isLoading = useSelector((state) => state.user.isLoading);

  const handleChange = (value) => {
    if (!value) return;
    const from = new Date(
      value["$y"],
      value["$M"],
      value["$D"],
      +business.workingHours.from + new Date().getTimezoneOffset() / 60,
      0,
      0
    );
    const to = new Date(
      value["$y"],
      value["$M"],
      value["$D"] +
        (business.workingHours.to < business.workingHours.from ? 1 : 0),
      +business.workingHours.from + new Date().getTimezoneOffset() / 60,
      0,
      0
    );
    setDay({
      from,
      to,
    });
  };

  const fetchEventsByFieldId = async (location) => {
    try {
      const events = await axiosInstance.post(
        process.env.REACT_APP_BASE_API +
          `/complexes/${business?.id}/locations/${location.id}/events`,
        day
      );
      for (const element of events.data.data.events) {
        const duration =
          (new Date(element.endDate) - new Date(element.startDate)) /
          (1000 * 60 * 60);
        let numberOfSlots = duration / (activeField?.slotRange / 60);
        for (let i = 0; i < numberOfSlots; i++) {
          const time = moment(new Date(element.startDate))
            .add(activeField?.slotRange * i, "m")
            .toDate();
          delete slots[time];
          slots[time] = {
            ...element,
            startDate: time,
            id: time,
            eventId: element.id,
            isEmpty: false,
            endDate: moment(time).add(activeField?.slotRange, "m").toDate(),
          };
        }
      }
      setEvents(Object.values(slots).sort((a, b) => a.startDate - b.startDate));
      // setSlots({});
    } catch (error) {
      console.log({ error });
    }
  };

  const fetchFieldsByComplex = async () => {
    try {
      const fields = await axiosInstance.get(
        process.env.REACT_APP_BASE_API + `/complexes/${business?.id}/locations/`
      );
      setFields(fields.data.data.locations);
      if (fields.data.data.locations?.length) {
        setActiveField(fields.data.data.locations[0]);
        fetchEventsByFieldId(fields.data.data.locations[0]);
      }
    } catch (error) {
      console.log({ error });
    }
  };

  React.useEffect(() => {
    fetchFieldsByComplex();
  }, []);

  React.useEffect(() => {
    generateSlots(
      +business.workingHours.from,
      +business.workingHours.to,
      day.from
    );
  }, [day.from, activeField]);

  React.useEffect(() => {
    fetchEventsByFieldId(activeField);
  }, [slots]);

  const handleSubmit = (event) => {
    event.preventDefault();
    let values = Object.values(checked);
    if (!values.length) alert("Zgjidhni orarin e rezervimit");
    values = values
      .map((value) => ({
        startDate: new Date(value.startDate),
        endDate: new Date(value.endDate),
      }))
      .sort((a, b) => a.startDate - b.startDate);
    const period = {
      startDate: values[0].startDate,
      endDate: values[values.length - 1].endDate,
    };

    createEvent({
      ...period,
      ...inputs,
      locationId: activeField.id,
      sport:
        (activeField?.isFootball && "football") ??
        (activeField?.isBasketball && "basketball") ??
        (activeField?.isTennis && "tenis") ??
        (activeField?.isVolleyball && "voleyball"),
      isWeekly,
    });
  };

  const createEvent = async (data) => {
    try {
      await axiosInstance.post(
        process.env.REACT_APP_BASE_API + "/admin/events",
        data
      );

      await fetchEventsByFieldId(activeField);
      setChecked({});
    } catch (error) {
      console.log({ error });
      alert(error?.response?.data?.message);
      await fetchEventsByFieldId(activeField);
      setChecked({});
    }
  };

  const [inputs, setInputs] = useState({
    name: "",
    notes: "",
  });

  const handleInputsChange = (event) => {
    setInputs((prevInputs) => ({
      ...prevInputs,
      [event.target.name]: event.target.value,
    }));
  };

  return (
    <React.Fragment>
      {isComplex ? (
        <>
          <Box paddingY={4} paddingX={4} sx={{ display: "flex" }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DesktopDatePicker
                label="Data e fillimit te eventit"
                inputFormat="DD/MM/YYYY"
                value={day.from}
                onChange={(value) => handleChange(value)}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
            <FormControl sx={{ width: 400 }}>
              <InputLabel id="demo-simple-select-label">
                {activeField?.name}
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={activeField?.name}
                label={activeField?.name}
                onChange={(event) => setActiveField(event.target.value)}
              >
                {fields?.map((field) => (
                  <MenuItem key={field.id} value={field}>
                    {field?.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Grid
            container
            sx={{
              minHeight: "700px",
            }}
          >
            <Grid item xs={12} sx={{ height: "65vh", marginBottom: "8px" }}>
              <Box
                sx={{
                  height: "100%",
                  width: "100%",
                  "& .waiting": {
                    bgcolor: "#F7E0E0",
                    "&:hover": {
                      bgcolor: "#fff",
                    },
                  },
                  "& .completed": {
                    bgcolor: "#E1F4ED",
                    "&:hover": {
                      bgcolor: "#fff",
                    },
                  },
                }}
              >
                <DataGrid
                  getRowClassName={(params) => {
                    if (params.row.status === "waiting_for_confirmation") {
                      return "waiting";
                    }
                    if (params.row.status === "confirmed") {
                      return "completed";
                    }
                  }}
                  sx={{
                    "&.MuiDataGrid-root": {
                      ".MuiDataGrid-columnHeaderTitleContainer": {
                        color: "#08C47C",
                        fontSize: "1.1rem",
                      },
                    },
                  }}
                  rows={events || []}
                  columns={columns}
                  pageSize={24}
                />
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Grid container>
                <Grid item xs={12}>
                  <Box padding={4}>
                    <form onSubmit={handleSubmit}>
                      <Grid container>
                        <Grid item xs={12}>
                          <Box marginBottom={2}>
                            <TextField
                              type="text"
                              label="Emri"
                              name="name"
                              fullWidth
                              onChange={handleInputsChange}
                              required
                            />
                          </Box>
                        </Grid>
                        <Grid item xs={12}>
                          <Box marginBottom={2}>
                            <TextField
                              type="text"
                              label="Tel. i Organizatorit"
                              name="organiserPhone"
                              fullWidth
                              onChange={handleInputsChange}
                              required
                            />
                          </Box>
                        </Grid>
                        <Grid item xs={12}>
                          <textarea
                            placeholder="Shenime..."
                            name="notes"
                            className={styles.notes}
                            onChange={handleInputsChange}
                            required
                          />
                        </Grid>
                        <Grid item xs={12}>
                          I perhershem (rezervimi zgjat 12 javë)
                          <Checkbox
                            checked={isWeekly}
                            onChange={(e) => setIsWeekly(e.target.checked)}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Button variant="contained" type="submit">
                            Rezervo
                          </Button>
                        </Grid>
                      </Grid>
                    </form>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </>
      ) : (
        <>
          <DialogTitle color="primary">Kalendari</DialogTitle>
          <DialogContent>
            <Box paddingY={1} sx={{ display: "flex" }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DesktopDatePicker
                  label="Data e fillimit te eventit"
                  inputFormat="DD/MM/YYYY"
                  value={day.from}
                  onChange={(value) => handleChange(value)}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
              <FormControl sx={{ width: 400 }}>
                <InputLabel id="demo-simple-select-label">
                  {activeField?.name}
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={activeField?.name}
                  label={activeField?.name}
                  onChange={(event) => setActiveField(event.target.value)}
                >
                  {fields?.map((field) => (
                    <MenuItem key={field.id} value={field}>
                      {field?.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Grid
              container
              sx={{
                minHeight: "700px",
              }}
            >
              <Grid item xs={12} sx={{ height: "65vh", marginBottom: "8px" }}>
                <DataGrid
                  owStyle={{ backgroundColor: "blue" }}
                  sx={{
                    "&.MuiDataGrid-root": {
                      ".MuiDataGrid-columnHeaderTitleContainer": {
                        color: "#08C47C",
                        fontSize: "1.1rem",
                      },
                    },
                  }}
                  rows={events || []}
                  columns={columns}
                  pageSize={24}
                />
              </Grid>
              <Grid item xs={12}>
                <Grid container>
                  <Grid item xs={12}>
                    <Box paddingX={2}>
                      <form onSubmit={handleSubmit}>
                        <Grid container>
                          <Grid item xs={12}>
                            <Box marginBottom={2}>
                              <TextField
                                type="text"
                                label="Emri"
                                name="name"
                                fullWidth
                                onChange={handleInputsChange}
                                required
                              />
                            </Box>
                          </Grid>
                          <Grid item xs={12}>
                            <Box marginBottom={2}>
                              <TextField
                                type="text"
                                label="Tel. i Organizatorit"
                                name="organiserPhone"
                                fullWidth
                                onChange={handleInputsChange}
                                required
                              />
                            </Box>
                          </Grid>
                          <Grid item xs={12}>
                            <textarea
                              placeholder="Shenime..."
                              name="notes"
                              className={styles.notes}
                              onChange={handleInputsChange}
                              required
                            />
                          </Grid>
                          <Grid item xs={12}>
                            I preferuar (rezervimi zgjat 12 javë)
                            <Checkbox
                              checked={isWeekly}
                              onChange={(e) => setIsWeekly(e.target.checked)}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <Button variant="contained" type="submit">
                              Rezervo
                            </Button>
                          </Grid>
                        </Grid>
                      </form>
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
          </DialogActions>
        </>
      )}
    </React.Fragment>
  );
}
