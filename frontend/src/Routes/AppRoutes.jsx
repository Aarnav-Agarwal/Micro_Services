import { Routes, Route } from "react-router-dom";
import Layout from "../Components/Layout";

import Login from "../Pages/auth/Login";
import Signup from "../Pages/auth/Signup";
import Dashboard from "../Pages/dashboard/Dashboard";
import SharedWithMe from "../Pages/sharing/SharedWithMe";
import FileDetails from "../Pages/filedetails/FileDetails";

import ProtectedRoute from "../Components/ProtectedRoutes";

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route element={<Layout />}>
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              {" "}
              <Dashboard />{" "}
            </ProtectedRoute>
          }
        />

        <Route
          path="/shared"
          element={
            <ProtectedRoute>
              {" "}
              <SharedWithMe />{" "}
            </ProtectedRoute>
          }
        />

        <Route
          path="/file/:id"
          element={
            <ProtectedRoute>
              {" "}
              <FileDetails />{" "}
            </ProtectedRoute>
          }
        />

        {/* Invalid route */}
      </Route>
      <Route path="*" element={<h1>404 Page Not Found</h1>} />
    </Routes>
  );
}

export default AppRoutes;
