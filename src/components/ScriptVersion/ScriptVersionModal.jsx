import React, { useEffect, useState } from "react";
import { Modal, Box } from "@mui/material";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import UnstyledTextareaIntroduction from "../Custom/UnstyledTextareaIntroduction.jsx";
import UnstyledInputIntroduction from "../Custom/UnstyledInputIntroduction.jsx";

const ScriptVersionModal = ({
	script,
	open,
	handleClose,
	handleSubmitEvent,
	handleChange,
	setComment,
	setVersion,
	file,
	comment,
	version,
}) => {
	const acceptedFiles = script.language === "Python" ? ".py" : ".cs";

	const style = {
		position: "absolute",
		top: "50%",
		left: "50%",
		transform: "translate(-50%, -50%)",
		width: 400,
		bgcolor: "background.paper",
		border: "2px solid #000",
		boxShadow: 24,
		pt: 2,
		px: 4,
		pb: 3,
	};

	const VisuallyHiddenInput = styled("input")({
		clip: "rect(0 0 0 0)",
		clipPath: "inset(50%)",
		height: 1,
		overflow: "hidden",
		position: "absolute",
		bottom: 0,
		left: 0,
		whiteSpace: "nowrap",
		width: 1,
	});

	return (
		<>
			<Modal
				open={open}
				onClose={handleClose}
				aria-labelledby="parent-modal-title"
				aria-describedby="parent-modal-description"
			>
				<Box sx={{ ...style, width: 400 }}>
					<h2 id="parent-modal-title">
						Add a new version of {script.scriptName}
					</h2>
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							gap: "5px",
							marginBottom: "20px",
						}}
					>
						<div style={{ display: "flex", alignItems: "flex-end" }}>
							<Button
								component="label"
								role={undefined}
								variant="contained"
								tabIndex={-1}
								startIcon={<CloudUploadIcon />}
							>
								Upload file
								<VisuallyHiddenInput
									type="file"
									accept={acceptedFiles}
									onChange={(event) => handleChange(event)}
								/>
							</Button>
							<p>{file?.name}</p>
						</div>
						<div>
							<label>Comment: </label>
							<UnstyledTextareaIntroduction
								id="comment"
								name="comment"
								handleInput={(event) => setComment(event.target.value)}
							/>
						</div>
						<div>
							<label>Version: </label>
							<UnstyledInputIntroduction
								id="version"
								name="version"
								handleInput={(event) => setVersion(event.target.value)}
							/>
						</div>
					</div>
					<Button
						component="label"
						role={undefined}
						variant="contained"
						tabIndex={-1}
						onClick={handleSubmitEvent}
						disabled={!comment || !version || !file}
					>
						Submit
					</Button>
				</Box>
			</Modal>
		</>
	);
};

export default ScriptVersionModal;
