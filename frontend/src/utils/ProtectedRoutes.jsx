import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoutes = () => {
  const { getMeStatus, isAuthenticated } = useSelector((state) => state.auth);

  if (getMeStatus === "loading") {
    return <h1>'loading'</h1>;
  }

  if (isAuthenticated && getMeStatus === "resolved") {
    return <Outlet />;
  }

  if (getMeStatus === "rejected") {
    return <Navigate to="/authorization" />;
  }
};

export default ProtectedRoutes;
