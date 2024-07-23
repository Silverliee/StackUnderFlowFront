import React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import AddReactionIcon from "@mui/icons-material/AddReaction";
import UnstyledPaginationIntroduction from "../Custom/UnstyledPaginationIntroduction.jsx";
import Button from "@mui/material/Button";
import {useNavigate} from "react-router-dom";

function SearchContactList({
	contacts,
	usersFoundPaginated,
	handleCreateFriendRequest,
	handleChangePage,
	handleChangeRowsPerPage,
	page,
	rowsPerPage,
	friendsId,
}) {
	const navigate = useNavigate();
	return (
		<>
			<List id="contact-list">
				{contacts?.length > 0 &&
					usersFoundPaginated?.map((user) => (
						<ListItem key={user.userId} role={undefined} dense button>
							<img
								src={`/assets/Profile${user.userId%7+1}.jpg`}
								alt="Profile"
								style={{
									width: '40px',
									height: '40px',
									borderRadius: '50%',
									objectFit: 'cover',
									marginLeft: '5px',
									marginRight:'15px'
								}}
							/>
							<ListItemText
								id={user.userId}
								primary={user.username}
							/>
							<Button onClick={() => navigate(`/friend/${user.userId}`)}>See Details</Button>
							{!friendsId.includes(user.userId) ? (
								<AddReactionIcon
									onClick={() =>
										handleCreateFriendRequest(user.userId, user.username)
									}
								></AddReactionIcon>
							)
							:
								<div style={{width:'25px'}}></div>
							}
						</ListItem>
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

export default SearchContactList;
