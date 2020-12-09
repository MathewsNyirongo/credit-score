import { 
	CircularProgress,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	makeStyles,
	Divider,
	Drawer,
	Typography,
	Toolbar,
	Avatar,
	AppBar,
	CssBaseline,
	useTheme,
	Hidden,
	IconButton
} from '@material-ui/core';
import { AccountBox, ExitToApp, Notes, Menu } from '@material-ui/icons';
import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { AppConstants } from '../constants/Constants';
import { authMiddleWare } from '../utils/auth';
import Account from '../components/Account';
import Todo from '../components/Todo';

const drawerWidth = 240;
const useStyles = makeStyles((theme) => ({
    root: {
		display: 'flex'
	},
	appBar: {
		zIndex: theme.zIndex.drawer + 1,
		[theme.breakpoints.up('sm')]: {
			width: `calc(100% - ${drawerWidth}px)`,
			marginLeft: drawerWidth
		}
	},
	menuButton: {
		marginRight: theme.spacing(2),
		[theme.breakpoints.up('sm')]: {
			display: 'none'
		}
	},
	drawer: {
		[theme.breakpoints.up('sm')]: {
			width: drawerWidth,
			flexShrink: 0
		}
	},
	drawerPaper: {
		width: drawerWidth
	},
	content: {
		flexGrow: 1,
		padding: theme.spacing(3)
	},
	avatar: {
		height: 110,
		width: 100,
		flexShrink: 0,
		flexGrow: 0,
		marginTop: 20
	},
	uiProgess: {
		position: 'fixed',
		zIndex: '1000',
		height: '31px',
		width: '31px',
		left: '50%',
		top: '35%'
	},
	toolbar: theme.mixins.toolbar
}));

const Home = (props) => {
	const { window } = props;
	const classes = useStyles();
	const theme = useTheme();
	let history = useHistory();
	
	const [mobileOpen, setMobileOpen] = useState(false);

	const [state, setState] = useState({
		firstName: null,
		lastName: null,
		email: null,
		phoneNumber: null,
		country: null,
		username: null,
		profilePicture: null,
		uiLoading: true,
		imageLoading: false,
		render: false
	});

	const loadTodoPage = () => {
		setState({
			...state,
			render: false
		});
	};

	const loadAccountPage = () => {
		setState({
			...state,
			render: true
		});
	};

	const logoutHandler = () => {
		localStorage.removeItem('AuthToken');
		history.push('/login');
	}

	useEffect(() => {
		authMiddleWare(history);
		const authToken = localStorage.getItem('AuthToken');
		Axios.defaults.headers.common['Authorization'] = authToken;
		Axios.get(`${AppConstants.apiBaseUrl}/user`).then(response => {
			setState({
				...state,
				firstName: response.data.userCredentials.firstName,
				lastName: response.data.userCredentials.lastName,
				email: response.data.userCredentials.email,
				phoneNumber: response.data.userCredentials.phoneNumber,
				country: response.data.userCredentials.country,
				username: response.data.userCredentials.username,
				uiLoading: false,
				profilePicture: response.data.userCredentials.imageUrl
			});
		}).catch(error => {
			if (error.response.status === 403) {
				history.push('/login');
			}
			setState({
				...state,
				errorMessage: 'Error in retrieving data'
			});
		});
	}, []);

	const container = window !== undefined ? () => window().document.body : undefined;

    return (
        <div className={classes.root}>
			{state.uiLoading ? (
				<div>
					<CircularProgress size={150} className={classes.uiProgess} />
				</div>
			) : (
				<div>
					<div className={classes.root}>
					<CssBaseline />
					<AppBar position="fixed" className={classes.appBar}>
						<Toolbar>
							<IconButton
								color="inherit"
								aria-label="open drawer"
								edge="start"
								onClick={e => setMobileOpen(!mobileOpen)}
								className={classes.menuButton}
							>
								<Menu />
							</IconButton>
							<Typography variant="h6" noWrap>
								Credit Score Application
							</Typography>
						</Toolbar>
					</AppBar>
					<nav className={classes.drawer} aria-label="mailbox folders">
						<Hidden smUp implementation="css">
							<Drawer
								container={container}
								anchor={theme.direction === 'rtl' ? 'right' : 'left'}
								open={mobileOpen}
								onClose={e => setMobileOpen(!mobileOpen)}
								variant="temporary"
								classes={{
									paper: classes.drawerPaper
								}}
								ModalProps={{
									keepMounted: false
								}}
							>
								<div className={classes.toolbar} />
								<Divider />
								<center>
									<Avatar src={state.profilePicture} className={classes.avatar} />
									<p>
										{' '}
										{state.firstName} {state.lastName}
									</p>
								</center>
								<Divider />
								<List>
									<ListItem button key="Todo" onClick={loadTodoPage}>
										<ListItemIcon>
											{' '}
											<Notes />{' '}
										</ListItemIcon>
										<ListItemText primary="Credit Score Calculator" />
									</ListItem>

									<ListItem button key="Account" onClick={loadAccountPage}>
										<ListItemIcon>
											{' '}
											<AccountBox />{' '}
										</ListItemIcon>
										<ListItemText primary="Account" />
									</ListItem>

									<ListItem button key="Logout" onClick={logoutHandler}>
										<ListItemIcon>
											{' '}
											<ExitToApp />{' '}
										</ListItemIcon>
										<ListItemText primary="Logout" />
									</ListItem>
								</List>
							</Drawer>
						</Hidden>
						<Hidden xsDown implementation="css">
							<Drawer
								className={classes.drawer}
								variant="permanent"
								classes={{
									paper: classes.drawerPaper
								}}
							>
								<div className={classes.toolbar} />
								<Divider />
								<center>
									<Avatar src={state.profilePicture} className={classes.avatar} />
									<p>
										{' '}
										{state.firstName} {state.lastName}
									</p>
								</center>
								<Divider />
								<List>
									<ListItem button key="Todo" onClick={loadTodoPage}>
										<ListItemIcon>
											{' '}
											<Notes />{' '}
										</ListItemIcon>
										<ListItemText primary="Credit Score Calculator" />
									</ListItem>

									<ListItem button key="Account" onClick={loadAccountPage}>
										<ListItemIcon>
											{' '}
											<AccountBox />{' '}
										</ListItemIcon>
										<ListItemText primary="Account" />
									</ListItem>

									<ListItem button key="Logout" onClick={logoutHandler}>
										<ListItemIcon>
											{' '}
											<ExitToApp />{' '}
										</ListItemIcon>
										<ListItemText primary="Logout" />
									</ListItem>
								</List>
							</Drawer>
						</Hidden>
					</nav>

					<div>{state.render ? <Account /> : <Todo />}</div>
				</div>
				</div>
			)}
		</div>
    );
};

export default Home;