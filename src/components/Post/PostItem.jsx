import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { PiFileCSharpDuotone } from "react-icons/pi";
import { SiPython } from "react-icons/si";
import CommentContainer from "./CommentContainer.jsx";
import AxiosRq from "../../Axios/AxiosRequester.js";
import {useEffect} from "react";
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import {ListItemText} from "@mui/material";
import {useNavigate} from "react-router-dom";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore.js";
import AccordionDetails from "@mui/material/AccordionDetails";
import {useAuth} from "../../hooks/AuthProvider.jsx";
import {formatDateTimeString} from "../../utils/utils.js";

export default function PostItem({post}) {
    const [comments, setComments] = React.useState([{text:"coucou"},{text:"coucou2"},{text:"coucou3"}]);
    const [open, setOpen] = React.useState(false);
    const [editMode, setEditMode] = React.useState(false);
    const [numberOfLikes, setNumberOfLikes] = React.useState(post?.numberOfLikes);
    const [isLiked, setIsLiked] = React.useState(post?.isLiked);

    const [isFavorite, setIsFavorite] = React.useState(post?.isFavorite);
    const navigate = useNavigate();
    const handleOpenComments = () => {
        setOpen(!open);
    }

    const imageId = (post.scriptId % 5) + 1
    const {authData} = useAuth();
    const userId = authData.userId;

    useEffect(() => {
        console.log(post);
        fetchComments()
    },[post.scriptId]);

    const fetchComments = async () => {
        AxiosRq.getInstance().getComments(post.scriptId).then((res) => {
            if(res) {
                setComments(res)
            }
        })
    }

    const handleComment = async (newComment) => {
        //post newComment
        await AxiosRq.getInstance().postComment(post.scriptId, newComment);
        //add it to comments List
        fetchComments();
    }

    const handleDelete = async (commentId) => {
        const result = await AxiosRq.getInstance().deleteComment(commentId);
        if (result === "success") {
            setComments(comments.filter((comment) => comment.commentId !== commentId));
        }
    }

    const handleEdit = async (commentId, newText) => {
        const newComment = await AxiosRq.getInstance().updateComment(commentId,newText);
        fetchComments();
    }

    const handleDownload = async () => {
        const data = await AxiosRq.getInstance().getScriptVersionBlob(
            post.scriptId
        );
        const element = document.createElement("a");
        const file = new Blob([data], { type: "text/plain" });
        element.href = URL.createObjectURL(file);
        element.download =
            post.scriptName +
            (post.programmingLanguage == "Python" ? ".py" : ".csx");
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
        document.body.removeChild(element);
    };

    const handleUnlike = async (scriptId) => {
        const result = await AxiosRq.getInstance().unlike(scriptId);
        if (result === "success") {
            setNumberOfLikes(numberOfLikes-1);
            setIsLiked(false);
        }
    }
    const handleLike = async (scriptId) => {
        const result = await AxiosRq.getInstance().like(scriptId);
        if (result === "success") {
            setNumberOfLikes(numberOfLikes+1);
            setIsLiked(true);
        }
    }

    const handleUnfavorite = async (scriptId) => {
        const result = await AxiosRq.getInstance().removeAsFavoriteScript(scriptId);
        setIsFavorite(false);
    }

    const handleFavorite = async (scriptId) => {
        const result = await AxiosRq.getInstance().putAsFavoriteScript(scriptId);
        console.log(result);
        if(result){
            setIsFavorite(true);
        }
    }

    return (
        <>
            <Accordion defaultExpanded>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2-content"
                    id={post.scriptId}
                >
                    <Typography>{post.scriptName} By {post.creatorName}</Typography>
                </AccordionSummary>
                <AccordionDetails>

            <Card sx={{ maxWidth: 600, marginBottom: 4 }}>
                <CardMedia
                    component="img"
                    alt="random_picture"
                    height="140"
                    image={post.source ? post.source : `/assets/postImage${imageId}.jpg`}
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {post.scriptName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {post.description}
                    </Typography>
                    <Typography variant="body2" color="blue" style={{textAlign:"end"}}>
                        <Button onClick={() => navigate(`/user/${post.userId}`)}>By {post.creatorName}</Button>
                    </Typography>
                    <Typography variant={"caption"} color={"black"} style={{textAlign:"end"}}>
                        <div>{formatDateTimeString(post.creationDate)}</div>
                    </Typography>
                    <br/>
                    <Button onClick={handleDownload}>
                        {post.programmingLanguage == "Csharp" ? <PiFileCSharpDuotone style={{marginRight: 4}}/> :
                            <SiPython style={{marginRight: 4}}/>
                        } Try me !
                    </Button>
                </CardContent>
                <div className={"FooterPost"} style={{display: "flex", justifyContent: "space-between"}}>
                    <div>
                        <Button size="small" onClick={handleOpenComments}>Comments ({comments.length})</Button>
                    </div>
                    <CardActions style={{display: "flex", justifyContent: 'space-between'}}>
                        <div style={{alignContent: "center"}}>{isLiked ?
                            <FavoriteIcon style={{cursor: "pointer"}} onClick={() => handleUnlike(post.scriptId)}/>
                            :
                            <FavoriteBorderIcon style={{cursor: "pointer"}} onClick={() => handleLike(post.scriptId)}/>
                        }
                            {numberOfLikes}
                        </div>
                        {userId !== post.userId && (<div style={{alignContent: "center"}}>{isFavorite ?
                            <BookmarkIcon style={{cursor: "pointer"}} onClick={() => handleUnfavorite(post.scriptId)}/>
                            :
                            <BookmarkBorderIcon style={{cursor: "pointer"}}
                                                onClick={() => handleFavorite(post.scriptId)}/>}
                        </div>
                        )}

                    </CardActions>
                </div>
                    {open && (
                        <CommentContainer key={post.scriptId} comments={comments} handleComment={handleComment}
                                          handleDelete={handleDelete} handleEdit={handleEdit} editMode={editMode}
                                          setEditMode={setEditMode}/>
                    )}
            </Card>
                </AccordionDetails>
            </Accordion>
        </>
    );
}
