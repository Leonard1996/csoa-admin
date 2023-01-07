import { Box, Grid, Typography, Button, CircularProgress } from "@mui/material";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import Zoom from "@mui/material/Zoom";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

export default function FinalStep({
  handleSubmit,
  requestState: { isLoading, isSuccess, isError },
}) {
  return (
    <Box m={2}>
      <Grid container>
        <Grid item xs={4}></Grid>
        <Grid
          item
          xs={4}
          sx={{ textAlign: "center", marginTop: "2rem", minHeight: "80px" }}
        >
          <ReportProblemIcon
            sx={{ fill: "#FCAE1E", transform: "scale(4.0)" }}
          />
        </Grid>
        <Grid item xs={4}></Grid>
        <Grid item xs={4}></Grid>
        <Grid item xs={4}>
          <Typography variant="h6">
            Per te krijuar kompleksin tuaj sportiv, kontrolloni fushat e
            plotesuara dhe klikoni butonin "Krijo"
          </Typography>
        </Grid>
        <Grid item xs={4}></Grid>
        <Grid item xs={12} sx={{ textAlign: "center", marginTop: "50px" }}>
          <Button
            variant="contained"
            disabled={isLoading || isSuccess || isError}
            onClick={handleSubmit}
          >
            <Box paddingX={6}>
              <spna style={{ color: "white" }}>KRIJO</spna>
            </Box>
          </Button>
          {isLoading && (
            <Box margin={2}>
              <Zoom in={isLoading}>
                <Grid container>
                  <Grid item xs={12}>
                    <CircularProgress />
                    <Typography>Ju lutem prisni...</Typography>
                  </Grid>
                </Grid>
              </Zoom>
            </Box>
          )}
          {isSuccess && (
            <Box marginTop={2}>
              <Zoom in={isSuccess}>
                <Grid container>
                  <Grid item xs={12}>
                    <CheckCircleIcon
                      sx={{ fill: "#08C47C", transform: "scale(2)" }}
                    />
                    <Box marginTop={1}>
                      <Typography>Kompleksi u krijua me sukses</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Zoom>
            </Box>
          )}

          {isError && (
            <Box marginTop={2}>
              <Zoom in={isError}>
                <Grid container>
                  <Grid item xs={12}>
                    <CancelIcon
                      sx={{ fill: "#eb0014", transform: "scale(2)" }}
                    />
                    <Box marginTop={1}>
                      <Typography>
                        Kompleksi nuk u krijua, ju lutem provoni me vone ose
                        kontaktoni administratorin
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Zoom>
            </Box>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
