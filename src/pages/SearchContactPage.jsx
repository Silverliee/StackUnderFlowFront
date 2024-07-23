import { useEffect, useState } from "react";
import SearchBar from "../components/Search/SearchBar.jsx";
import { useAuth } from "../hooks/AuthProvider";
import AxiosRq from "../Axios/AxiosRequester";
import SearchContactList from "../components/Search/SearchContactList.jsx";
import { Modal, Box, Button } from "@mui/material";
import UnstyledTextareaIntroduction from "../components/Custom/UnstyledTextareaIntroduction.jsx";
import {useRelations} from "../hooks/RelationsProvider.jsx";

function SearchContactPage() {
	const [search, setSearch] = useState("");
	const [display, setDisplay] = useState("none");
	const [usersFound, setUsersFound] = useState([]);
	const [usersFoundPaginated, setUsersFoundPaginated] = useState([]);
	const [userToSendFriendRequestTo, setUserToSendFriendRequestTo] =
		useState(null);
	const [friendRequestMessage, setFriendRequestMessage] =
		useState("Let's be friends!");
	const [open, setOpen] = useState(false);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(5);
	const userId = useAuth().authData?.userId;
	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const style = {
		position: "absolute",
		top: "50%",
		left: "50%",
		transform: "translate(-50%, -50%)",
		width: 400,
		bgcolor: "background.paper",
		border: "2px solid #000",
		boxShadow: 24,
		pt: 2,
		px: 4,
		pb: 3,
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const [friendsId, setFriendsId] = useState([]);
	const {myFriends} = useRelations();
	useEffect(() => {
		setFriendsId(myFriends.map((friend) => friend.userId));
	}, [myFriends]);

	useEffect(() => {
		setUsersFoundPaginated(
			usersFound.slice(page * rowsPerPage, (page + 1) * rowsPerPage)
		);
	}, [rowsPerPage, page, usersFound]);

	const handleKeyDown = async (event) => {
		if (event.key === "Enter") {
			handleSearch();
		}
	};

	const handleReset = () => {
		setSearch("");
		setDisplay("none");
		setUsersFound([]);
		setPage(0);
		setRowsPerPage(5);
	};

	const handleSearch = async () => {
		const result = await AxiosRq.getInstance().searchUsersByKeyword(search);
		setUsersFound(result);
		setDisplay("block");
	};

	const handleCreateFriendRequest = async (userId, username) => {
		setUserToSendFriendRequestTo({ userId, username });
		setOpen(true);
	};

	const handleSubmitFriendRequest = async () => {
		const result = await AxiosRq.getInstance().createFriendRequest(
			userToSendFriendRequestTo.userId,
			friendRequestMessage
		);
		setOpen(false);
		setFriendRequestMessage("Let's be friends!");
	};

	return (
		<>
			<SearchBar
				search={search}
				handleKeyDown={handleKeyDown}
				handleReset={handleReset}
				handleSearch={handleSearch}
				setSearch={setSearch}
				setDisplay={setDisplay}
			/>
			<SearchContactList
				contacts={usersFound}
				usersFoundPaginated={usersFoundPaginated}
				display={display}
				search={search}
				userId={userId}
				page={page}
				rowsPerPage={rowsPerPage}
				friendsId={friendsId}
				handleCreateFriendRequest={handleCreateFriendRequest}
				handleChangePage={handleChangePage}
				handleChangeRowsPerPage={handleChangeRowsPerPage}
			/>
			<Modal open={open}>
				<Box sx={{ ...style, width: 400 }}>
					<h2 id="parent-modal-title">
						Send friend request to {userToSendFriendRequestTo?.username}
					</h2>
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							gap: "5px",
							marginBottom: "20px",
						}}
					>
						<div>
							<label>Message: </label>
							<UnstyledTextareaIntroduction
								value="Let's be friends!"
								id="friend-request-message"
								name="file-request-message"
								handleInput={(event) =>
									setFriendRequestMessage(event.target.value)
								}
							/>
						</div>
					</div>
					<Button
						component="label"
						role={undefined}
						variant="contained"
						tabIndex={-1}
						onClick={handleSubmitFriendRequest}
						disabled={!friendRequestMessage}
					>
						Submit
					</Button>
				</Box>
			</Modal>
		</>
	);
}

export default SearchContactPage;
