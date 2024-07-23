import { useContext, useEffect, createContext, useState } from "react";
import AxiosRq from "../Axios/AxiosRequester.js";
import {enqueueSnackbar} from "notistack";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
	// const [authData, setAuthData] = useState(() => {
	// 	const savedAuthData = localStorage.getItem("authData");
	// 	return savedAuthData ? JSON.parse(savedAuthData) : null;
	// });
	const [authData, setAuthData] = useState(null);

	const [isLoggedIn, setIsLoggedIn] = useState(!!authData);

	useEffect(() => {
		setIsLoggedIn(!!authData);
	}, [authData]);

	useEffect(() => {
		if (authData && authData.token) {
			AxiosRq.getInstance().setToken(authData.token);
		}
	}, [authData]);

	const loginAction = async (data, callback) => {
		try {
			const response = await AxiosRq.getInstance().loginRequest(data);
			if (response && response.token) {
				AxiosRq.getInstance().setToken(response.token);
				const user = await AxiosRq.getInstance().getUserByToken();
				setAuthData({
					token: response.token,
					username: user.username,
					userId: user.userId,
					email: user.email,
					description: user.description
				});
				setIsLoggedIn(true);
				const variant = 'success';
				enqueueSnackbar("Login successful", {variant, autoHideDuration: 2000});
				callback();
			} else {
				const variant = 'error';
				enqueueSnackbar("Invalid login credentials", {variant, autoHideDuration: 2000});
			}
		} catch (err) {
			console.error(err);
		}
	};

	const register = async (data, callback) => {
		try {
			const response = await AxiosRq.getInstance().registerRequest(data);
			if (response) {
				const variant = 'success';
				enqueueSnackbar("Registration successful", {variant, autoHideDuration: 2000});
				callback();
				return;
			}
			const variant = 'error';
			enqueueSnackbar("Invalid registration credentials", {variant, autoHideDuration: 2000});
		} catch (err) {
			console.error(err);
		}
	};

	const logout = (callback) => {
		setAuthData(null);
		//localStorage.removeItem("authData");
		setIsLoggedIn(false);
		callback();
	};

	return (
		<AuthContext.Provider
			value={{
				authData,
				isLoggedIn,
				loginAction,
				logout,
				register,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export default AuthProvider;

export const useAuth = () => {
	return useContext(AuthContext);
};
