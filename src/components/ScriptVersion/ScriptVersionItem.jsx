import React from "react";
import { ListItem, ListItemIcon, Checkbox, ListItemText } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import { Button } from "@mui/material";
import {useAuth} from "../../hooks/AuthProvider.jsx";

const ScriptVersionItem = ({
	sv,
	handleDelete,
	handleEditOnline,
	handleDownload,
}) => {
	const userId = useAuth().authData.userId;
	return (
		<ListItem role={undefined} dense button>
			<ListItemIcon>
				<Checkbox
					edge="start"
					tabIndex={-1}
					disableRipple
					id={`${sv.scriptVersionId}`}
				/>
			</ListItemIcon>
			<ListItemText
				id={sv.scriptVersionId}
				primary={`version: ${sv.versionNumber}`}
				secondary={`updated on ${sv.creationDate.split("T")[0]}`}
			/>
			<Button onClick={() => handleEditOnline(sv.scriptVersionId)}>
				Edit online
			</Button>
			<DownloadIcon onClick={() => handleDownload(sv)}></DownloadIcon>
			{userId === sv.creatorUserId &&(<DeleteIcon onClick={() => handleDelete(sv.scriptVersionId)}></DeleteIcon>)}
		</ListItem>
	);
};

export default ScriptVersionItem;
