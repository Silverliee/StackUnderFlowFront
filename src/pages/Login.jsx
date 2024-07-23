import { useNavigate } from "react-router-dom";
import React, { useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import UnstyledInputIntroduction from "../components/Custom/UnstyledInputIntroduction.jsx";
import { useAuth } from "../hooks/AuthProvider";
import { isValidEmail } from "../utils/utils";
import RegisterModal from "../components/RegisterModal";
import {enqueueSnackbar} from "notistack";

export default function Login() {
	const [email, setEmail] = React.useState("");
	const [password, setPassword] = React.useState("");
	const [open, setOpen] = React.useState(false);
	const [username, setUsername] = React.useState("");
	const [emailRegister, setEmailRegister] = React.useState("");
	const [passwordRegister, setPasswordRegister] = React.useState("");
	const [passwordRegister2, setPasswordRegister2] = React.useState("");

	const auth = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (auth.isLoggedIn) {
			navigateDashboard();
		}
	});

	const navigateDashboard = () => navigate("/home", { replace: true });

	const handleClose = () => {
		setUsername("");
		setPasswordRegister("");
		setEmailRegister("");
		setPasswordRegister2("");
		setOpen(false);
	};

	const handleSubmitEvent = async (e) => {
		e.preventDefault();
		if (!email !== "" && password !== "") {
			auth.loginAction({ email, password }, navigateDashboard);
			return;
		}
		const variant = 'error';
		enqueueSnackbar("please provide a valid input", {variant, autoHideDuration: 2000});
	};
	const handleSubmitRegisterEvent = async (e) => {
		e.preventDefault();
		if (
			username !== "" &&
			passwordRegister !== "" &&
			emailRegister !== "" &&
			passwordRegister === passwordRegister2 &&
			isValidEmail(emailRegister)
		) {
			auth.register(
				{
					username,
					email: emailRegister,
					password: passwordRegister,
				},
				() => {}
			);
			handleClose();
			return;
		}
		const variant = 'error';
		let text = "Please provide a valid input"
		if (passwordRegister !== passwordRegister2){
			text = "Passwords do not match"
		}
		enqueueSnackbar(text, {variant, autoHideDuration: 2000});
	};
	return (
		<>
			<Box sx={{ flexGrow: 1 }}>
				<AppBar position="static">
					<Toolbar>
						<IconButton
							size="large"
							edge="start"
							color="inherit"
							aria-label="menu"
							sx={{ mr: 2 }}
						>
							<MenuIcon />
						</IconButton>
						<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
							StackUnderFlow
						</Typography>
						<Button color="inherit" onClick={() => setOpen(true)}>
							Sign in
						</Button>
					</Toolbar>
				</AppBar>
			</Box>
			<div>
				<Accordion>
					<AccordionSummary
						expandIcon={<ExpandMoreIcon />}
						aria-controls="panel2-content"
						id="panel2-header"
					>
						<Typography>Login</Typography>
					</AccordionSummary>
					<AccordionDetails>
						<div>
							<label>Email: </label>
							<UnstyledInputIntroduction
								required={true}
								type="email"
								id="email"
								name="email"
								value={email}
								handleInput={(event) => setEmail(event.target.value)}
							/>
						</div>
						<div>
							<label>Password: </label>
							<UnstyledInputIntroduction
								required={true}
								id="outputType"
								name="outputType"
								value={password}
								type="password"
								handleInput={(event) => setPassword(event.target.value)}
							/>
						</div>
						<Button
							component="label"
							role={undefined}
							variant="contained"
							tabIndex={-1}
							onClick={handleSubmitEvent}
							disabled={!email || !password}
						>
							Submit
						</Button>
					</AccordionDetails>
				</Accordion>
			</div>
			<RegisterModal
				open={open}
				handleClose={handleClose}
				handleSubmitRegisterEvent={handleSubmitRegisterEvent}
				username={username}
				setUsername={setUsername}
				email={emailRegister}
				setEmail={setEmailRegister}
				password={passwordRegister}
				setPassword={setPasswordRegister}
				password2={passwordRegister2}
				setPassword2={setPasswordRegister2}
			/>
		</>
	);
}
