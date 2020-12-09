import { Button, Card, CardActions, CardContent, CircularProgress, Divider, Grid, makeStyles, TextField, Typography } from '@material-ui/core';
import { CloudUpload } from '@material-ui/icons';
import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { AppConstants } from '../constants/Constants';
import { authMiddleWare } from '../utils/auth';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
    content: {
		flexGrow: 1,
		padding: theme.spacing(3)
	},
	toolbar: theme.mixins.toolbar,
	details: {
		display: 'flex'
	},
	avatar: {
		height: 110,
		width: 100,
		flexShrink: 0,
		flexGrow: 0
	},
	locationText: {
		paddingLeft: '15px'
	},
	buttonProperty: {
		position: 'absolute',
		top: '50%'
	},
	uiProgess: {
		position: 'fixed',
		zIndex: '1000',
		height: '31px',
		width: '31px',
		left: '50%',
		top: '35%'
	},
	progess: {
		position: 'absolute'
	},
	uploadButton: {
		marginLeft: '8px',
		margin: theme.spacing(1)
	},
	customError: {
		color: 'red',
		fontSize: '0.8rem',
		marginTop: 10
	},
	submitButton: {
		marginTop: '10px'
	}
}));

const Account = () => {
    let history = useHistory();
    const classes = useStyles();

    const [userDetails, setUserDetails] = useState({
        firstName: null,
		lastName: null,
		email: null,
		phoneNumber: null,
		username: null,
		country: null,
		profilePicture: null,
		image: null,
		content: null
    });

    const [responses, setResponses] = useState({
        uiLoading: true,
		buttonLoading: false,
        imageError: '',
        erroMessage: ''
    });

    const handleChange = (e) => {
        setUserDetails({
            ...userDetails,
            [e.target.name]: e.target.value
        });
	};
	
	const handleImageChange = (e) => {
		setUserDetails({
			...userDetails,
			image: e.target.files[0]
		});
	};

	const profilePictureHandler = (e) => {
		e.preventDefault();
		setResponses({
			...responses,
			uiLoading: true
		});
		authMiddleWare(history);
		const authToken = localStorage.getItem('authToken');
		Axios.defaults.headers.common['Authorization'] = authToken;
		let form_data = new FormData();
		form_data.append('image', userDetails.image);
		form_data.append('content', userDetails.content);
		Axios.post(`${AppConstants.apiBaseUrl}/users/image`, form_data, {
			headers: {
				'Content-Type': 'multipart/form-data'
			}
		})
		.then(() => {
			window.location.reload();
		})
		.catch(error => {
			if (error.response?.status === 403) {
				history.push('/login');
			}
			setResponses({
				...responses,
				uiLoading: false,
				imageError: 'Error in posting data'
			});
		});
	};

	const updateFormValues = (e) => {
		e.preventDefault();
		setResponses({
			...responses,
			buttonLoading: true
		});
		authMiddleWare(history);
		const authToken = localStorage.getItem('AuthToken');
		Axios.defaults.headers.common['Authorization'] = authToken;
		const formRequest = {
			firstName: userDetails.firstName,
			lastName: userDetails.lastName,
			country: userDetails.country
		};

		Axios.put(`${AppConstants.apiBaseUrl}/user`, formRequest).then(() => {
			setResponses({...responses, buttonLoading: false});
		}).catch(error => {
			if (error.response?.status === 403) {
				history.push('/login');
			}
			setResponses({...responses, buttonLoading: false});
		});
	};

    useEffect(() => {
        authMiddleWare(history);
        const authToken = localStorage.getItem('AuthToken');
        Axios.defaults.headers.common = { Authorization: authToken };
        Axios.get(`${AppConstants.apiBaseUrl}/user`).then(res => {
            setUserDetails({
                ...userDetails,
                firstName: res.data.userCredentials.firstName,
                lastName: res.data.userCredentials.lastName,
                email: res.data.userCredentials.email,
                phoneNumber: res.data.userCredentials.phoneNumber,
                country: res.data.userCredentials.country,
                username: res.data.userCredentials.username
            });
            setResponses({
                ...responses,
                uiLoading: false
            });
        }).catch(err => {
            if (err.response?.status === 403) {
                history.push("/login");
            }
            setResponses({
                ...responses,
                erroMessage: 'Error in retrieving data'
            });
        });
    }, []);

    if (responses.uiLoading === true) {
        return (
            <main className={classes.content}>
                <div className={classes.toolbar} />
                {responses.uiLoading && <CircularProgress size={150} className={classes.uiProgess} />}
            </main>
        );
    } else {
        return (
            <main className={classes.content}>
                <div className={classes.toolbar} />
                <Card className={clsx(classes.root, classes)}>
                    <CardContent>
                        <div className={classes.details}>
                            <div>
                                <Typography className={classes.locationText} gutterBottom variant="h4">
                                    {userDetails.firstName} {userDetails.lastName}
                                </Typography>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    type="submit"
                                    size="small"
                                    startIcon={<CloudUpload />}
                                    className={classes.uploadButton}
                                    onClick={profilePictureHandler}
                                >
                                    Upload Photo
                                </Button>
                                <input type="file" onChange={handleImageChange} />
                                {responses.imageError ? (
                                    <div className={classes.customError}>
                                        {' '}
                                        Wrong Image Format || Supported Format are PNG and JPG
                                    </div>
                                ) : (
                                    false
                                )}
                            </div>
                        </div>
                        <div className={classes.progress} />
                    </CardContent>
                    <Divider />
                </Card>
                <br />
                <Card className={clsx(classes.root, classes)}>
                    <form autoComplete="off" noValidate>
                        <Divider />
                        <CardContent>
                            <Grid container spacing={3}>
                                <Grid item md={6} xs={12}>
                                    <TextField
                                        fullWidth
                                        label="First name"
                                        margin="dense"
                                        name="firstName"
                                        variant="outlined"
                                        value={userDetails.firstName}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Last name"
                                        margin="dense"
                                        name="lastName"
                                        variant="outlined"
                                        value={userDetails.lastName}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Email"
                                        margin="dense"
                                        name="email"
                                        variant="outlined"
                                        disabled={true}
                                        value={userDetails.email}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Phone Number"
                                        margin="dense"
                                        name="phone"
                                        type="text"
                                        variant="outlined"
                                        disabled={true}
                                        value={userDetails.phoneNumber}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <TextField
                                        fullWidth
                                        label="User Name"
                                        margin="dense"
                                        name="userHandle"
                                        disabled={true}
                                        variant="outlined"
                                        value={userDetails.username}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Country"
                                        margin="dense"
                                        name="country"
                                        variant="outlined"
                                        value={userDetails.country}
                                        onChange={handleChange}
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                        <Divider />
                        <CardActions />
                    </form>
                </Card>
                <Button
                    color="primary"
                    variant="contained"
                    type="submit"
                    className={classes.submitButton}
                    onClick={updateFormValues}
                    disabled={
                        responses.buttonLoading ||
                        !userDetails.firstName ||
                        !userDetails.lastName ||
                        !userDetails.country
                    }
                >
                    Save details
                    {responses.buttonLoading && <CircularProgress size={30} className={classes.progess} />}
                </Button>
            </main>
        );
    }
};

export default Account;