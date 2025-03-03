import { Outlet, Navigate } from 'react-router-dom';
import {useSelector} from "react-redux";

const ProtectedRoutes = () => {
    const { isAuthenticated } = useSelector(state => state.user);

    if(isAuthenticated) {
        return <Outlet />
    }

    return <Navigate to="/login" />
}

export default ProtectedRoutes;