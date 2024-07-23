import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import SearchContactPage from "../../pages/SearchContactPage.jsx";
import FriendListPage from "../../pages/FriendListPage.jsx";
import AxiosRq from "../../Axios/AxiosRequester.js";
import GroupsPage from "../../pages/GroupsPage.jsx";
import {useRelations} from "../../hooks/RelationsProvider.jsx";

function ContactTabPanel(props) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && <Box sx={{ p: 3 }}>{children}</Box>}
		</div>
	);
}

ContactTabPanel.propTypes = {
	children: PropTypes.node,
	index: PropTypes.number.isRequired,
	value: PropTypes.number.isRequired,
};

function a11yProps(index) {
	return {
		id: `simple-tab-${index}`,
		"aria-controls": `simple-tabpanel-${index}`,
	};
}

export default function BasicTabs() {
	const [value, setValue] = useState(0);

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	return (
		<Box sx={{ width: "100%" }}>
			<Box sx={{ borderBottom: 1, borderColor: "divider" }}>
				<Tabs
					value={value}
					onChange={handleChange}
					aria-label="basic tabs example"
				>
					<Tab label="Search" {...a11yProps(0)} />
					<Tab label="Friends" {...a11yProps(1)} />
					<Tab label="Groups" {...a11yProps(2)} />
					{/*<Tab label="Follows" {...a11yProps(3)} />*/}
				</Tabs>
			</Box>
			<ContactTabPanel value={value} index={0}>
				<SearchContactPage />
			</ContactTabPanel>
			<ContactTabPanel value={value} index={1}>
				<FriendListPage />
			</ContactTabPanel>
			<ContactTabPanel value={value} index={2}>
				<GroupsPage />
			</ContactTabPanel>
			{/*<ContactTabPanel value={value} index={3}>*/}
			{/*	List of Follows*/}
			{/*</ContactTabPanel>*/}
		</Box>
	);
}
