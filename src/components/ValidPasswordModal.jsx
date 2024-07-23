import React from 'react';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';
import AxiosRequester from "../Axios/AxiosRequester.js";
import {enqueueSnackbar} from "notistack";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

function ValidPasswordModal({ open, handleClose, handleValidate }) {
    const [passwordChecked, setPasswordChecked] = React.useState('');

    const onSubmit = async () => {
        const isValid = await AxiosRequester.getInstance().validatePassword(passwordChecked);
        if (isValid) {
            handleValidate();
        } else {
            const variant = 'error';
            let text = "Invalid password";
            enqueueSnackbar(text, {variant, autoHideDuration: 2000});
        }
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Typography variant="h6" component="h2" gutterBottom>
                    Confirm Password
                </Typography>
                <TextField
                    label="Password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    sx={{ mb: 2 }}
                    onChange={(e) => setPasswordChecked(e.target.value)}
                    value={passwordChecked}
                />
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={onSubmit}
                >
                    Validate
                </Button>
            </Box>
        </Modal>
    );
}

export default ValidPasswordModal;
