import React, { useState } from "react";
import Contact from "./Contact.jsx";
import { List } from "@mui/material";
import UnstyledPaginationIntroduction from "../Custom/UnstyledPaginationIntroduction.jsx";

function ContactList({
	contacts,
	contactsPaginated,
	handleDelete,
	handleItemSelected,
	handleChangePage,
	handleChangeRowsPerPage,
	page,
	rowsPerPage,
	profileType,
	groupId
}) {
	const [check, setCheck] = useState(false);

	return (
		<>
			<List id="contact-list">
				{contacts?.length > 0 &&
					contactsPaginated?.map((user) => (
						<Contact
							groupId={groupId}
							profileType={profileType}
							key={user.userId}
							user={user}
							check={check}
							handleDelete={handleDelete}
							handleItemSelected={handleItemSelected}
						/>
					))}
			</List>
			{contacts.length > 0 && (
				<UnstyledPaginationIntroduction
					numberOfResults={contacts.length}
					handleChangePage={handleChangePage}
					handleChangeRowsPerPage={handleChangeRowsPerPage}
					page={page}
					rowsPerPage={rowsPerPage}
				/>
			)}
		</>
	);
}

export default ContactList;
