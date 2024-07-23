import React, {useEffect} from 'react';
import CommentInput from "./CommentInput.jsx";
import {List} from "@mui/material";
import Comment from "./Comment.jsx";

function CommentContainer({comments, handleComment, handleDelete, handleEdit, editMode, setEditMode}) {
    const [newComment, setNewComment] = React.useState("");

    const handlePostComment = () => {
        if (newComment) {
            handleComment(newComment);
            setNewComment("");
        }
    }

    const cleanAndSetEditMode = (bool) => {
        setNewComment("");
        setEditMode(bool);
    }

    return (
        <>
            <div style={{marginLeft: 35}}>
                <CommentInput disabled={editMode} handleInput={setNewComment} handleClick={handlePostComment} value={newComment}/>
            </div>
            <List style={{marginLeft:35}}>
                {comments?.map((comment) => (
                    <Comment key={comment.commentId} comment={comment} handleDelete={handleDelete} handleEdit={handleEdit} setEditMode={cleanAndSetEditMode} editMode={editMode}/>
                ))}
            </List>
        </>
    );
}

export default CommentContainer;