import { CardContent, Grid, Card, Pagination, Typography } from "@mui/material";
import { Box } from "@mui/system";
import dateHelper from "../../../../common/helpers/dateHelper";
import moment from "moment/moment";

export function getElapsedTime(date) {
  date = moment(new Date(date).getTime());
  return Math.abs(Math.round((new Date().getTime() - date) / (60 * 1000)));
}

export default function NotificationsMobile({ count, events, page, setPage }) {
  return (
    <Grid container>
      <Grid item xs={12}>
        <Box m={1} sx={{ display: "flex", justifyContent: "center" }}>
          <Pagination
            count={Math.ceil(count / 15)}
            page={+page + 1}
            onChange={(e, p) => setPage(p - 1)}
          />
        </Box>
      </Grid>

      <Grid item xs={12}>
        {events.map((event) => (
          <Box marginY={2} marginX={1} key={event.id}>
            <Card>
              <CardContent>
                <Typography variant="body2">Status : {event.status}</Typography>
                <Typography variant="body2">
                  Organizator : {event.creator}
                </Typography>
                <Typography variant="body2">
                  Kompleksi : {event.name}
                </Typography>
                <Typography variant="body2">Fusha: {event.location}</Typography>
                <Typography variant="body2">
                  Data e fillimit: {dateHelper(event.startDate)}
                </Typography>
                <Typography variant="body2">
                  Koha nga rezervimi: {getElapsedTime(event.tsCreated)} minuta
                </Typography>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Grid>
    </Grid>
  );
}
