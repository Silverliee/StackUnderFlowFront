import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import HomeIcon from '@mui/icons-material/Home';
import ContactsIcon from '@mui/icons-material/Contacts';
import FileOpenIcon from '@mui/icons-material/FileOpen';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import CommitIcon from '@mui/icons-material/Commit';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import Badge from '@mui/material/Badge';
import MailIcon from '@mui/icons-material/Mail';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';

import {useEffect, useState} from "react";
import {Outlet, useNavigate} from "react-router-dom";
import {useAuth} from "../hooks/AuthProvider.jsx";
import {useRelations} from "../hooks/RelationsProvider.jsx";
import MenuItem from "@mui/material/MenuItem";
import {Menu} from "@mui/material";
import {AccountCircle} from "@mui/icons-material";
import {getRandomInt} from "../utils/utils.js";

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: `-${drawerWidth}px`,
        ...(open && {
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginLeft: 0,
        }),
    }),
);

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
    height:'50px',
}));

export default function PersistentDrawerLeft() {
    const theme = useTheme();
    const [open, setOpen] = React.useState(true);
    const [activeIcon, setActiveIcon] = useState("home");
    const [unreadMessages, setUnreadMessages] = useState(0);
    const [loaded, setLoaded] = useState(false);
    const [username, setUsername] = useState("");
    const [friendRequests, setFriendRequests] = useState([]);
    const [groupRequests, setGroupRequests] = useState([]);
    const [anchorEl, setAnchorEl] = React.useState(null);

    const userId = useAuth().authData?.userId;
    const randomInt = getRandomInt(userId);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    const auth = useAuth();
    const relations = useRelations();
    const navigate = useNavigate();

    useEffect(() => {
        if (!auth) {
            navigate("/login");
        } else {
            setUsername(auth.username);
            setFriendRequests(relations.friendRequests);
            setGroupRequests(relations.groupRequests);
            setUnreadMessages(relations.friendRequests.length + relations.groupRequests.length);
        }
    }, [auth,relations]);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const handleNavigate = (path) => {
        setActiveIcon(path);
        navigate("/" + path);
    };

    const handleLogout = () => {
        auth.logout(() => navigate("/login"));
    };

    const handleNavigateProfile = () => {
        handleClose();
        setActiveIcon(null);
        navigate("/profile");
    }

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" open={open}>
                <Toolbar style={{display:'flex', justifyContent:'space-between'}}>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={{mr: 2, ...(open && {display: 'none'})}}
                    >
                        <MenuIcon/>
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        <h2>StackUnderFlow</h2>
                    </Typography>
                    <div>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleMenu}
                            color="inherit"
                        >
                            <img
                                src={`/assets/Profile${randomInt}.jpg`}
                                alt="Profile"
                                style={{
                                    width: '60px',
                                    height: '60px',
                                    borderRadius: '50%',
                                    objectFit: 'cover',
                                    border: '2px solid white'
                                }}
                            />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: 'center',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            <MenuItem onClick={handleNavigateProfile}>Profile</MenuItem>
                            <MenuItem onClick={handleLogout}>Logout</MenuItem>
                        </Menu>
                    </div>
                </Toolbar>
            </AppBar>
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                    },
                }}
                variant="persistent"
                anchor="left"
                open={open}
            >
                <DrawerHeader className={"ToChange"}>
                    <img src={'assets/logo.jpg'} alt={"logo"} style={{width: '80px', height: '74px', marginRight:'20px'}}/>
                    <IconButton onClick={handleDrawerClose} >
                        {theme.direction === 'ltr' ? <ChevronLeftIcon/> : <ChevronRightIcon/>}
                    </IconButton>
                </DrawerHeader>
                <Divider/>
                <List>
                    <ListItem key={"home"} disablePadding>
                        <ListItemButton onClick={() => handleNavigate("home")}>
                        <ListItemIcon>
                            <HomeIcon />
                            </ListItemIcon>
                            <ListItemText primary={"Home"} />
                            {activeIcon === "home" && <ArrowLeftIcon />}
                        </ListItemButton>
                    </ListItem>
                    <ListItem key={"search"} disablePadding>
                        <ListItemButton onClick={() => handleNavigate("search")}>
                            <ListItemIcon>
                                <ManageSearchIcon />
                            </ListItemIcon>
                            <ListItemText primary={"Search"} />
                            {activeIcon === "search" && <ArrowLeftIcon />}
                        </ListItemButton>
                    </ListItem>
                    <ListItem key={"message"} disablePadding>
                        <ListItemButton onClick={() => handleNavigate("message")}>
                            <ListItemIcon>
                                {unreadMessages ? <Badge badgeContent={unreadMessages} color="primary">
                                    <MailIcon color="action" />
                                </Badge> : <MailIcon color="action" />}
                            </ListItemIcon>
                            <ListItemText primary={"Inbox"} />
                            {activeIcon === "message" && <ArrowLeftIcon />}
                        </ListItemButton>
                    </ListItem>
                    <ListItem key={"contacts"} disablePadding>
                        <ListItemButton onClick={() => handleNavigate("contacts")}>
                            <ListItemIcon>
                                <ContactsIcon />
                            </ListItemIcon>
                            <ListItemText primary={"Contacts"} />
                            {activeIcon === "contacts" && <ArrowLeftIcon />}
                        </ListItemButton>
                    </ListItem>
                </List>
                <Divider />
                <List>
                    <ListItem key={"script"} disablePadding>
                        <ListItemButton onClick={() => handleNavigate("script")}>
                            <ListItemIcon>
                                <FileOpenIcon />
                            </ListItemIcon>
                            <ListItemText primary={"Scripts"} />
                            {activeIcon === "script" && <ArrowLeftIcon />}
                        </ListItemButton>
                    </ListItem>
                    <ListItem key={"share"} disablePadding>
                        <ListItemButton onClick={() => handleNavigate("share")}>
                            <ListItemIcon>
                                <CloudUploadIcon />
                            </ListItemIcon>
                            <ListItemText primary={"Upload script"} />
                            {activeIcon === "share" && <ArrowLeftIcon />}
                        </ListItemButton>
                    </ListItem>
                    <ListItem key={"edit"} disablePadding>
                        <ListItemButton onClick={() => handleNavigate("edit")}>
                            <ListItemIcon>
                                <AutoFixHighIcon />
                            </ListItemIcon>
                            <ListItemText primary={"Edit script"} />
                            {activeIcon === "edit" && <ArrowLeftIcon />}
                        </ListItemButton>
                    </ListItem>
                    <ListItem key={"exec"} disablePadding>
                        <ListItemButton onClick={() => handleNavigate("exec")}>
                            <ListItemIcon>
                                <RocketLaunchIcon />
                            </ListItemIcon>
                            <ListItemText primary={"Execute script"} />
                            {activeIcon === "exec" && <ArrowLeftIcon />}
                        </ListItemButton>
                    </ListItem>
                    <ListItem key={"pipelines"} disablePadding>
                        <ListItemButton onClick={() => handleNavigate("pipelines")}>
                            <ListItemIcon>
                                <CommitIcon />
                            </ListItemIcon>
                            <ListItemText primary={"Pipelines"} />
                            {activeIcon === "pipelines" && <ArrowLeftIcon />}
                        </ListItemButton>
                    </ListItem>
                </List>
                <Divider />
                <List>
                    <ListItem key={"Logout"} disablePadding>
                        <ListItemButton onClick={() => handleLogout()}>
                            <ListItemIcon>
                                <ExitToAppIcon />
                            </ListItemIcon>
                            <ListItemText primary={"Logout"} />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Drawer>
            <Main open={open}>
                <DrawerHeader/>
                    <Outlet/>
            </Main>
        </Box>
    );
}
