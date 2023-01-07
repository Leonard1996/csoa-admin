import * as React from "react";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Dialog from "@mui/material/Dialog";
import PersonIcon from "@mui/icons-material/Person";
import { Grid } from "@mui/material";

export default function PlayersList({ onClose, isOpen, players }) {
  const handleListItemClick = (value) => {
    onClose(value);
  };

  return (
    <Dialog onClose={onClose} open={isOpen}>
      <List sx={{ pt: 0, minWidth: 500 }}>
        <Grid container>
          <ListItem>
            <Grid item xs={2}>
              {/* <ListItem> */}
              <ListItemText primary={""} />
              {/* </ListItem> */}
            </Grid>

            <Grid item xs={4}>
              {/* <ListItem> */}
              <ListItemText
                primary={"Emri"}
                primaryTypographyProps={{ fontSize: "18px", fontWeight: 900 }}
              />
              {/* </ListItem> */}
            </Grid>

            <Grid item xs={3}>
              {/* <ListItem> */}
              <ListItemText
                primary={"Statusi"}
                primaryTypographyProps={{ fontSize: "18px", fontWeight: 900 }}
              />
              {/* </ListItem> */}
            </Grid>

            <Grid item xs={3}>
              {/* <ListItem> */}
              <ListItemText
                primary={"Ekipi"}
                primaryTypographyProps={{ fontSize: "18px", fontWeight: 900 }}
              />
              {/* </ListItem> */}
            </Grid>
          </ListItem>
          {players.map((player, _index) => (
            <ListItem button key={_index} onClick={handleListItemClick}>
              <Grid item xs={2}>
                <ListItemAvatar>
                  <Avatar
                    src={
                      process.env.REACT_APP_BASE_API +
                      "/" +
                      player.profile_picture
                    }
                  >
                    <PersonIcon />
                  </Avatar>
                </ListItemAvatar>
              </Grid>
              <Grid item xs={4}>
                <ListItemText primary={player.name} />
              </Grid>
              <Grid item xs={3}>
                <ListItemText primary={player.status} />
              </Grid>
              <Grid item xs={3}>
                <ListItemText primary={player.team} />
              </Grid>
            </ListItem>
          ))}
        </Grid>
      </List>
    </Dialog>
  );
}
