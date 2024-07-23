import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import AxiosRequester from "../Axios/AxiosRequester.js";
import {getRandomInt} from "../utils/utils.js";
import Profile from "../components/Profile/Profile.jsx";
import PostItem from "../components/Post/PostItem.jsx";
import {TiArrowBack} from "react-icons/ti";
import { useNavigate, useLocation} from "react-router-dom";

const ContactDetails = () => {
    const [userDetails, setUserDetails] = useState({});
    const [loading, setLoading] = useState(true);
    const [userScripts, setUserScripts] = useState([]);
    const { userId, groupId } = useParams();
    const randomInt = getRandomInt(userId);
    const landscapeInt = userId % 3 + 1;
    const navigate = useNavigate();

    const location = useLocation();
    const currentPath = location.pathname;
    const firstPathSegment = currentPath.split("/")[1]; // Accéder à la première partie significative de l'URL

    const contactType = (() => {
        switch (firstPathSegment) {
            case "friend":
                return "Friend";
            case "group":
                return "Group";
            case "user":
                return "Public";
            default:
                return "Public";
        }
    });

    useEffect(() => {
        console.log(currentPath);
        console.log(contactType());
        getUserInfo();
        getUserScripts();
    }, [userId]);

    const getUserInfo = async () => {
        const user = await AxiosRequester.getInstance().getUserById(userId);
        console.log({ user, userId });
        if (user !== null) {
            setUserDetails(user);
        }
    }

    const getUserScripts = async () => {
        const result = await AxiosRequester.getInstance().getScriptByUserIdAndVisiblity(userId,contactType(),groupId);
        if (result !== null) {
            setUserScripts(result);
        }
    }

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom:"2px", cursor:"pointer" }}>
                <TiArrowBack onClick={() => navigate("/contacts")} />
            </div>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    backgroundImage: `url(/assets/Landscape${landscapeInt}.jpg)`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    position: 'relative',
                    height: '40vh', // Adjust as needed
                    width: '100%', // Adjust as needed
                    opacity: 1, // Adjust as needed
                    marginBottom: '10px',
                }}
            >
                <Profile randomInt={randomInt}
                         user={userDetails}
                         />
            </div>
            {userScripts?.length > 0 ? (
                    userScripts.map((post, index) => (
                        <PostItem key={index} post={post}/>
                    ))
                ) :
                <div>No Scripts Shared</div>
            }
        </div>
    );
};

export default ContactDetails;