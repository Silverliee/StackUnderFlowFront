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

const NewRegisterModal = ({open, handleClose,handleSubmitRegisterEvent,username,setUsername,email,setEmail,password,setPassword,password2,setPassword2}) => {

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
                            Create Account
                        </Typography>
                        <TextField
                            label="Username"
                            variant="outlined"
                            fullWidth
                            sx={{ mb: 2 }}
                            onChange={(event) => setUsername(event.target.value)}
                            value={username}
                        />
                        <TextField
                            label="Email"
                            variant="outlined"
                            fullWidth
                            sx={{ mb: 2 }}
                            onChange={(event) => setEmail(event.target.value)}
                            value={email}
                        />
                        <TextField
                            label="Password"
                            type="password"
                            variant="outlined"
                            fullWidth
                            sx={{ mb: 2 }}
                            onChange={(event) => setPassword(event.target.value)}
                            value={password}
                        />
                        <TextField
                            label="Confirm Password"
                            type="password"
                            variant="outlined"
                            fullWidth
                            sx={{ mb: 2 }}
                            onChange={(event) => setPassword2(event.target.value)}
                            value={password2}
                        />
                        <Button variant="contained" color="primary" fullWidth onClick={handleSubmitRegisterEvent}
                                disabled={!username || !password || !password2 || !email}>
                            Submit
                        </Button>
                    </Box>
                </Fade>
            </Modal>
        </Container>
    );
};

export default NewRegisterModal;
