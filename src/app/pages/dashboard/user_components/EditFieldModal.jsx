import * as React from "react";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import { inputs, checkboxes } from "./FieldForm";
import {
  Box,
  TextField,
  Grid,
  Checkbox,
  DialogActions,
  Button,
} from "@mui/material";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useEffect } from "react";
import axiosInstance from "../../../../common/helpers/axios.instance";

export default function EditFieldModal({ isOpen, handleClose, id, editField }) {
  const handleSubmit = (event) => {
    event.preventDefault();
    editField(id, fields);
  };

  const [fields, setFields] = React.useState({});

  const fetchFieldData = async (id) => {
    try {
      const field = await axiosInstance.get(
        process.env.REACT_APP_BASE_API + `/locations/${id}`
      );
      setFields(field.data.data);
    } catch (err) {
      console.log(err);
      alert("Ndodhi nje problem");
    }
  };

  useEffect(() => {
    if (isOpen) fetchFieldData(id);
  }, [isOpen]);

  return (
    <Dialog onClose={handleClose} open={isOpen} fullWidth>
      <DialogTitle>Modifiko fushen e zgjedhur</DialogTitle>
      <Box m={2}>
        <form onSubmit={handleSubmit}>
          <Grid container rowGap={2}>
            {inputs.map((input) => (
              <Grid item xs={12} key={input.name}>
                <TextField
                  type={input.type}
                  label={input.label}
                  name={input.name}
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
            {checkboxes.map((checkbox, _index) => (
              <div
                key={_index}
                style={{ display: "flex", alignItems: "center" }}
              >
                <Checkbox
                  checked={Boolean(fields?.[checkbox.name])}
                  onChange={(e) => {
                    setFields((f) => ({
                      ...f,
                      [checkbox.name]: e.target.checked,
                    }));
                  }}
                />
                {checkbox.label}
              </div>
            ))}
            <Grid item xs={12}>
              Zgjidhni kohëzgjatjen e seances
            </Grid>
            <Grid item xs={12}>
              <RadioGroup
                row
                value={fields?.slotRange ?? null}
                onChange={(e) =>
                  setFields((f) => ({ ...f, slotRange: e.target.value }))
                }
              >
                <FormControlLabel
                  value={60}
                  control={<Radio />}
                  label="1 orë"
                />
                <FormControlLabel
                  value={90}
                  control={<Radio />}
                  label="1 orë e gjysëm"
                />
                <FormControlLabel
                  value={120}
                  control={<Radio />}
                  label="2 orë "
                />
              </RadioGroup>
            </Grid>
          </Grid>
        </form>{" "}
      </Box>
      <DialogActions>
        <Button color="error" variant="contained" onClick={handleClose}>
          Mbyll
        </Button>
        <Button variant="contained" type="submit" onClick={handleSubmit}>
          <span style={{ color: "white" }}>Ruaj</span>
        </Button>
      </DialogActions>
    </Dialog>
  );
}
