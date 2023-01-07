import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";

const linkMap = {
  "Numri i perdoruesve": "users",
  "Numri i komplekseve": "businesses",
  "Numri i rezervimeve kete muaj": "events",
};
export default function StatisticsCard({ description, amount }) {
  const navigate = useNavigate();
  return (
    <Card sx={{ maxWidth: 345, height: 120 }}>
      <CardContent>
        <Grid container>
          <Grid item xs={6}>
            <Typography variant="h6" sx={{ color: "#08C47C" }}>
              {amount}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2">{description}</Typography>
          </Grid>
        </Grid>
        {description && description[0] === "N" && (
          <Grid item xs={12} sx={{ textAlign: "right" }}>
            <Button
              size="small"
              variant="contained"
              color="primary"
              onClick={() => navigate(linkMap[description])}
            >
              <span style={{ color: "white" }}>Shiko</span>
            </Button>
          </Grid>
        )}
      </CardContent>
    </Card>
  );
}
