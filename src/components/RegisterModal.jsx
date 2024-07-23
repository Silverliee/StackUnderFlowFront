import React from "react";
import Button from "@mui/material/Button";
import { Modal, Box } from "@mui/material";
import UnstyledInputIntroduction from "./Custom/UnstyledInputIntroduction.jsx";

function RegisterModal({
	open,
	handleClose,
	handleSubmitRegisterEvent,
	username,
	setUsername,
	email,
	setEmail,
	password,
	setPassword,
	password2,
	setPassword2,
}) {
	const style = {
		position: "absolute",
		top: "50%",
		left: "50%",
		transform: "translate(-50%, -50%)",
		width: 400,
		bgcolor: "background.paper",
		border: "2px solid #000",
		boxShadow: 24,
		pt: 2,
		px: 4,
		pb: 3,
	};

	return (
		<Modal
			open={open}
			onClose={handleClose}
			aria-labelledby="parent-modal-title"
			aria-describedby="parent-modal-description"
		>
			<Box sx={{ ...style, width: 400 }}>
				<div>
					<div>
						<label>Username: </label>
						<UnstyledInputIntroduction
							id="username"
							name="username"
							handleInput={(event) => setUsername(event.target.value)}
						/>
					</div>
					<div>
						<label>Email: </label>
						<UnstyledInputIntroduction
							id="email"
							name="email"
							handleInput={(event) => setEmail(event.target.value)}
						/>
					</div>{" "}
					<div>
						<label>Password: </label>
						<UnstyledInputIntroduction
							type="password"
							id="password"
							name="password"
							handleInput={(event) => setPassword(event.target.value)}
						/>
					</div>{" "}
					<div>
						<label>Confirm password: </label>
						<UnstyledInputIntroduction
							type="password"
							id="password2"
							name="password2"
							handleInput={(event) => setPassword2(event.target.value)}
						/>
					</div>
				</div>
				<Button
					component="label"
					role={undefined}
					variant="contained"
					tabIndex={-1}
					onClick={handleSubmitRegisterEvent}
					disabled={!username || !password || !password2 || !email}
				>
					Submit
				</Button>
			</Box>
		</Modal>
	);
}

export default RegisterModal;
