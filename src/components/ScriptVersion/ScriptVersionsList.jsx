import React from "react";
import { List } from "@mui/material";
import ScriptVersionItem from "./ScriptVersionItem.jsx";

function ScriptVersionsList({
	dense,
	userId,
	handleDelete,
	handleEditOnline,
	handleDownload,
	scriptVersions,
}) {
	return (
		<List dense={dense}>
			{scriptVersions?.map((sv) => (
				<ScriptVersionItem
					key={sv.scriptVersionId}
					sv={sv}
					userId={userId}
					handleDelete={handleDelete}
					handleEditOnline={handleEditOnline}
					handleDownload={handleDownload}
				></ScriptVersionItem>
			))}
		</List>
	);
}

export default ScriptVersionsList;
