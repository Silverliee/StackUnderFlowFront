import React, { useEffect } from "react";
import {
	ListItem,
	ListItemIcon,
	Checkbox,
	ListItemText,
	Chip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import { Link, useLocation } from "react-router-dom";
import AxiosRq from "../../Axios/AxiosRequester.js";
import { useAuth } from "../../hooks/AuthProvider.jsx";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";

export const Group = ({ group, check, handleItemSelected, handleDelete }) => {
	const { authData } = useAuth();
	const navigate = useNavigate();
	return (
		<ListItem key={group.groupId} role={undefined} dense button>
			<div style={{display: "flex", width: "100%"}}>
				<div style={{flex: "1", display: "flex"}}>
					<ListItemIcon>
						<Checkbox
							checked={check}
							key={group.groupId}
							edge="start"
							tabIndex={-1}
							disableRipple
							id={`${group.groupId}`}
							onChange={handleItemSelected}
						/>
					</ListItemIcon>
					<ListItemText
						id={group.groupId}
						primary={group.groupName}
					/>
				</div>
				<div style={{display: "flex", justifyContent: "flex-end", flex: "1"}}>
					<div style={{display: "flex", justifyContent: "space-between"}}>
						<Button onClick={() => navigate(`/group/${group.groupId}`)}>See Group details</Button>
						{group.creatorUserID == authData.userId ? (
							<div style={{marginLeft:'5px', display:'flex', alignItems: 'center'}}>
								<DeleteIcon onClick={() => handleDelete(group.groupId)}></DeleteIcon>
							</div>
						) :
							<div style={{marginLeft:'30px'}}></div>}
					</div>
				</div>
			</div>
		</ListItem>
);
};

export default Group;
