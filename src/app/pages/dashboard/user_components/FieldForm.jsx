import {
  Box,
  TextField,
  Grid,
  Checkbox,
  Typography,
  Divider,
} from "@mui/material";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import React from "react";
import { useState } from "react";

export const inputs = [
  { name: "price", type: "text", label: "Çmimi" },
  { name: "name", type: "text", label: "Emri i fushes" },
  { name: "length", type: "text", label: "Dimensionet (gjatësia)" },
  { name: "width", type: "text", label: "Dimensionet (gjerësia)" },
];

export const checkboxes = [
  { label: "Futboll", name: "isFootball" },
  { label: "Basketboll", name: "isBasketball" },
  { label: "Tenis", name: "isTennis" },
  { label: "Volejboll", name: "isVolleyball" },
];
export default function FieldForm({ setFields, fields }) {
  const [fieldsNumber, setFieldsNumber] = useState(new Array(1).fill(1));

  return (
    <>
      <Box m={2}>
        <Grid container>
          <Grid item xs={12} md={4}>
            <TextField
              type="number"
              label="Nr. i fushave per tu krijuar"
              fullWidth
              value={+fieldsNumber.length}
              onChange={(e) =>
                setFieldsNumber(() => new Array(+e.target.value).fill(1))
              }
            />
          </Grid>
        </Grid>
      </Box>
      {fieldsNumber.map((_element, _index) => (
        <React.Fragment key={_index}>
          <Box m={2}>
            <Grid container columnGap={2}>
              <Grid item xs={12}>
                <Box m={1}>
                  <Typography>Fusha numer {_index + 1}</Typography>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Grid container rowSpacing={2}>
                  {inputs.map((input) => (
                    <Grid item xs={12} key={input.label}>
                      <TextField
                        name={input.name}
                        label={input.label}
                        type={input.type}
                        fullWidth
                        onChange={(e) => {
                          const newFields = JSON.parse(JSON.stringify(fields));
                          newFields.locations[_index] = {
                            ...newFields.locations[_index],
                            [e.target.name]: e.target.value,
                          };
                          setFields((f) => ({
                            ...f,
                            locations: newFields.locations,
                          }));
                        }}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Grid>
              <Grid item xs={3}>
                <Typography>Zgjidhni llojin e fushës</Typography>
                <Grid container>
                  {checkboxes.map((checkbox) => (
                    <React.Fragment key={checkbox.name}>
                      <Grid item xs={12} key={checkbox.name}>
                        <Checkbox
                          checked={
                            fields?.locations?.[_index]?.[checkbox?.name]
                          }
                          onChange={(e) => {
                            const newFields = JSON.parse(
                              JSON.stringify(fields)
                            );
                            newFields.locations[_index] = {
                              ...newFields.locations[_index],
                              [checkbox.name]: e.target.checked,
                            };
                            setFields((f) => ({
                              ...f,
                              locations: newFields.locations,
                            }));
                          }}
                        />
                        {checkbox.label}
                      </Grid>
                    </React.Fragment>
                  ))}
                </Grid>
              </Grid>
              <Grid item xs={4}>
                <Typography>Zgjidhni kohëzgjatjen e seances</Typography>
                <RadioGroup
                  row
                  value={fields?.locations?.[_index]?.slotRange}
                  onChange={(e) => {
                    const newFields = JSON.parse(JSON.stringify(fields));
                    newFields.locations[_index] = {
                      ...newFields.locations[_index],
                      slotRange: +e.target.value,
                    };
                    setFields((f) => ({
                      ...f,
                      locations: newFields.locations,
                    }));
                  }}
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
          </Box>
          <Divider />
        </React.Fragment>
      ))}
    </>
  );
}
