import React, { useEffect } from "react";
import { List } from "@mui/material";
import "../../styles/scriptList.css";

import { useAuth } from "../../hooks/AuthProvider.jsx";
import ScriptItem from "./ScriptItem.jsx";

const ScriptsList = ({ scripts, handleDelete }) => {
	const userId = useAuth().authData?.userId;
	const handleClick = (script) => {
		console.log(script);
	};

	useEffect(() => {
		console.log("inScriptsList");
		console.log(scripts);
	});

	return (
		<>
			<div>My scripts</div>
			<List id="scriptsList">
				{scripts?.length > 0 &&
					scripts
						?.filter((item) => item.userId == userId)
						?.map((script) => (
							<ScriptItem
								key={script.scriptId}
								script={script}
								handleClick={handleClick}
								handleDelete={handleDelete}
								userId={userId}
							/>
						))}
			</List>
			<div>My friends' scripts</div>
			<List id="scriptsList">
				{scripts?.length > 0 &&
					scripts
						?.filter((item) => item.userId != userId)
						?.map((script) => (
							<ScriptItem
								key={script.scriptId}
								script={script}
								handleClick={handleClick}
								handleDelete={handleDelete}
								userId={userId}
							/>
						))}
			</List>
		</>
	);
};

export default ScriptsList;
