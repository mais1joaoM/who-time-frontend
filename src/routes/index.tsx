import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Reports from "../pages/Reports";
import Statistics from "../pages/Statistics";
import CompaniesContracts from "../pages/CompaniesContracts";

import ProtectedRoute from "../components/ProtectedRoute";

function RoutesApp() {

  return (
    <BrowserRouter>

      <Routes>

        {/* REDIRECT INICIAL */}
        <Route
          path="/"
          element={<Navigate to="/login" />}
        />

        {/* LOGIN */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* DASHBOARD */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* REPORTS */}
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          }
        />


        {/* STATISTICS */}
        <Route
          path="/statistics"
          element={
            <ProtectedRoute>
              <Statistics />
            </ProtectedRoute>
          }
        />

        {/* STATISTICS */}
        <Route
          path="/companiescontracts"
          element={
            <ProtectedRoute>
              <CompaniesContracts />
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default RoutesApp;