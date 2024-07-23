import React, { useEffect } from "react";
import {
	ListItem,
	ListItemIcon,
	Checkbox,
	ListItemText,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";

export const Contact = ({ user, check, handleItemSelected, handleDelete, profileType, groupId }) => {
	const navigate = useNavigate();

	const link = (() => {
		switch (profileType) {
			case "friend":
				return `/${profileType}/${user.userId}`;
			case "group-member":
				return `/group/${groupId}/member/${user.userId}`;
			default:
				return `/user/${user.userId}`;
		}
	});

	return (
		<ListItem key={user.userId} role={undefined} dense button>
			<ListItemIcon>
				<Checkbox
					checked={check}
					key={user.userId}
					edge="start"
					tabIndex={-1}
					disableRipple
					id={`${user.userId}`}
					onChange={handleItemSelected}
				/>
			</ListItemIcon>
			<img
				src={`/assets/Profile${user.userId % 7 + 1}.jpg`}
				alt="Profile"
				style={{
					width: '40px',
					height: '40px',
					borderRadius: '50%',
					objectFit: 'cover',
					marginRight: '15px'
				}}
			/>
			<ListItemText
				id={user.userId}
				primary={user.username}
			/>

			<Button onClick={() => navigate(link())}>See Details</Button>
			<DeleteIcon onClick={() => handleDelete(user.userId)}></DeleteIcon>
		</ListItem>
	);
};

export default Contact;
