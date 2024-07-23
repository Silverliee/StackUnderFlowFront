import React from 'react';
import UnstyledTextareaIntroduction from "../Custom/UnstyledTextareaIntroduction.jsx";
import Button from "@mui/material/Button";

function CommentEdit({handleInput, handleClick,handleCancel, value}) {
    return (
        <div style={{display:"flex"}}>
            <UnstyledTextareaIntroduction
                id="newScriptName"
                name="newScriptName"
                placeholder={"Leave a comment"}
                handleInput={(event) => handleInput(event.target.value)}
                value={value}
            />
            <Button onClick={handleClick}>Edit</Button>
            <Button onClick={handleCancel}>X</Button>
        </div>
    );
}

export default CommentEdit;