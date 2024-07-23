import React from "react";
import UnstyledInputIntroduction from "../Custom/UnstyledInputIntroduction.jsx";
import { Button } from "@mui/material";

function SearchBar({
	search,
	setSearch,
	setDisplay,
	handleSearch,
	handleReset,
	handleKeyDown,
}) {
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
					placeholder={"Search someone name..."}
				/>
				<Button onClick={handleSearch}>Search</Button>
				<Button onClick={handleReset}>Reset</Button>
			</div>
		</>
	);
}

export default SearchBar;
