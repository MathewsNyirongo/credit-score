import { Button, Card, CardActions, CardContent, CircularProgress, Divider, Grid, makeStyles, TextField, Typography } from '@material-ui/core';
import { CloudUpload } from '@material-ui/icons';
import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { AppConstants } from '../constants/Constants';
import { authMiddleWare } from '../utils/auth';
import clsx from 'clsx';
import DateMoment from '@date-io/moment';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';

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

const Todo = () => {
    let history = useHistory();
    const classes = useStyles();

    const [creditCalculationDetails, setCreditCalculationDetails] = useState({
        age: null,
        phoneNumber: null,
        monthlyIncome: null,
        monthlyExpense: null,
        numberOfNewCreditCards: null,
        loansIn2years: null,
        firstCreditCardYear: null,
        totalCreditCardAmount: null,
        currentCreditCardBalance: null,
        countOfLatePayments1: null,
        countOfLatePayments2: null,
        countOfLatePayments3: null,
        cardUsedLong: null,
        cardMix: {
            card: {
                used: false,
                numberOfCredits: null,
                numberOfYears: null
            },
            car: {
                used: false,
                numberOfCredits: null,
                numberOfYears: null
            },
            studies: {
                used: false,
                numberOfCredits: null,
                numberOfYears: null
            },
            home: {
                used: false,
                numberOfCredits: null,
                numberOfYears: null
            },
            peronal: {
                used: false,
                numberOfCredits: null,
                numberOfYears: null
            },
            other: {
                used: false,
                numberOfCredits: null,
                numberOfYears: null
            }
        }
    })
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
    
    const handleChangeOnCredit = (e) => {
        setCreditCalculationDetails({
            ...creditCalculationDetails,
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
                    <form autoComplete="off" noValidate>
                        <CardContent>
                            <Typography>Personal Details</Typography>
                            <br />
                            <Grid container spacing={3}>
                                <Grid item md={6} xs={12}>
                                    <TextField
                                        fullWidth
                                        type="number"
                                        label="Age"
                                        margin="dense"
                                        name="age"
                                        variant="outlined"
                                        value={creditCalculationDetails.age}
                                        onChange={handleChangeOnCredit}
                                    />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Phone Number"
                                        margin="dense"
                                        name="phoneNmber"
                                        disabled
                                        variant="outlined"
                                        value={userDetails.phoneNumber}
                                        onChange={handleChange}
                                    />
                                </Grid>
                            </Grid>
                            <br />
                            <Typography>Other Details</Typography>
                            <br />
                            <Grid container spacing={3}>
                                <Grid item md={6} xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Monthly Income"
                                        type="number"
                                        margin="dense"
                                        name="monthlyIncome"
                                        variant="outlined"
                                        value={creditCalculationDetails.monthlyIncome}
                                        onChange={handleChangeOnCredit}
                                    />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Monthly Expense"
                                        type="number"
                                        margin="dense"
                                        name="monthlyExpense"
                                        variant="outlined"
                                        value={creditCalculationDetails.monthlyExpense}
                                        onChange={handleChangeOnCredit}
                                    />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Number of New Credit Cards"
                                        type="number"
                                        margin="dense"
                                        name="numberOfNewCreditCards"
                                        variant="outlined"
                                        value={creditCalculationDetails.numberOfNewCreditCards}
                                        onChange={handleChangeOnCredit}
                                    />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Loan in 2 Years"
                                        type="number"
                                        margin="dense"
                                        name="loansIn2years"
                                        variant="outlined"
                                        value={creditCalculationDetails.loansIn2years}
                                        onChange={handleChangeOnCredit}
                                    />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <MuiPickersUtilsProvider utils={DateMoment}>
                                        <DatePicker
                                            fullWidth
                                            views={['year']}
                                            label="First Credit Card Year"
                                            name="firstCreditCardYear"
                                            variant="inline"
                                            autoOk
                                            disableFuture
                                            value={creditCalculationDetails.firstCreditCardYear}
                                            onChange={value => setCreditCalculationDetails({...creditCalculationDetails, firstCreditCardYear: value})}
                                        />
                                    </MuiPickersUtilsProvider>
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Total Credit Amount"
                                        type="number"
                                        margin="dense"
                                        name="totalCreditCardAmount"
                                        variant="outlined"
                                        value={creditCalculationDetails.totalCreditCardAmount}
                                        onChange={handleChangeOnCredit}
                                    />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Current Credit Balance"
                                        type="number"
                                        margin="dense"
                                        name="currentCreditCardBalance"
                                        variant="outlined"
                                        value={creditCalculationDetails.currentCreditCardBalance}
                                        onChange={handleChangeOnCredit}
                                    />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Count of Late Payments[31-59 years]"
                                        type="number"
                                        margin="dense"
                                        name="countOfLatePayments1"
                                        variant="outlined"
                                        value={creditCalculationDetails.countOfLatePayments1}
                                        onChange={handleChangeOnCredit}
                                    />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Count of Late Payments[60-89 years]"
                                        type="number"
                                        margin="dense"
                                        name="countOfLatePayments2"
                                        variant="outlined"
                                        value={creditCalculationDetails.countOfLatePayments2}
                                        onChange={handleChangeOnCredit}
                                    />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Count of Late Payments[Above 90 years]"
                                        type="number"
                                        margin="dense"
                                        name="countOfLatePayments3"
                                        variant="outlined"
                                        value={creditCalculationDetails.countOfLatePayments3}
                                        onChange={handleChangeOnCredit}
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
                    Calculate
                    {responses.buttonLoading && <CircularProgress size={30} className={classes.progess} />}
                </Button>
            </main>
        );
    }
};

export default Todo;