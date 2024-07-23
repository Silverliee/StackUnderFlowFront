import { ListItem, ListItemText, Paper, Typography } from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import React, { useEffect } from "react";

function NotificationItem({ title, message, id, handleAccept, handleDecline, type }) {
	useEffect(() => {});
	return (
		<ListItem style ={{maxWidth:'50wh'}}
			secondaryAction={
				<div style={{ marginRight: "50px" }}>
					<DoneIcon
						id={id}
						style={{ color: "green", cursor: "pointer" }}
						onClick={() => handleAccept(id)}
					/>
					<CloseIcon
						id={id}
						style={{ color: "red", cursor: "pointer" }}
						onClick={() => handleDecline(id)}
					/>
				</div>
			}
		>
			<ListItemText
				primary={
					<Paper>
						<Typography variant="h8" component="h3">
							{type === "userInvitation" ? ("Invitation by : " + title) : ("Invitation to join the group : " + title)}
						</Typography>
						<Typography component="p">{message}</Typography>
					</Paper>
				}
				// secondary="Secondary Text"
			/>
		</ListItem>
	);
}

export default NotificationItem;
