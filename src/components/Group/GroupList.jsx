import React, { useState } from "react";
import Group from "./Group.jsx";
import { List } from "@mui/material";
import UnstyledPaginationIntroduction from "../Custom/UnstyledPaginationIntroduction.jsx";

function GroupList({
	groups,
	groupsPaginated,
	handleDelete,
	handleItemSelected,
	handleChangePage,
	handleChangeRowsPerPage,
	page,
	rowsPerPage,
}) {
	const [check, setCheck] = useState(false);

	return (
		<>
			<List id="group-list">
				{groups?.length > 0 &&
					groupsPaginated?.map((group) => (
						<Group
							key={group.groupId}
							group={group}
							check={check}
							handleDelete={handleDelete}
							handleItemSelected={handleItemSelected}
						/>
					))}
			</List>
			{groups?.length > 0 && (
				<UnstyledPaginationIntroduction
					numberOfResults={groups.length}
					handleChangePage={handleChangePage}
					handleChangeRowsPerPage={handleChangeRowsPerPage}
					page={page}
					rowsPerPage={rowsPerPage}
				/>
			)}
		</>
	);
}

export default GroupList;
