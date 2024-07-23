import React, {useEffect} from "react";
import {useAuth} from "../hooks/AuthProvider.jsx";
import {getRandomInt, isEmailAvailable, isUsernameAvailable, isValidEmail} from "../utils/utils.js";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import {Box, Button, TextField, Typography} from "@mui/material";
import {enqueueSnackbar} from "notistack";
import AxiosRequester from "../Axios/AxiosRequester.js";
import ValidPasswordModal from "../components/ValidPasswordModal.jsx";

function ProfilePage() {
	const [description, setDescription] = React.useState("");
	const [temporaryDescription, setTemporaryDescription] = React.useState(description);
	const [username, setUsername] = React.useState("");
	const [temporaryUsername, setTemporaryUsername] = React.useState(username);
	const [email, setEmail] = React.useState("");
	const [temporaryEmail, setTemporaryEmail] = React.useState(email);
	const [password, setPassword] = React.useState("");
	const [confirmedPassword, setConfirmedPassword] = React.useState("");
	const [editMode, setEditMode] = React.useState(false);
	const [open, setOpen] = React.useState(false);
	const userId = useAuth().authData?.userId;
	const randomInt = getRandomInt(userId);
	const { authData } = useAuth();

	useEffect(() => {
		AxiosRequester.getInstance().getUserByToken().then(user => {
			setUsername(user.username);
			setEmail(user.email);
			setDescription(user.description);
		});
	}, []);

	useEffect(() => {
		setTemporaryUsername(username);
		setTemporaryEmail(email);
		setTemporaryDescription(description);
	},[username,email,description]);

	const style = {
		width: 400,
		p: 4,
	};

	const enableEdit = () => {
		setEditMode(true);
	}

	const updateLocalProfile = () => {
		setUsername(temporaryUsername);
		setEmail(temporaryEmail);
		setDescription(temporaryDescription);
		setPassword("");
		setConfirmedPassword("");
		handleClose();
		handleCloseEditMode();
	}

	const handleCloseEditMode = () => {
		setEditMode(false);
	}

	const handleOpen = () => {
		setOpen(true);
	}

	const cancelEdit = () => {
		setTemporaryDescription(description);
		setPassword("");
		setTemporaryEmail(email);
		setTemporaryUsername(username);
		handleCloseEditMode();
	}

	const hasChangedOccurred = () => {
		return (
			username !== temporaryUsername ||
				email !== temporaryEmail ||
				description !== temporaryDescription ||
				password.length > 0
		)
	}

	const handleValidate = async () => {
		const result = await AxiosRequester.getInstance().updateProfileInformation({
			...(temporaryUsername && {username: temporaryUsername}),
			...(temporaryEmail && {email: temporaryEmail}),
			...(temporaryDescription && {description: temporaryDescription}),
			...(password && {password: password}),
		});
		if (result) {
			const variant = 'success';
			let text = "Profile updated"
			enqueueSnackbar(text, {variant, autoHideDuration: 2000});
			updateLocalProfile();
		} else {
			const variant = 'error';
			let text = "Error while updating profile"
			enqueueSnackbar(text, {variant, autoHideDuration: 2000});
			cancelEdit();
		}
	}

	const handleClose = () => {
		setOpen(false);
	}

	const handleSubmitEdit = async () => {
		if (password.length === 0) {
			setConfirmedPassword("");
		}
		const emailAvailable = email !== temporaryEmail ? await isEmailAvailable(temporaryEmail) : true;
		const usernameAvailable = username !== temporaryUsername ? await isUsernameAvailable(temporaryUsername) : true;
		if (
			temporaryUsername !== "" &&
			temporaryEmail !== "" &&
			isValidEmail(temporaryEmail) &&
			(password.length === 0 || password.length > 5) &&
			emailAvailable &&
			usernameAvailable &&
			password === confirmedPassword &&
			hasChangedOccurred()
		) {
			console.log("open password check");
			//open password check validation modal
			handleOpen();
		} else if (!hasChangedOccurred()) {
			cancelEdit();
		} else {
				const variant = 'error';
				let text = "Please provide a valid input"
				if (!isValidEmail(temporaryEmail)){
					text = "Provide a valid email"
				} else if (!emailAvailable) {
					text = "This email is already used"
				} else if (!usernameAvailable) {
					text = "This username is already used"
				} else if (password !== confirmedPassword) {
					text = "Passwords do not match"
				} else if (password.length < 6) {
					text = "Password is too short, minimum 6 characters"
				}
				enqueueSnackbar(text, {variant, autoHideDuration: 2000});
		}
	}

	return (<div style={{display:"flex", flexDirection:"row"}} >
		<img
			src={`/assets/Profile${randomInt}.jpg`}
			alt="Profile"
			style={{
				width: '200px',
				height: '200px',
				borderRadius: '50%',
				objectFit: 'cover',
				border: '2px solid white'
			}}
		/>
		<div style={{display:'flex', justifyContent:'flex-start'}}>
			<Box sx={style}>
				<Typography variant="h6" component="h2" gutterBottom>
					Profile information
				</Typography>
				<TextField
					disabled={!editMode}
					label="Username"
					variant="outlined"
					fullWidth
					sx={{ mb: 2 }}
					onChange={(event) => setTemporaryUsername(event.target.value)}
					value={temporaryUsername}
				/>
				<TextField
					disabled={!editMode}
					label="Email"
					variant="outlined"
					fullWidth
					sx={{ mb: 2 }}
					onChange={(event) => setTemporaryEmail(event.target.value.trim())}
					value={temporaryEmail}
				/>
				<TextField
					autoComplete="off"
					error={password !== confirmedPassword && password.length > 0}
					disabled={!editMode}
					label="New Password"
					type="password"
					variant="outlined"
					fullWidth
					sx={{ mb: 2 }}
					onChange={(event) => setPassword(event.target.value.trim())}
					value={password}
				/>
				{password.length > 0 && (
					<TextField
						error={password !== confirmedPassword}
						disabled={!editMode}
						label="Confirm New Password"
						type="password"
						variant="outlined"
						fullWidth
						sx={{ mb: 2 }}
						onChange={(event) => setConfirmedPassword(event.target.value.trim())}
						value={confirmedPassword}
					/>
				)}
				<TextField
					disabled={!editMode}
					label="description"
					variant="outlined"
					multiline
					fullWidth
					sx={{ mb: 2 }}
					onChange={(event) => setTemporaryDescription(event.target.value)}
					value={temporaryDescription}
					placeholder={"Describe yourself"}
				/>
				{editMode ?
					<Button style={{display:'flex'}} onClick={cancelEdit}>
						<ClearIcon style={{cursor: "pointer"}}></ClearIcon>
						<Typography>Edit profile</Typography>
					</Button>
					:
					<Button style={{display:'flex'}} onClick={enableEdit}>
						<EditIcon  style={{cursor: "pointer"}}/>
						<Typography>Edit profile</Typography>
					</Button>
				}
				<Button variant="contained" color="primary" fullWidth onClick={handleSubmitEdit}
						disabled={!temporaryUsername || !temporaryEmail || (password.length > 0 ? password !== confirmedPassword : false )}>
					Submit
				</Button>
			</Box>
			<ValidPasswordModal handleClose={handleClose} open={open} handleValidate={handleValidate}/>
		</div>
	</div>);
}

export default ProfilePage;
