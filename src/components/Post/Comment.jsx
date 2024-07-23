import React from 'react';
import Card from "@mui/material/Card";
import {useAuth} from "../../hooks/AuthProvider.jsx";
import EditIcon from '@mui/icons-material/Edit';
import ClearIcon from '@mui/icons-material/Clear';
import CommentEdit from "./CommentEdit.jsx";
import {ListItemText} from "@mui/material";
import {formatDateString} from "../../utils/utils.js";

function Comment({comment, handleEdit, handleDelete, setEditMode, editMode}) {
    const [open, setOpen] = React.useState(false);
    const [text,setText] = React.useState(comment.description);
    const {authData} = useAuth();

    const handleEditComment = () => {
        if (text) {
            handleEdit(comment.commentId, text);
            setOpen(false);
            setEditMode(false);
        }
    }

    const handleCancel = () => {
        setOpen(false);
        setEditMode(false);
    }

    const handleOpenEdit = () => {
        setOpen(true);
        setEditMode(true);
    }

    return (
        <div style={{display:"flex"}}>
            {open ?
                <div style={{marginBottom:10}}>
                    <CommentEdit handleInput={setText} handleClick={handleEditComment} handleCancel={handleCancel} value={text}/>
                </div>
            :
                (<div style={{display:"flex"}}>
                    <Card sx={{width: 500, maxWidth: 500, marginBottom: 4}}>
                        <ListItemText
                            id={comment.commentId}
                            primary={comment?.description}
                            secondary={`by ${comment?.userName} on ${formatDateString(comment?.creationDate)}`}
                        />
                </Card>
                {comment?.userId == authData.userId && !editMode && (
                    <div>
                        <EditIcon style={{cursor: "pointer"}} onClick={handleOpenEdit}/>
                        <ClearIcon style={{cursor:"pointer"}} onClick={() => handleDelete(comment.commentId)}/>
                    </div>
                )}
                </div>)
            }
        </div>
    );
}

export default Comment;