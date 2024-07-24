import React, { useState } from 'react';
import {
    Container,
    Box,
    TextField,
    Button,
    Typography,
    Modal,
    Backdrop,
    Fade,
} from '@mui/material';

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

const ForgottenPasswordModal = ({open, handleClose,handleSubmitRegisterEvent,email,setEmail}) => {

    return (
        <Container>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={open}>
                    <Box sx={style}>
                        <Typography variant="h6" component="h2" gutterBottom>
                            Write the email address linked to your account to retrieve your password:
                        </Typography>
                        <TextField
                            label="Email"
                            variant="outlined"
                            fullWidth
                            sx={{ mb: 2 }}
                            onChange={(event) => setEmail(event.target.value)}
                            value={email}
                        />
                        <Button variant="contained" color="primary" fullWidth onClick={handleSubmitRegisterEvent}
                                disabled={!email}>
                            Submit
                        </Button>
                    </Box>
                </Fade>
            </Modal>
        </Container>
    );
};

export default ForgottenPasswordModal;
