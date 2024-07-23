import React, { useEffect, useState } from "react";
import ContactList from "../components/Contact/ContactList.jsx";
import AxiosRq from "../Axios/AxiosRequester";
import {useRelations} from "../hooks/RelationsProvider.jsx";
import AlertDialog from "../components/Custom/AlertDialog.jsx";

function FriendListPage() {
	const [friendsList, setFriendsList] = useState([]);
	const [friendsPaginated, setFriendsPaginated] = useState([]);
	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(5);
	const [open, setOpen] = useState(false);
	const [text,setText] = useState("");
	const [userIdToDelete, setUserIdToDelete] = useState("");
	const { myFriends, myGroups, myFollows, dispatchFriends } = useRelations();

	useEffect(() => {
		setFriendsList(myFriends);
	}, [myFriends]);

	useEffect(() => {
		setFriendsPaginated(
			friendsList.slice(page * rowsPerPage, (page + 1) * rowsPerPage)
		);
	}, [rowsPerPage, page, friendsList]);

	const handleDeleteFriend = (userId) => {
		setText("Are you sure you want to delete this friend?");
		setOpen(true);
		setUserIdToDelete(userId);
	}
	const handleConfirm = () => {
		setOpen(false);
		AxiosRq.getInstance().deleteFriend(userIdToDelete);
		const friend = friendsList.filter((friend) => friend.userId == userIdToDelete)[0];
		dispatchFriends({type: "REMOVE_FRIEND", payload: friend});
		setFriendsList(friendsList.filter((friend) => friend.userId !== userIdToDelete));
		setUserIdToDelete("");
	};
	const handleItemSelected = (userId) => {};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10) ?? 5);
		setPage(0);
	};

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	return (
		<>
			<ContactList
				profileType={"friend"}
				contacts={friendsList}
				contactsPaginated={friendsPaginated}
				handleDelete={handleDeleteFriend}
				handleItemSelected={handleItemSelected}
				page={page}
				rowsPerPage={rowsPerPage}
				handleChangePage={handleChangePage}
				handleChangeRowsPerPage={handleChangeRowsPerPage}
			/>
			<AlertDialog text={text} open={open} handleClose={() => setOpen(false)} handleConfirm={handleConfirm}/>
		</>
	);
}

export default FriendListPage;
