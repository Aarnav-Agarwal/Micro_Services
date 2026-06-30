// import { useEffect, useState } from "react";
// import { Navigate } from "react-router-dom";
// import api from "../Services/api";

// function ProtectedRoute({ children }) {
//   const [authenticated, setAuthenticated] = useState(false);

//   useEffect(() => {
//     verifyUser();
//   }, []);

//   const verifyUser = async () => {
//     try {
//       const response = await api.get("/auth/me");
//       if (response.data.success) {
//         setAuthenticated(true);
//       }
//       return authenticated ? children : <Navigate to="/" />;
//     } catch (err) {
//       console.log("Invalid token");
//       localStorage.removeItem("token");
//       setAuthenticated(false);
//     }
//   };

// }

// export default ProtectedRoute;

import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../Services/api";

function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);

  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    verifyUser();
  }, []);

  const verifyUser = async () => {
    try {
      const response = await api.get("/auth/me");

      if (response.data.success) {
        setAuthenticated(true);
      }
    } catch (err) {
      console.log("Invalid token");

      localStorage.removeItem("token");

      setAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <h2>Loading...</h2>;
  }

  return authenticated ? children : <Navigate to="/" />;
}

export default ProtectedRoute;
