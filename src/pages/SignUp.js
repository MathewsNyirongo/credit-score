import { Avatar, Button, CircularProgress, Container, CssBaseline, Grid, Link, makeStyles, TextField, Typography } from '@material-ui/core';
import { LockOutlined } from '@material-ui/icons';
import Axios from 'axios';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { AppConstants } from '../constants/Constants';

const useStyles = makeStyles((theme) => ({
    paper: {
		marginTop: theme.spacing(8),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center'
	},
	avatar: {
		margin: theme.spacing(1),
		backgroundColor: theme.palette.secondary.main
	},
	form: {
		width: '100%', // Fix IE 11 issue.
		marginTop: theme.spacing(3)
	},
	submit: {
		margin: theme.spacing(3, 0, 2)
	},
	progess: {
		position: 'absolute'
	}
}));

const SignUp = () => {
    let history = useHistory();
    const [userDetails, setUserDetails] = useState({
        firstName: null,
		lastName: null,
		phoneNumber: null,
		country: null,
		username: null,
		email: null,
		password: null,
		confirmPassword: null
    });

    const [responses, setResponses] = useState({
        errors: [],
        loading: false
    });

    const classes = useStyles();
    
    const handleChange = (event) => {
        setUserDetails({
            ...userDetails, [event.target.name]: event.target.value
		});
		console.log(userDetails);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setResponses({
            ...responses, loading: true
        });

        const newUserData = {
			firstName: userDetails.firstName,
			lastName: userDetails.lastName,
			phoneNumber: userDetails.phoneNumber,
			country: userDetails.country,
			username: userDetails.username,
			email: userDetails.email,
			password: userDetails.password,
			confirmPassword: userDetails.confirmPassword
		};
		
        Axios.post(`${AppConstants.apiBaseUrl}/users/signup`, newUserData)
        .then(res => {
            localStorage.setItem("AuthToken", res.data.token);
            setResponses({
                ...responses, loading: false
            });
            history.push("/");
        })
        .catch(err => {
            console.error(err);
            setResponses({
                ...responses, errors: err, loading: false
            });
        });
    };

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
				<div className={classes.paper}>
					<Avatar className={classes.avatar}>
						<LockOutlined />
					</Avatar>
					<Typography component="h1" variant="h5">
						Sign up
					</Typography>
					<form className={classes.form} noValidate>
						<Grid container spacing={2}>
							<Grid item xs={12} sm={6}>
								<TextField
									variant="outlined"
									required
									fullWidth
									id="firstName"
									label="First Name"
									name="firstName"
									autoComplete="firstName"
									helperText={responses.errors.firstName}
									error={responses.errors.firstName ? true : false}
									onChange={handleChange}
								/>
							</Grid>
							<Grid item xs={12} sm={6}>
								<TextField
									variant="outlined"
									required
									fullWidth
									id="lastName"
									label="Last Name"
									name="lastName"
									autoComplete="lastName"
									helperText={responses.errors.lastName}
									error={responses.errors.lastName ? true : false}
									onChange={handleChange}
								/>
							</Grid>

							<Grid item xs={12} sm={6}>
								<TextField
									variant="outlined"
									required
									fullWidth
									id="username"
									label="User Name"
									name="username"
									autoComplete="username"
									helperText={responses.errors.username}
									error={responses.errors.username ? true : false}
									onChange={handleChange}
								/>
							</Grid>

							<Grid item xs={12} sm={6}>
								<TextField
									variant="outlined"
									required
									fullWidth
									id="phoneNumber"
									label="Phone Number"
									name="phoneNumber"
									autoComplete="phoneNumber"
									pattern="[7-9]{1}[0-9]{9}"
									helperText={responses.errors.phoneNumber}
									error={responses.errors.phoneNumber ? true : false}
									onChange={handleChange}
								/>
							</Grid>

							<Grid item xs={12}>
								<TextField
									variant="outlined"
									required
									fullWidth
									id="email"
									label="Email Address"
									name="email"
									autoComplete="email"
									helperText={responses.errors.email}
									error={responses.errors.email ? true : false}
									onChange={handleChange}
								/>
							</Grid>

							<Grid item xs={12}>
								<TextField
									variant="outlined"
									required
									fullWidth
									id="country"
									label="Country"
									name="country"
									autoComplete="country"
									helperText={responses.errors.country}
									error={responses.errors.country ? true : false}
									onChange={handleChange}
								/>
							</Grid>

							<Grid item xs={12}>
								<TextField
									variant="outlined"
									required
									fullWidth
									name="password"
									label="Password"
									type="password"
									id="password"
									autoComplete="current-password"
									helperText={responses.errors.password}
									error={responses.errors.password ? true : false}
									onChange={handleChange}
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									variant="outlined"
									required
									fullWidth
									name="confirmPassword"
									label="Confirm Password"
									type="password"
									id="confirmPassword"
									autoComplete="current-password"
									onChange={handleChange}
								/>
							</Grid>
						</Grid>
						<Button
							type="submit"
							fullWidth
							variant="contained"
							color="primary"
							className={classes.submit}
							onClick={handleSubmit}
                            disabled={responses.loading || 
                                !userDetails.email || 
                                !userDetails.password ||
                                !userDetails.firstName || 
                                !userDetails.lastName ||
                                !userDetails.country || 
                                !userDetails.username || 
                                !userDetails.phoneNumber}
						>
							Sign Up
							{responses.loading && <CircularProgress size={30} className={classes.progess} />}
						</Button>
						<Grid container justify="flex-end">
							<Grid item>
								<Link href="login" variant="body2">
									Already have an account? Sign in
								</Link>
							</Grid>
						</Grid>
					</form>
				</div>
        </Container>
    );
};

export default SignUp;