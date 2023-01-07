import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "../common/components/Navbar";
import NotFound from "../common/components/NotFound";
import PrivateRoute from "../common/components/PrivateRoute";
import Dashboard from "./pages/dashboard/Dashboard";
import Login from "./pages/login/Login";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import UserDashboard from "./pages/dashboard/UserDashboard";
import * as React from 'react'

const theme = createTheme({
  palette: {
    primary: {
      main: '#08C47C'
    }
  }
});

function App() {
  return (
    <ThemeProvider theme={theme}>
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard/*"
          element={
            <PrivateRoute>
              <Dashboard/>
            </PrivateRoute>
          }
        />
         <Route
          path="/user-dashboard/*"
          element={
            <PrivateRoute>
              <UserDashboard/>
            </PrivateRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
    </ThemeProvider>
  );
}


export default App;
