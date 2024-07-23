import NotificationItem from "./NotificationItem.jsx";
import {useEffect} from "react";

function NotificationsList({ messageList, handleAccept, handleDecline, group }) {

	return (
		<>
			{messageList?.length > 0 &&
				messageList?.map((request, index) => (
					<NotificationItem
						key={index}
						title={request.friendName ? request.friendName : request.groupName}
						message={request.message}
						type={group ? "groupInvitation" : "userInvitation"}
						id={group ? request.groupId : request.userId}
						handleDecline={() => handleDecline(group ? request.groupId : request.userId)}
						handleAccept={() => handleAccept(group ? request.groupId : request.userId)}
					/>
				))}
		</>
	);
}

export default NotificationsList;
