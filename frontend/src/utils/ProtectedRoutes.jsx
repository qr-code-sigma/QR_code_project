import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Loading from "../components/Loading/loading.jsx";

const ProtectedRoutes = () => {
  const { getMeStatus, isAuthenticated } = useSelector((state) => state.auth);

  if (getMeStatus === "loading") {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          width: "100%"
        }}
      >
        <Loading />
      </div>
    );
  }

  if (isAuthenticated && getMeStatus === "resolved") {
    return <Outlet />;
  }

  if (getMeStatus === "rejected") {
    return <Navigate to="/authorization" />;
  }
};

export default ProtectedRoutes;
