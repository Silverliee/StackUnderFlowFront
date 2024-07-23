import React from 'react';
import UnstyledInputIntroduction from "../Custom/UnstyledInputIntroduction.jsx";
import UnstyledTextareaIntroduction from "../Custom/UnstyledTextareaIntroduction.jsx";
import Button from "@mui/material/Button";

function CommentInput({handleInput, handleClick, value, disabled}) {
    return (
        <div style={{display:"flex"}}>
            <UnstyledTextareaIntroduction
                disabled={disabled}
                style={{marginLeft:4}}
                id="newScriptName"
                name="newScriptName"
                placeholder={"Leave a comment"}
                handleInput={(event) => handleInput(event.target.value)}
                value={value}
            />
            <Button onClick={handleClick}>Post</Button>
        </div>
    );
}

export default CommentInput;