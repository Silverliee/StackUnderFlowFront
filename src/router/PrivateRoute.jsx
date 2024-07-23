import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/AuthProvider";

const PrivateRoute = () => {
	const isLoggedIn = useAuth().isLoggedIn;
	if (!isLoggedIn) return <Navigate to="/login" />;
	return <Outlet />;
};

export default PrivateRoute;
