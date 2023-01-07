import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Loader from "./Loader";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import LoginIcon from "@mui/icons-material/Login";
import { logout } from "../../features/user/userSlice";

export default function Navbar() {
  const isLoading = useSelector((state) => state.user.isLoading);
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = () => {
    dispatch(logout());
    localStorage.clear();
    navigate("/");
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar
          variant="dense"
          sx={{ display: "flex", justifyContent: "space-between" }}
        >
          <div>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={() => navigate("/dashboard")}
            >
              <span style={{ color: "white" }}>LOGO</span>
            </IconButton>
          </div>
          {user && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span
                style={{
                  color: "white",
                  marginRight: "10px",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: "1.1em",
                }}
                onClick={handleLogout}
              >
                Dil
              </span>
              <LoginIcon sx={{ fill: "white" }} />
            </div>
          )}
        </Toolbar>
      </AppBar>

      {isLoading && <Loader />}
    </Box>
  );
}
