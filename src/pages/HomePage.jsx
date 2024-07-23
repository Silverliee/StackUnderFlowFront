import React, {useEffect, useState} from 'react';
import PostItem from "../components/Post/PostItem.jsx";
import AxiosRequester from "../Axios/AxiosRequester.js";
import Button from '@mui/material/Button';
import {Typography} from "@mui/material";

const HomePage = () => {
    const [myPosts, setMyPosts] = useState([]);
    const [offset, setOffset] = useState(0);
    const [records, setRecords] = useState(5);

    useEffect(() => {
        getScriptsForFeed(offset,records)
    },[offset,records])

    const getScriptsForFeed= async (offset,records) => {
        const scripts = await AxiosRequester.getInstance().getScriptsForFeed({offset,records,visibility:"Public"});
        if (scripts) {
            setMyPosts([...myPosts, ...scripts]);
        }
    }

    const HandleAddMore = () => {
        setOffset(offset+5);
    }

    return (
        <div>
            <Typography variant="h3" color={"#1976d2"}>What's new today?</Typography>
            <br/>
            {myPosts?.length > 0 && (
                myPosts.map((post, index) => (
                    <PostItem key={index} post={post} style={{marginBottom:'10px'}}/>
                ))
            )
            }
            <Button size="small" onClick={HandleAddMore}>Add More</Button>
        </div>
    )
};

export default HomePage;