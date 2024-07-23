import React, {useEffect} from "react";
import Card from "@mui/material/Card";
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import UserDescription from "./UserDescription.jsx";

function Profile({randomInt, user}) {

	return (
		<>
			<div style={{flexGrow: 1}}>
				<img
					src={`/assets/Profile${randomInt}.jpg`}
					alt="Profile"
					style={{
						width: '200px',
						height: '200px',
						borderRadius: '50%',
						objectFit: 'cover',
						marginLeft: '20px',
						border: '5px solid white'
					}}
				/>
			</div>
		<div style={{flexGrow: 3}}>
			<Card style={{padding: '20px', marginRight: '20px'}}>
				<div style={{fontSize: '20px', marginBottom: '5px'}}>
					{user.username}
				</div>
				<div style={{ display: 'flex', alignItems:'center' }}>
					<MailOutlineIcon />{user.email}
				</div>
			</Card>
			{user.description && (<UserDescription description={user.description}/>)}
		</div>
	</>
)
}

export default Profile;
