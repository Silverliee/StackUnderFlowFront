import React, { useEffect } from "react";
import {
	ListItem,
	ListItemIcon,
	Checkbox,
	ListItemText,
	Chip, Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import { Link, useLocation } from "react-router-dom";
import AxiosRq from "../../Axios/AxiosRequester.js";
import {HtmlTooltip} from "../Custom/HtmlTooltip.jsx";
import BookmarkIcon from "@mui/icons-material/Bookmark.js";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder.js";

export const ScriptItem = ({
							   script,
							   handleDelete,
							   userId,
							   handleItemSelected,
							   check,
							   handleOnClick,
	handleFavorite,
	handleUnfavorite
						   }) => {
	const location = useLocation();
	const pathSegments = location.pathname.split("/");
	const lastSegment = pathSegments[pathSegments.length - 1] || "/";

	const handleDownload = async (event) => {
		event.stopPropagation(); // Empêche la propagation de l'événement au ListItem parent
		const data = await AxiosRq.getInstance().getScriptVersionBlob(script.scriptId);
		const element = document.createElement("a");
		const file = new Blob([data], { type: "text/plain" });
		element.href = URL.createObjectURL(file);
		element.download =
			script.scriptName +
			(script.programmingLanguage == "Python" ? ".py" : ".csx");
		document.body.appendChild(element); // Nécessaire pour que cela fonctionne dans Firefox
		element.click();
		document.body.removeChild(element);
	};

	const handleDeleteClick = (event) => {
		event.stopPropagation(); // Empêche la propagation de l'événement au ListItem parent
		handleDelete(script.scriptId);
	};

	const handleClick = (event) => {
		// Vérifie si l'élément cliqué est une icône ou un lien, et non le ListItem
		if (
			event.target.tagName.toLowerCase() !== "svg" &&
			event.target.tagName.toLowerCase() !== "path" &&
			event.target.tagName.toLowerCase() !== "a" &&
			event.target.tagName.toLowerCase() !== "input"
		) {
			handleOnClick(script.scriptId);
		}
	};

	return (
		<HtmlTooltip
			title={
				<React.Fragment>
					<Typography color="inherit">Input types:</Typography>
					<b>{script.inputScriptType.replaceAll(',',' / ')}</b> .{' '}
					<Typography color="inherit">Output types:</Typography>
					<b>{script.outputScriptType.replaceAll(',',' / ')}</b>.{' '}
				</React.Fragment>
			}
		>
		<ListItem
			key={script.scriptId}
			role={undefined}
			dense
			button
			onClick={handleClick}
		>
			<div style={{ display: "flex", width: "100%" }}>
				<div style={{ flex: "1", display: "flex" }}>
					<ListItemIcon>
						{lastSegment === "script" && script.userId === userId && (
							<Checkbox
								checked={check}
								key={script.scriptId}
								edge="start"
								tabIndex={-1}
								disableRipple
								id={`${script.scriptId}`}
								onChange={handleItemSelected}
							/>
						)}
					</ListItemIcon>
					<ListItemText
						id={script.scriptId}
						primary={script.scriptName}
						secondary={script.programmingLanguage}
					/>
				</div>
				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						flex: "1",
					}}
				>
					<ListItemText
						id={script.scriptId + "1"}
						primary={"By " + script.creatorName}
					/>
					<div style={{ display: "flex", justifyContent: "space-between" }}>
						<Link to={`/script/${script.scriptId}`}>See details</Link>
						<DownloadIcon
							onClick={handleDownload}
							style={{ marginLeft: "10px", cursor: "pointer" }}
						/>
						{lastSegment === "script" && script.userId === userId && (
							<DeleteIcon
								onClick={handleDeleteClick}
								style={{ marginLeft: "10px", cursor: "pointer" }}
							/>
						)}
						{lastSegment === "script" && script.userId !== userId && (
							script.isFavorite ?
									<BookmarkIcon style={{marginLeft: "10px", cursor: "pointer"}} onClick={() => handleUnfavorite(script.scriptId)}/>
									:
									<BookmarkBorderIcon style={{marginLeft: "10px", cursor: "pointer"}}
														onClick={() => handleFavorite(script.scriptId)}/>
						)}
					</div>
				</div>
			</div>
		</ListItem>
		</HtmlTooltip>
	);
};

export default ScriptItem;
