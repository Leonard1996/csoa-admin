import * as React from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import StadiumIcon from "@mui/icons-material/Stadium";
import EventIcon from "@mui/icons-material/Event";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Typography } from "@mui/material";
import FeedbackIcon from "@mui/icons-material/Feedback";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import { useMediaQuery } from "@mui/material";

const days = [
  "E hënë",
  "E martë",
  "E mërkurë",
  "E enjte",
  "E premte",
  "E shtunë",
];

const months = [
  "Janar",
  "Shkurt",
  "Mars",
  "Prill",
  "Maj",
  "Qershor",
  "Korrik",
  "Gusht",
  "Shtator",
  "Tetor",
  "Nëntor",
  "Dhjetor",
];

export default function Menu() {
  const role = useSelector((state) => state.user.user.role);
  const navigate = useNavigate();
  const location = useLocation();
  const isPhone = useMediaQuery("(max-width:600px)");

  const adminCategories = [
    {
      title: "Dashboard",
      icon: (
        <DashboardIcon
          sx={{ fill: location.pathname === "/dashboard" ? "#08C47C" : "" }}
        />
      ),
      link: "/dashboard",
    },
    {
      title: "Perdorues",
      icon: (
        <PeopleAltIcon
          sx={{
            fill: location.pathname === "/dashboard/users" ? "#08C47C" : "",
          }}
        />
      ),
      link: "users",
    },
    {
      title: "Komplekse",
      icon: (
        <StadiumIcon
          sx={{
            fill:
              location.pathname === "/dashboard/businesses" ? "#08C47C" : "",
          }}
        />
      ),
      link: "businesses",
    },
    {
      title: "Evente",
      icon: (
        <EventIcon
          sx={{
            fill: location.pathname === "/dashboard/events" ? "#08C47C" : "",
          }}
        />
      ),
      link: "events",
    },
    {
      title: "Njoftime",
      icon: (
        <FeedbackIcon
          sx={{
            fill:
              location.pathname === "/dashboard/notifications" ? "#08C47C" : "",
          }}
        />
      ),
      link: "notifications",
    },
    {
      title: "Perdorues Biznes",
      icon: (
        <AddBusinessIcon
          sx={{
            fill:
              location.pathname === "/dashboard/business-users"
                ? "#08C47C"
                : "",
          }}
        />
      ),
      link: "business-users",
    },
  ];

  const userCategories = [
    {
      title: "Dashboard",
      icon: (
        <DashboardIcon
          sx={{
            fill: location.pathname === "/user-dashboard" ? "#08C47C" : "",
          }}
        />
      ),
      link: "/user-dashboard",
    },
    {
      title: "Fushat",
      icon: (
        <SportsSoccerIcon
          sx={{
            fill:
              location.pathname === "/user-dashboard/fields" ? "#08C47C" : "",
          }}
        />
      ),
      link: "fields",
    },
    {
      title: "Kalendari",
      icon: (
        <CalendarMonthIcon
          sx={{
            fill:
              location.pathname === "/user-dashboard/calendar" ? "#08C47C" : "",
          }}
        />
      ),
      link: "calendar",
    },

    {
      title: "Rezervime",
      icon: (
        <NewspaperIcon
          sx={{
            fill:
              location.pathname === "/user-dashboard/reservations"
                ? "#08C47C"
                : "",
          }}
        />
      ),
      link: "reservations",
    },
  ];

  const getCategoriesByRole = (role) => {
    return role === "admin" ? adminCategories : userCategories;
  };

  const getDateInAlbanian = () => {
    const today = new Date();

    const date = today.getDate();
    const day = today.getDay();
    const month = today.getMonth();
    const year = today.getFullYear();

    return `${days[day - 1] || "E diel"}, ${date} ${months[month]} ${year}`;
  };

  const hasNotification = useSelector((state) => state?.user?.hasNotification);

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 360,
        bgcolor: "background.paper",
      }}
    >
      <nav aria-label="main mailbox folders">
        {!isPhone && (
          <Box padding={2}>
            <Typography variant="h6" align="center">
              {getDateInAlbanian()}
            </Typography>
          </Box>
        )}

        <List>
          {getCategoriesByRole(role).map((category, _index) => (
            <React.Fragment key={_index}>
              <ListItem disablePadding onClick={() => navigate(category.link)}>
                <ListItemButton>
                  <ListItemIcon>{category.icon}</ListItemIcon>
                  {!isPhone && <ListItemText primary={category.title} />}
                </ListItemButton>
              </ListItem>
              <Divider variant="middle" />
            </React.Fragment>
          ))}
        </List>
      </nav>
    </Box>
  );
}
