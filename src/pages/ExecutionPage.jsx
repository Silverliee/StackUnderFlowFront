import React, { useState } from "react";
import "../styles/scriptPage.css";
import { TiArrowBack } from "react-icons/ti";
import { useNavigate } from "react-router-dom";
import AxiosRq from "../Axios/AxiosRequester";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Button from "@mui/material/Button";
import {enqueueSnackbar} from "notistack";

function ExecutionPage() {
	const [file, setFile] = useState(null);
	const [input,setInput] = useState(null);

	const acceptedFiles = [".py", ".csx"];

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
	const navigate = useNavigate();

	//TODO Verifier le tag pour l'input dans executeSingleScript côté Back
	const handleExecute = async () => {
		if (file === null) {
			const variant = 'error';
			enqueueSnackbar("Please select a file",{variant, autoHideDuration: 2000})
			return;
		}
		const formData = new FormData();
		formData.append("script", file);
		if(input) {
			formData.append("input", input);
		}
		const result = await AxiosRq.getInstance().executeScript(formData);
	};
	function handleChange(event) {
		setFile(null);
		const selectedFile = event.target.files[0];
		if (selectedFile && selectedFile.type) {
			setFile(selectedFile);
		} else {
			const variant = 'error';
			enqueueSnackbar("Invalid file type",{variant, autoHideDuration: 2000})
		}
	}
	function handleChangeInput(event) {
		setInput(null);
		const selectedFile = event.target.files[0];
		if (selectedFile && selectedFile.type) {
			setInput(selectedFile);
		} else {
			const variant = 'error';
			enqueueSnackbar("Invalid file type",{variant, autoHideDuration: 2000})
		}
	}

	return (
		<>
			<div className="script--header">
				<h1>Script Page Execution</h1>
				<TiArrowBack onClick={() => navigate("/home")} />
			</div>
			<div className="script--content">
				<p>Here you can execute your scripts</p>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						alignItems: "flex-start",
					}}
				>
					<div style={{
							display: "flex", alignItems:"center"}}>
						<Button
							style={{marginBottom:"10px"}}
							component="label"
							role={undefined}
							variant="contained"
							tabIndex={-1}
							startIcon={<CloudUploadIcon/>}
						>
							Upload file
							<VisuallyHiddenInput
								type="file"
								accept={acceptedFiles}
								onChange={handleChange}
							/>
						</Button>
						<p style={{marginLeft: "10px"}}>{file?.name}</p>
					</div>
					<div style={{
						display: "flex", alignItems:"center"}}>
						<Button component="label"
								role={undefined}
								variant="contained"
								tabIndex={-1}
						>Input
							<VisuallyHiddenInput
								type="file"
								onChange={handleChangeInput}
							/>
						</Button>
						<p style={{marginLeft: "10px"}}>{input?.name}</p>
					</div>
				</div>
				<Button
					component="label"
					role={undefined}
					variant="contained"
					tabIndex={-1}
					onClick={handleExecute}
					disabled={!file}
				>
					Execute
				</Button>
			</div>
		</>
	);
}

export default ExecutionPage;
