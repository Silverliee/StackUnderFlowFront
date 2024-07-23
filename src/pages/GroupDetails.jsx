import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AxiosRq from "../Axios/AxiosRequester";
import { TiArrowBack } from "react-icons/ti";
import { useNavigate } from "react-router-dom";
import { Grid, Typography } from "@mui/material";
import ContactList from "../components/Contact/ContactList.jsx";
import Button from "@mui/material/Button";
import ModalAddGroupMember from "../components/Group/ModalAddGroupMember.jsx";
import { useAuth} from "../hooks/AuthProvider.jsx";
import {enqueueSnackbar} from "notistack";
import AlertDialog from "../components/Custom/AlertDialog.jsx";

function GroupDetails() {
	const [group, setGroup] = useState({});
	const [members, setMembers] = useState([]);
	const [creator, setCreator] = useState({});
	const [membersPaginated, setMembersPaginated] = useState([]);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(5);
	const [open, setOpen] = useState(false);
	const [openAlert, setOpenAlert] = useState(false);
	const [text,setText] = useState("");
	const [selectedUser, setSelectedUser] = useState(null);
	const [userIdToRemove, setUserIdToRemove] = useState(null);

	const { groupId } = useParams();
	const { authData } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		AxiosRq.getInstance()
			.getGroupByGroupId(groupId)
			.then((res) => {
				let group = res;
				setGroup(group);
				AxiosRq.getInstance()
					.getGroupMembers(groupId)
					.then((response) => {
						let members = response;
						setMembers(members);
						setMembersPaginated(
							members.slice(page * rowsPerPage, (page + 1) * rowsPerPage)
						);
						let creator = members?.find(
							(member) => member.userId === group.creatorUserID
						);
						setCreator(creator);
					});
			});
	}, [groupId]);

	const handleRemoveMember = (userId) => {
		if(authData.userId === userId){
			const variant = 'error';
			let text = `Cannot remove yourself from the group as your are its creator. Consider deleting the group directly`;
			enqueueSnackbar(text, {variant, autoHideDuration: 2000});
		} else {
			setText("Are you sure about removing this user from the group ?")
			setOpenAlert(true);
			setUserIdToRemove(userId);
		}
	};

	useEffect(() => {
		console.log({
			page,
			rowsPerPage,
			members,
			length: members.length,
		});
		if((page) * rowsPerPage > members.length) {
			console.log('here');
			setPage(page-1);
		} else {
			console.log('there');
			setMembersPaginated(
				members.slice(page * rowsPerPage, (page + 1) * rowsPerPage)
			)
		}},[members, page, rowsPerPage]);

	const handleConfirmRemoveMember = async () => {
		setOpenAlert(false);
		await AxiosRq.getInstance().cancelGroupInvitation(group.groupId,userIdToRemove);
		const variant = 'success';
		console.log({
			userIdToRemove,
			membersFiltered: members.filter((member) => member.userId !== userIdToRemove),
				members
		});
		setMembers(members.filter((member) => member.userId !== userIdToRemove));
		setUserIdToRemove(null);
		let text = `User removed successfully from group.`;
		enqueueSnackbar(text, {variant, autoHideDuration: 2000});
	}

	const handleItemSelected = (userId) => {};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10) ?? 5);
		setPage(0);
	};

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleOpen = () => {
		setOpen(true);
	}

	const handleClose = () => {
		setOpen(false);
	};

	const isAlreadyMember = (id) => {
		return members?.find((member) => member.userId === id);
	}

	const handleSubmitRegisterEvent = async () => {
		if (selectedUser) {
			if (!isAlreadyMember(selectedUser.userId)) {
				const result = await AxiosRq.getInstance().inviteUserToGroup(groupId, selectedUser.userId, "Welcome in our group");
				if (result) {
					const variant = 'success';
					let text = `${selectedUser.username} has been invited successfully.`;
					enqueueSnackbar(text, {variant, autoHideDuration: 2000});
				} else {
					const variant = 'error';
					let text = `An error occured while inviting ${selectedUser.username}.`;
					enqueueSnackbar(text, {variant, autoHideDuration: 2000});
				}
				} else {
				const variant = 'error';
				let text = `${selectedUser.username} is already a member of the group`
				enqueueSnackbar(text, {variant, autoHideDuration: 2000});
			}
		}
		handleClose();
	}

	return (
		<>
			<div>Group Details</div>
			<div className="contacts--header" style={{display: "flex", justifyContent: "flex-end"}}>
				<TiArrowBack onClick={() => navigate("/contacts")} />
			</div>
			<Grid item xs={12} md={6}>
				<div style={{display: "flex", alignItems:'center', justifyContent:'space-around'}}>
					<div style={{flexGrow: 1}}>
						<img
							src={`/assets/Group${group?.groupId % 3 + 1}.jpg`}
							alt="Profile"
							style={{
								width: '80px',
								height: '80px',
								borderRadius: '50%',
								objectFit: 'cover',
								marginRight: '15px'
							}}
						/>
					</div>
					<div className="container--group-name"
						 style={{display: "flex", flexDirection: "column", flexGrow: 3}}>
						<p>{group?.groupName}</p>
						<p>Description: {group?.description}</p>
						<p>Creator: {creator?.username}</p>
					</div>
					{ authData.userId === group.creatorUserID && (<div style={{flexGrow: 1}}>
						<Button onClick={handleOpen}>Add Members</Button>
					</div>)}
				</div>
				<div>
					<Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
						Members
					</Typography>
					<ContactList
						groupId={groupId}
						profileType={"group-member"}
						contacts={members}
						contactsPaginated={membersPaginated}
						handleDelete={handleRemoveMember}
						handleItemSelected={handleItemSelected}
						page={page}
						rowsPerPage={rowsPerPage}
						handleChangePage={handleChangePage}
						handleChangeRowsPerPage={handleChangeRowsPerPage}
					/>
				</div>
				<ModalAddGroupMember open={open}
									 handleClose={handleClose}
									 setSelectedUser={setSelectedUser}
									 selectedUser={selectedUser}
									 handleSubmitRegisterEvent={handleSubmitRegisterEvent}/>
			</Grid>
			<AlertDialog text={text} open={openAlert} handleClose={() => setOpenAlert(false)} handleConfirm={handleConfirmRemoveMember}/>
		</>
	);
}

export default GroupDetails;
