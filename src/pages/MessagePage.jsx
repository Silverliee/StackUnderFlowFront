import { useEffect, useState } from "react";
import { useAuth } from "../hooks/AuthProvider";
import NotificationsList from "../components/Message/NotificationsList.jsx";
import {
	Accordion,
	AccordionDetails,
	AccordionSummary, Autocomplete, TextField,
	Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AxiosRq from "../Axios/AxiosRequester";
import {useRelations} from "../hooks/RelationsProvider.jsx";

function MessagePage() {
	const [friendRequests, setFriendRequests] = useState([]);
	const [groupRequests, setGroupRequests] = useState([]);

	const { userId } = useAuth();
	const relations = useRelations();

	useEffect(() => {
		setFriendRequests(relations.friendRequests);
		setGroupRequests(relations.groupRequests);
	}, [userId,relations]);

	const handleDeclineFriendRequest = (friendId) => {
		AxiosRq.getInstance()
			.declineFriendRequest(friendId)
			.then(() => {
				relations.dispatchFriendRequests({
					type: 'REMOVE_FRIEND_REQUEST',
					payload: {friendId},
				});
			});
	};

	const handleAcceptFriendRequest = (friendId) => {
		AxiosRq.getInstance()
			.acceptFriendRequest(friendId)
			.then(() => {
				relations.dispatchFriendRequests({
					type: 'REMOVE_FRIEND_REQUEST',
					payload: {friendId},
				});
				relations.fetchFriends();
			});
	};

	const handleDeclineGroupRequest = (groupId) => {
		AxiosRq.getInstance()
			.declineGroupInvitation(groupId)
			.then(() => {
				relations.dispatchGroupRequests({
					type: 'REMOVE_GROUP_REQUEST',
					payload: {groupId},
				});
			});
	};

	const handleAcceptGroupRequest = (groupId) => {
		AxiosRq.getInstance()
			.acceptGroupInvitation(groupId)
			.then(() => {
				relations.dispatchGroupRequests({
					type: 'REMOVE_GROUP_REQUEST',
					payload: {groupId},
				});
				relations.fetchGroups();
			});
	};

	return (
		<>
			<div>MessagePage</div>
			<div>
				{friendRequests?.length > 0 && (
					<Accordion defaultExpanded>
						<AccordionSummary
							expandIcon={<ExpandMoreIcon />}
							aria-controls="panel1-content"
							id="panel1-header"
						>
							<Typography>Friend Requests</Typography>
						</AccordionSummary>
						<AccordionDetails>
							<NotificationsList
								group={false}
								handleAccept={handleAcceptFriendRequest}
								handleDecline={handleDeclineFriendRequest}
								messageList={friendRequests}
							/>
						</AccordionDetails>
					</Accordion>
				)}
				{groupRequests?.length > 0 && (
					<Accordion defaultExpanded>
						<AccordionSummary
							expandIcon={<ExpandMoreIcon />}
							aria-controls="panel2-content"
							id="panel2-header"
						>
							<Typography>Group Requests</Typography>
						</AccordionSummary>
						<AccordionDetails>
							<NotificationsList
								group={true}
								handleAccept={handleAcceptGroupRequest}
								handleDecline={handleDeclineGroupRequest}
								messageList={groupRequests}
							/>
						</AccordionDetails>
					</Accordion>
				)}
			</div>
			{friendRequests?.length === 0 && groupRequests?.length === 0 && (
				<img src={'assets/NoMessages.jpg'} alt={'No Messages Image'} style={{width:'60vw'}}/>
			)}
		</>
	);
}

export default MessagePage;
