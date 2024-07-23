import React, { useEffect, useState } from "react";
import UnstyledInputIntroduction from "../components/Custom/UnstyledInputIntroduction.jsx";
import AxiosRq from "../Axios/AxiosRequester";
import { Button } from "@mui/material";

import { useAuth } from "../hooks/AuthProvider";

import NewSearchScripts from "../components/Search/NewSearchScripts.jsx";
import {enqueueSnackbar} from "notistack";
import UnstyledSelectIntroduction from "../components/Custom/UnstyledSelectIntroduction.jsx";

function SearchScriptPage() {
	const [search, setSearch] = React.useState("");
	const [display, setDisplay] = React.useState("none");
	const [scriptsFound, setScriptsFound] = React.useState([]);
	const [open, setOpen] = React.useState(false);
	const [selectedLanguage, setSelectedLanguage] = useState("Any language");
	const [scriptsFoundPaginated, setScriptsFoundPaginated] = useState([]);
	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(5);
	const [numberOfScripts, setNumberOfScripts] = React.useState(0);
	const [visibility,setVisibility] = React.useState("Public");
	const userId = useAuth().authData?.userId;

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	useEffect(() => {
		fetchScripts();
	}, [rowsPerPage, page,selectedLanguage,visibility]);

	const fetchScripts = async () => {
		if (search.length > 3) {
			const result = await AxiosRq.getInstance().searchScriptsByKeyWord(
				search, {offset: page * rowsPerPage, records: rowsPerPage, visibility: visibility, language: selectedLanguage !== "Any language" ? selectedLanguage : ""}
			);
			setScriptsFound(result.scripts);
			setNumberOfScripts(result.totalCount);
		}
	}

	const handleSelectChangeLanguage = (event) => {
		const value = event?.target?.innerHTML;
		setPage(0);// Get the selected value
		setSelectedLanguage(value);
	};

	const handleSelectChangeVisibility = (event) => {
		const value = event?.target?.innerHTML; // Get the selected value
		console.log({visibility,
		value,
		event});
		setVisibility(value);
	};

	const handleKeyDown = async (event) => {
		if (event.key === "Enter") {
			handleSearch();
		}
	};

	const handleReset = () => {
		setSearch("");
		setDisplay("none");
		setScriptsFound([]);
		setPage(0);
		setRowsPerPage(5);
		setVisibility("Public");
		setSelectedLanguage("Any language");
		setOpen(false);
	};

	const handleOpenAdvancedOptions = () => {
		setOpen(!open);
	};

	const handleItemSelected = () => {}

	const handleSearch = async () => {
		if (search.length > 3) {
			fetchScripts();
			setDisplay("block");
		} else {
			const variant = 'error'
			enqueueSnackbar("4 characters minimum needed",{variant, autoHideDuration: 2000})
		}
	};

	const handleClick = () => {};

	return (
		<>
			<div className="container--search-bar" style={{ display: "flex" }}>
				<UnstyledInputIntroduction
					value={search}
					id="search"
					name="search"
					handleInput={(event) => {
						setSearch(event.target.value);
						setDisplay("none");
					}}
					handleKeyDown={handleKeyDown}
					placeholder={"Search in all our public database..."}
				/>
				<Button onClick={handleSearch}>Search</Button>
				<Button onClick={handleReset}>Reset</Button>
			</div>
			<div>
				<Button onClick={handleOpenAdvancedOptions}>Advanced Options</Button>
			</div>
			<div id="advanced-options" style={{ display: open ? "block" : "none" }}>
				<UnstyledSelectIntroduction
					options={["Python", "Csharp"]}
					handleSelectChange={handleSelectChangeLanguage}
					selectedValue={selectedLanguage}
					label="Programming Language"
					defaultValue="Any language"
				/>
				<UnstyledSelectIntroduction
					options={["Public", "Friend", "Group"]}
					handleSelectChange={handleSelectChangeVisibility}
					selectedValue={visibility}
					label="Visibility"
					defaultValue="Public"
				/>
			</div>
			{scriptsFound.length > 0 &&(<NewSearchScripts
					display={display}
					search={search}
					scriptsFound={scriptsFound}
					handleItemSelected={handleItemSelected}
					handleClick={handleClick}
					userId={userId}
					page={page}
					rowsPerPage={rowsPerPage}
					handleChangePage={handleChangePage}
					handleChangeRowsPerPage={handleChangeRowsPerPage}
					numberOfScripts={numberOfScripts}
			/>)}
			{scriptsFound.length === 0 &&(
				<div> No scripts !</div>)}
		</>
	);
}

export default SearchScriptPage;
