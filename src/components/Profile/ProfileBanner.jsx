import { useEffect, useState } from "react";
import "../../styles/profileBanner.css";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import MarkEmailUnreadIcon from "@mui/icons-material/MarkEmailUnread";
import AxiosRq from "../../Axios/AxiosRequester.js";
import { FaBedPulse } from "react-icons/fa6";

function ProfileBanner({ username }) {
	const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
	const navigate = useNavigate();
	const [loaded, setLoaded] = useState(false);

	useEffect(() => {
		if (!username) {
			navigate("/login");
		} else {
			if (loaded) return;
			// check if user has unread messages
			getMessages();
			setHasUnreadMessages(true);
		}
	}, [username, loaded]);

	const getMessages = async () => {
		const groupRequests = await AxiosRq.getInstance().getGroupRequests();
		const friendRequests = await AxiosRq.getInstance().getFriendRequests();
		console.log({ groupRequests, friendRequests });
		if (groupRequests?.length === 0 && friendRequests?.length === 0) {
			setHasUnreadMessages(false);
		} else {
			setHasUnreadMessages(true);
		}
		setLoaded(true);
	};

	const handleNavigateMessage = () => {
		navigate("/message");
	};

	return (
		<>
			<div className="container--profile-banner">
				Welcome {username}
				{!hasUnreadMessages && (
					<MarkEmailReadIcon onClick={handleNavigateMessage} />
				)}
				{hasUnreadMessages && (
					<MarkEmailUnreadIcon
						onClick={handleNavigateMessage}
						sx={{ color: "red", cursor: "pointer" }}
					/>
				)}
				<Button onClick={() => navigate("/profile")}>
					<AccountCircleIcon />
				</Button>
			</div>
		</>
	);
}

export default ProfileBanner;
