import React, { useEffect } from "react";
import Editor from "@monaco-editor/react";
import { Button, Input, Modal, Box } from "@mui/material";
import { useState } from "react";
import AxiosRq from "../Axios/AxiosRequester";
import UnstyledTextareaIntroduction from "./Custom/UnstyledTextareaIntroduction.jsx";
import UnstyledInputIntroduction from "./Custom/UnstyledInputIntroduction.jsx";
import { useAuth } from "../hooks/AuthProvider";
import AlertDialog from "./Custom/AlertDialog.jsx";

function EditorFrame({
	scriptVersionIdEdited,
	scriptName,
	scriptId,
	setOpenEditor,
	handleCloseAndSaveAndAddVersionFromEditor,
	creatorId
}) {
	const [fileName, setFileName] = useState("");
	const [versionNumber, setVersionNumber] = useState("");
	const [file, setFile] = useState(null);
	const [fileValue, setFileValue] = useState("");
	const [newFileValue, setNewFileValue] = useState("");
	const [comment, setComment] = useState("");
	const [openFileNameInput, setOpenFileNameInput] = useState(false);
	const [openVersionNumberInput, setOpenVersionNumberInput] = useState(false);
	const [backup, setBackup] = useState("");
	const [reset, setReset] = useState(false);
	const [open, setOpen] = useState(false);
	const userId = useAuth().authData?.userId;

	useEffect(() => {
		handleGetScriptVersionBlob(scriptVersionIdEdited);
	}, [scriptVersionIdEdited]);

	useEffect(() => {
		if (reset) {
			setFileValue(backup);
			setNewFileValue(backup);
			setReset(false);
		}
	}, [reset, backup]);

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

	const handleGetScriptVersionBlob = async (scriptVersionIdEdited) => {
		//blob given as a string
		const file = await AxiosRq.getInstance().getScriptVersionBlob(
			scriptVersionIdEdited
		);
		if (file) {
			setFileValue(file);
			setNewFileValue(file);
			setFileName(file.fileName);
			setFile(file);
			setBackup(file);
		}
	};
	function handleEditorChange(value, event) {
		setNewFileValue(value);
	}

	function handleReset() {
		setOpen(true);
	}

	const handleConfirm = () => {
		setFileValue(newFileValue);
		setReset(true);
		setOpen(false);
	}

	function handleCloseAndSave() {
		setOpenFileNameInput(false);
		const element = document.createElement("a");
		const file = new Blob([newFileValue], { type: "text/plain" });
		element.href = URL.createObjectURL(file);
		element.download = fileName;
		document.body.appendChild(element); // Required for this to work in FireFox
		element.click();
		document.body.removeChild(element); // Clean up after the download
		setFileValue(newFileValue);
	}

	const handleCloseAndSaveAndAddVersion = async () => {
		setOpenVersionNumberInput(false);
		const data = {
			ScriptId: scriptId,
			VersionNumber: versionNumber,
			SourceScriptBinary: newFileValue,
			Comment: comment,
		};
		handleCloseAndSaveAndAddVersionFromEditor(data);
	};

	function clearModal() {
		setOpenFileNameInput(false);
		setOpenVersionNumberInput(false);
		setComment("");
		setVersionNumber("");
		setFileName("");
	}

	function handleSaveAndDownload() {
		setOpenFileNameInput(true);
	}

	function handleSaveAndAddVersion() {
		setOpenVersionNumberInput(true);
	}
	function handleEditorValidation(markers) {
		// model markers
		markers.forEach((marker) => console.log("onValidate:", marker.message));
	}

	return (
		<div>
			<Modal
				open={openFileNameInput}
				onClose={() => clearModal()}
				aria-labelledby="parent-modal-title"
				aria-describedby="parent-modal-description"
			>
				<Box sx={{ ...style, width: 400 }}>
					<h2 id="parent-modal-title">Add a new version of {scriptName}</h2>
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							gap: "5px",
							marginBottom: "20px",
						}}
					>
						<div>
							<label>File name: </label>
							<UnstyledTextareaIntroduction
								id="file-name"
								name="file-name"
								handleInput={(event) => setFileName(event.target.value)}
							/>
						</div>
					</div>
					<Button
						component="label"
						role={undefined}
						variant="contained"
						tabIndex={-1}
						onClick={handleCloseAndSave}
						disabled={!fileName}
					>
						Submit
					</Button>
				</Box>
			</Modal>
			<Modal
				open={openVersionNumberInput}
				onClose={() => clearModal()}
				aria-labelledby="parent-modal-title"
				aria-describedby="parent-modal-description"
			>
				<Box sx={{ ...style, width: 400 }}>
					<h2 id="parent-modal-title">Add a new version of {scriptName}</h2>
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							gap: "5px",
							marginBottom: "20px",
						}}
					>
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
								handleInput={(event) => setVersionNumber(event.target.value)}
							/>
						</div>
					</div>
					<Button
						component="label"
						role={undefined}
						variant="contained"
						tabIndex={-1}
						onClick={handleCloseAndSaveAndAddVersion}
						disabled={!comment || !versionNumber}
					>
						Submit
					</Button>
				</Box>
			</Modal>
			<div style={{ display: "flex" }}>
				<Button onClick={handleSaveAndDownload}>Save & Download</Button>
				{creatorId == userId && (<Button onClick={handleSaveAndAddVersion}>Save & Add Version</Button>)}
				<Button onClick={handleReset}>Reset</Button>
				<Button
					onClick={() => {
						clearModal();
						setOpenEditor(false);
					}}
				>
					Back to details
				</Button>
			</div>
			<Editor
				height="80vh"
				theme="vs-dark"
				path={file?.name}
				language={file?.name?.endsWith(".py") ? "python" : "csharp"}
				value={fileValue}
				onChange={handleEditorChange}
				onValidate={handleEditorValidation}
			/>
			<AlertDialog text={"Are you sure you want to discard your changes?"} open={open} handleClose={() => setOpen(false)} handleConfirm={handleConfirm}/>
		</div>
	);
}

export default EditorFrame;
