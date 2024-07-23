import React, { useState } from "react";
import { Modal, Box } from "@mui/material";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import UnstyledTextareaIntroduction from "../components/Custom/UnstyledTextareaIntroduction.jsx";
import UnstyledInputIntroduction from "../components/Custom/UnstyledInputIntroduction.jsx";
import AxiosRq from "../Axios/AxiosRequester";
import UnstyledSelectIntroduction from "../components/Custom/UnstyledSelectIntroduction.jsx";
import { useScripts} from "../hooks/ScriptsProvider.jsx";
import MultipleSelectCheckmarks from "../components/Custom/MultipleSelectCheckmarks.jsx";
import {enqueueSnackbar} from "notistack";

const SharingPage = ({ script }) => {
	const [open, setOpen] = useState(false);
	const [file, setFile] = useState(null);
	const [scriptName, setScriptName] = useState("");
	const [description, setDescription] = useState("");
	const [language, setLanguage] = useState("");
	const [inputType, setInputType] = useState(["None"]);
	const [outputType, setOutputType] = useState(["None"]);
	const [visibility, setVisibility] = useState("Public");

	const acceptedFiles = [".py", ".csx"];
	const acceptedFormat = ["None",".png",".jpeg",".txt",".pdf",".xlsx"];
	const { dispatch } = useScripts();

	const style = {
		//transform: "translate(-50%, -50%)",
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
	const handleOpen = () => {
		setOpen(true);
	};
	const handleClose = () => {
		setOpen(false);
		setFile(null);
		setScriptName("");
		setDescription("");
		setLanguage("");
		setInputType("None");
		setOutputType("None");
		setVisibility("Public");
	};

	const handleSubmitEvent = async () => {
		console.log("submitting", {
			scriptName,
			description,
			language,
			inputType,
			outputType,
			visibility,
			file,
		});
		let inputTypeFormatted = inputType.length > 1 ? inputType.filter((item) => item !== "None") : inputType
		let outputTypeFormatted = outputType.length > 1 ? outputType.filter((item) => item !== "None") : outputType

		let result = await AxiosRq.getInstance().postScript({
			ScriptName: scriptName,
			Description: description,
			ProgrammingLanguage: language,
			InputScriptType: inputTypeFormatted.join(','),
			OutputScriptType: outputTypeFormatted.join(','),
			Visibility: visibility,
			SourceScriptBinary: file,
		});
		if (!result) {
			const variant = 'error';
			enqueueSnackbar("Error uploading script", {variant, autoHideDuration: 2000});
		} else {
			const variant = 'success';
			enqueueSnackbar("Script uploaded successfully", {variant, autoHideDuration: 2000});
			dispatch({type: "ADD_SCRIPTS", payload: result});
		}

		handleReset();
	};

	function handleReset() {
		setFile(null);
		setScriptName("");
		setDescription("");
		setLanguage("");
		setInputType(["None"]);
		setOutputType(["None"]);
		setVisibility("Public");
	}

	const handleChangeInput = (event) => {
		const {
			target: { value },
		} = event;
		setInputType(
			// On autofill we get a stringified value.
			typeof value === 'string' ? value.split(',') : value,
		);
	};

	const handleChangeOutput = (event) => {
		const {
			target: { value },
		} = event;
		setOutputType(
			// On autofill we get a stringified value.
			typeof value === 'string' ? value.split(',') : value,
		);
	};

	async function handleChangeFile(event) {
		setFile(null);
		const selectedFile = event.target.files[0];
		if (selectedFile && selectedFile.type) {
			const fileExtension = selectedFile.name.split(".").pop();
			if (fileExtension === "py") {
				setLanguage("Python");
			} else if (fileExtension === "csx") {
				setLanguage("Csharp");
			}
			setFile(selectedFile);
		} else {
			const variant = 'error';
			enqueueSnackbar("Invalid file type", {variant, autoHideDuration: 2000});
		}
	}

	return (
		<>
			<Box sx={{ ...style, width: 400 }}>
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
								onChange={handleChangeFile}
							/>
						</Button>
						<p>{file?.name}</p>
					</div>
					<div>
						<label>Name: </label>
						<UnstyledInputIntroduction
							id="scriptName"
							name="scriptName"
							value={scriptName}
							handleInput={(event) => setScriptName(event.target.value)}
						/>
					</div>
					<div>
						<label>Description: </label>
						<UnstyledTextareaIntroduction
							id="description"
							name="description"
							value={description}
							handleInput={(event) => setDescription(event.target.value)}
						/>
					</div>
					<div>
						<label>Language: </label>
						<UnstyledInputIntroduction
							id="version"
							name="version"
							value={language}
							readonly={true}
						/>
					</div>
					<div>
						<label>InputType: </label>
						<MultipleSelectCheckmarks formats={acceptedFormat} handleChange={handleChangeInput}
												  value={inputType} tag={'Input'}
						/>
					</div>
					<div>
						<label>OutputType: </label>
						<MultipleSelectCheckmarks formats={acceptedFormat} handleChange={handleChangeOutput}
												  value={outputType} tag={'Output'}
						/>
					</div>
					<div>
						<label>Visibility: </label>
						<br />
						<UnstyledSelectIntroduction
							id="visibility"
							name="visibility"
							options={["Public", "Friend", "Group", "Private"]}
							value={visibility}
							handleSelectChange={(event) =>
								setVisibility(event.target.innerHTML)
							}
							defaultValue={visibility}
						/>
					</div>
				</div>
				<Button
					component="label"
					role={undefined}
					variant="contained"
					tabIndex={-1}
					onClick={handleSubmitEvent}
					disabled={
						!description ||
						!scriptName ||
						!language ||
						inputType.length === 0 ||
						outputType.length === 0 ||
						!visibility ||
						!file
					}
				>
					Submit
				</Button>
			</Box>
		</>
	);
};

export default SharingPage;
