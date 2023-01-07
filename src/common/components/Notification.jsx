import * as React from "react";
import Alert from "@mui/material/Alert";

export default function Notification({
  setNotification,
  notification: { severity },
}) {
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setNotification({
        isOpen: false,
        severity: "",
      });
    }, 3500);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <Alert
      variant="filled"
      severity={severity}
      sx={{ position: "absolute", bottom: "5px", left: "5px", width: "350px" }}
    >
      {severity === "success"
        ? "Veprimi u krye me sukses"
        : "Pati nje problem ne sistem"}
    </Alert>
  );
}
