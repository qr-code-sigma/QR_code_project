import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoutes = () => {
  const { status, isAuthenticated } = useSelector((state) => state.auth);

  if (status === "loading") {
    return <h1>'loading'</h1>;
  }

  if (isAuthenticated && status === "resolved") {
    return <Outlet />;
  }

  if (status === "rejected") {
    return <Navigate to="/authorization" />;
  }
};

export default ProtectedRoutes;
