import React, {useEffect} from 'react';
import { Container, Box, TextField, Button, Typography, Link } from '@mui/material';
import {useNavigate} from "react-router-dom";
import { useAuth } from "../hooks/AuthProvider";
import {isEmailAvailable, isUsernameAvailable, isValidEmail} from "../utils/utils";
import RegisterModal from "../components/RegisterModal";
import {enqueueSnackbar} from "notistack";
import NewRegisterModal from "../components/NewRegisterModal.jsx";

const NewLogin = () => {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [open, setOpen] = React.useState(false);
    const [username, setUsername] = React.useState("");
    const [emailRegister, setEmailRegister] = React.useState("");
    const [passwordRegister, setPasswordRegister] = React.useState("");
    const [passwordRegister2, setPasswordRegister2] = React.useState("");

    const auth = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (auth.isLoggedIn) {
            navigateDashboard();
        }
    });

    const navigateDashboard = () => navigate("/home", { replace: true });

    const handleClose = () => {
        setUsername("");
        setPasswordRegister("");
        setEmailRegister("");
        setPasswordRegister2("");
        setOpen(false);
    };

    const handleSubmitEvent = async (e) => {
        e.preventDefault();
        if (!email !== "" && password !== "") {
            auth.loginAction({ email, password }, navigateDashboard);
            return;
        }
        const variant = 'error';
        enqueueSnackbar("please provide a valid input", {variant, autoHideDuration: 2000});
    };
    const handleSubmitRegisterEvent = async (e) => {
        e.preventDefault();
        const emailAvailable = await isEmailAvailable(emailRegister);
        const usernameAvailable = await isUsernameAvailable(username);
        if (
            username !== "" &&
            passwordRegister !== "" &&
            emailRegister !== "" &&
            passwordRegister === passwordRegister2 &&
            isValidEmail(emailRegister) && passwordRegister.length > 5 &&
            emailAvailable &&
            usernameAvailable
        ) {
            auth.register(
                {
                    username,
                    email: emailRegister,
                    password: passwordRegister,
                },
                () => {}
            );
            handleClose();
            return;
        }
        const variant = 'error';
        let text = "Please provide a valid input"
        if (!isValidEmail(emailRegister)){
            text = "Provide a valid email"
        } else if (!emailAvailable) {
            text = "This email is already used"
        } else if (!usernameAvailable) {
            text = "This username is already used"
        } else if (passwordRegister !== passwordRegister2){
            text = "Passwords do not match"
        } else if (passwordRegister.length < 6){
            text = "Password is too short, minimum 6 characters"
        }
        enqueueSnackbar(text, {variant, autoHideDuration: 2000});
    };
    return (
        <>
            <Container
                maxWidth="sm"
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '100vh',
                }}
            >
                {/*<img src="/assets/logo.jpg" alt="Logo" style={{position: 'absolute', top: 50, left: 50, width:"180px",height:"auto"}}/>*/}
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: '100%',
                    }}
                >
                    <Typography variant="h3" sx={{color: '#1976d2', fontWeight: 'bold', mb: 2}}>
                        StackUnderFlow
                    </Typography>
                    <Typography variant="h6" sx={{mb: 4}}>
                        Partagez et exécutez votre code avec StackUnderFlow!
                    </Typography>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            width: '100%',
                            border: '1px solid #ddd',
                            borderRadius: '8px',
                            p: 3,
                            backgroundColor: '#fff',
                        }}
                    >
                        <TextField
                            label="Adresse e-mail"
                            variant="outlined"
                            fullWidth
                            sx={{mb: 2}}
                            onChange={(event) => {
                                console.log(event);
                                setEmail(event.target.value);
                            }}
                            value={email}
                        />
                        <TextField
                            label="Mot de passe"
                            type="password"
                            variant="outlined"
                            fullWidth
                            sx={{mb: 2}}
                            onChange={(event) => setPassword(event.target.value)}
                            value={password}
                        />
                        <Button variant="contained" color="primary" fullWidth sx={{mb: 2}} onClick={handleSubmitEvent}
                                disabled={!email || !password}>
                            Se connecter
                        </Button>
                        <Link href="#" sx={{mb: 2}}>
                            Mot de passe oublié ?
                        </Link>
                        <Button variant="contained" color="success" fullWidth onClick={() => setOpen(true)}>
                            Créer nouveau compte
                        </Button>
                    </Box>
                </Box>
            </Container>
            <NewRegisterModal
                open={open}
                handleClose={handleClose}
                handleSubmitRegisterEvent={handleSubmitRegisterEvent}
                username={username}
                setUsername={setUsername}
                email={emailRegister}
                setEmail={setEmailRegister}
                password={passwordRegister}
                setPassword={setPasswordRegister}
                password2={passwordRegister2}
                setPassword2={setPasswordRegister2}
            />
        </>
    );
};

export default NewLogin;
