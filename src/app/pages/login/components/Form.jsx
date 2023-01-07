import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import { TextField, Typography } from "@mui/material";
import axiosInstance from "../../../../common/helpers/axios.instance";
import { useDispatch, useSelector } from "react-redux";
import {
  finishLoader,
  loginSuccess,
  startLoader,
} from "../../../../features/user/userSlice";
import { useNavigate } from "react-router-dom";
import Notification from "../../../../common/components/Notification";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

export default function Form() {
  const emailRef = React.useRef();
  const passwordRef = React.useRef();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const error = useSelector((state) => state.user.isError);

  const [notification, setNotification] = React.useState({
    isOpen: false,
    severity: "",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    dispatch(startLoader());
    try {
      const user = await axiosInstance.post(
        process.env.REACT_APP_BASE_API + "/login",
        {
          email: emailRef.current.value,
          password: passwordRef.current.value,
        }
      );
      dispatch(
        loginSuccess({
          user: JSON.stringify(user.data.data.user),
          accessToken: user.data.data.accessToken,
        })
      );
      navigate("/dashboard");
    } catch (error) {
      setNotification({
        isOpen: true,
        severity: "error",
      });
    }
    dispatch(finishLoader());
  };

  return (
    <>
      <Card sx={{ minWidth: 550 }}>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Box sx={{ textAlign: "center" }} paddingTop={2}>
              <AccountCircleIcon
                sx={{ transform: "scale(2.5)", fill: "#08C47C" }}
              />
              <Box margin={1}>
                <Typography variant="h6">Welcome Admin</Typography>
              </Box>
            </Box>
            <Box marginY={4}>
              <TextField
                id="outlined-basic"
                variant="outlined"
                fullWidth
                label="Email"
                type="text"
                inputRef={emailRef}
              />
            </Box>
            <Box marginBottom={4}>
              <TextField
                id="outlined-basic"
                variant="outlined"
                fullWidth
                label="Password"
                type="password"
                inputRef={passwordRef}
              />
            </Box>
            <Box sx={{ textAlign: "center" }}>
              <Button variant="contained" disableRipple type="submit">
                <span style={{ color: "white" }}>Login</span>
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
      {notification.isOpen && (
        <Notification
          notification={notification}
          setNotification={setNotification}
        />
      )}
    </>
  );
}
