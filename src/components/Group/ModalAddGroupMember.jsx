import React, { useState, useEffect } from 'react';
import { Box, Modal, TextField, Button, Autocomplete } from "@mui/material";
import AxiosRq from "../../Axios/AxiosRequester.js";
import useDebounce from '../../hooks/useDebounce';

const ModalAddGroupMember = ({ open, handleClose, selectedUser, setSelectedUser, handleSubmitRegisterEvent }) => {
    const [options, setOptions] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const debouncedInputValue = useDebounce(inputValue, 500);

    useEffect(() => {
        const fetchUsers = async () => {
            if (debouncedInputValue.length > 2) {
                const response = await AxiosRq.getInstance().searchUsersByKeyword(debouncedInputValue);
                setOptions(response);
            } else {
                setOptions([]);
            }
        };

        fetchUsers();
    }, [debouncedInputValue]);

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleSubmitRegisterEventAndReset = (event) => {
        setOptions([]);
        handleSubmitRegisterEvent(event);
    }

    const handleCloseAndReset = () => {
        setSelectedUser(null);
        setOptions([]);
        handleClose();
    }

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

    return (
        <Modal
            open={open}
            onClose={handleCloseAndReset}
            aria-labelledby="parent-modal-title"
            aria-describedby="parent-modal-description"
        >
            <Box sx={{ ...style, width: 400 }}>
                <div>
                    <label>Search your colleague username: </label>
                    <Autocomplete
                        id="username"
                        freeSolo
                        options={options}
                        getOptionLabel={(option) => option.username}
                        onInputChange={handleInputChange}
                        onChange={(event, newValue) => setSelectedUser(newValue)}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Username"
                                variant="outlined"
                            />
                        )}
                    />
                </div>

                <Button
                    component="label"
                    role={undefined}
                    variant="contained"
                    tabIndex={-1}
                    onClick={handleSubmitRegisterEventAndReset}
                    disabled={!selectedUser}
                >
                    Submit
                </Button>
            </Box>
        </Modal>
    );
}

export default ModalAddGroupMember;
