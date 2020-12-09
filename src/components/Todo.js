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
import { Autocomplete } from '@material-ui/lab';

const scores = AppConstants.scores;
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
        homeOwnership: null,
        purpose: null,
        term: null,
        interestRate: null,
        inquiry: null,
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

    const [scoreCard, setScoreCard] = useState({
        intercept: 598,
        age50: 25,
        age40to59: 20,
        age30to39: 15,
        age25to29: 12,
        age20to24: 8,
        age18to19: 5,
        age0to17: 0,
        monthlyIncome2855Less: 13,
        monthlyIncome2856to10113: 11,
        monthlyIncome10114to18187: 10,
        monthlyIncome18188to28260: 8,
        monthlyIncome28261to35000: 4.5,
        monthlyIncomeMissing: 14,
        monthlyIncome35001Great: 0,
        monthlyExpense10000Less: -48,
        monthlyExpense10001to15000: -76,
        monthlyExpense15001to20000: -104,
        monthlyExpense20001to25000: -162,
        homeOwnership: {
            mortgage: 0,
            rent: -3,
            own: -1
        },
        purpose: {
            debtConsolidation: -8,
            education: -12
        },
        term36: -3,
        interestRate7071Less: 26,
        interestRate7072to10374: 8,
        interestRate10375to13676: 2,
        interestRate13677to1574: 1,
        inquiryMissing: 3,
        inquiry0: 11,
        inquiry1to2: 9,
        inquiry3to4: 7,
        inquiry4Great: 0
    })

    const [creditScore, setCreditScore] = useState({
        value: 0,
        grade: "Very Poor"
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

	const calulateCreditScore = (e) => {
        let score = scoreCard.intercept;
        // Age
		if (creditCalculationDetails.age >= 0 && creditCalculationDetails.age <=17) {
            score+=scoreCard.age0to17;
        }else if (creditCalculationDetails.age >=18 && creditCalculationDetails.age <= 19) {
            score+=scoreCard.age18to19;
        }else if(creditCalculationDetails.age >=20 && creditCalculationDetails.age <=24 ){
            score+=scoreCard.age20to24;
        }else if(creditCalculationDetails.age >=25 && creditCalculationDetails.age <=29 ){
            score+=scoreCard.age25to29;
        }else if(creditCalculationDetails.age >=30 && creditCalculationDetails.age <=39 ){
            score+=scoreCard.age30to39;
        }else if(creditCalculationDetails.age >=40 && creditCalculationDetails.age <=59 ){
            score+=scoreCard.age40to59;
        }else if(creditCalculationDetails.age >=60){
            score+=scoreCard.age50;
        }

        // Monthly income
        if(creditCalculationDetails.monthlyIncome == null){
            score+=scoreCard.monthlyIncomeMissing;
        }else if(creditCalculationDetails.monthlyIncome < 2855 ){
            score+=scoreCard.monthlyIncome2855Less;
        }else if(creditCalculationDetails.monthlyIncome >=2856 && creditCalculationDetails.age <=10113 ){
            score+=scoreCard.monthlyIncome2856to10113;
        }else if(creditCalculationDetails.age >=10114 && creditCalculationDetails.age <=18187 ){
            score+=scoreCard.monthlyIncome10114to18187;
        }else if(creditCalculationDetails.age >=18188 && creditCalculationDetails.age <=28260 ){
            score+=scoreCard.monthlyIncome18188to28260;
        }else if(creditCalculationDetails.age >=28261 && creditCalculationDetails.age <=35000 ){
            score+=scoreCard.monthlyIncome28261to35000;
        }else if(creditCalculationDetails.monthlyIncome <=35001 ){
            score+=scoreCard.monthlyIncome35001Great;
        }

        // Monthly expense
        if(creditCalculationDetails.monthlyExpense <=10000 ){
            score+=scoreCard.monthlyExpense10000Less;
        }else if(creditCalculationDetails.monthlyExpense >=10001 && creditCalculationDetails.monthlyExpense <=15000 ){
            score+=scoreCard.monthlyExpense10001to15000;
        }else if(creditCalculationDetails.monthlyExpense >=15001 && creditCalculationDetails.age <=20000 ){
            score+=scoreCard.monthlyExpense15001to20000;
        }else if(creditCalculationDetails.age >=20001 && creditCalculationDetails.age <=25000 ){
            score+=scoreCard.monthlyExpense20001to25000;
        }

        // Home ownership
        if(creditCalculationDetails.homeOwnership === "Own" ){
            score+=scoreCard.homeOwnership.own;
        }else if(creditCalculationDetails.homeOwnership === "Rent" ){
            score+=scoreCard.homeOwnership.rent;
        }else if(creditCalculationDetails.homeOwnership === "Mortgage" ){
            score+=scoreCard.homeOwnership.mortgage;
        }

        // Purpose
        if(creditCalculationDetails.purpose === "education" ){
            score+=scoreCard.purpose.education;
        }else if(creditCalculationDetails.purpose === "debtConsolidation" ){
            score+=scoreCard.purpose.debtConsolidation;
        }

        // Term
        if(creditCalculationDetails.term === "months36" ){
            score+=scoreCard.term36;
        }

        // Interest rate
        if(creditCalculationDetails.interestRate <= 7.071){
            score+=scoreCard.interestRate7071Less;
        }else if(creditCalculationDetails.interestRate >=7.072 && creditCalculationDetails.interestRate <=10.374){
            score+=scoreCard.interestRate7072to10374;
        }else if(creditCalculationDetails.interestRate >=10.375 && creditCalculationDetails.interestRate <=13.676){
            score+=scoreCard.interestRate10375to13676;
        }else if(creditCalculationDetails.interestRate >=13.677 && creditCalculationDetails.interestRate <=15.74){
            score+=scoreCard.interestRate13677to1574;
        }

        // Inquiries in last 6 months
        if(creditCalculationDetails.inquiry == null){
            score+=scoreCard.inquiryMissing;
        }else if(creditCalculationDetails.inquiry == 1 || creditCalculationDetails.inquiry == 2){
            score+=scoreCard.inquiry1to2;
        }else if(creditCalculationDetails.inquiry == 3 || creditCalculationDetails.inquiry == 4){
            score+=scoreCard.inquiry3to4;
        }else if(creditCalculationDetails.inquiry >=4 ){
            score+=scoreCard.inquiry4Great;
        }else if(creditCalculationDetails.inquiry == 0){
            score+=scoreCard.inquiry0;
        }

        const scorePercentage = (score * 100) / 666;
        let grade = creditScore.grade;
        scores.forEach(item => {
            if(scorePercentage < 64 && item.id == "64Less"){
                grade = item.value
            }else if (scorePercentage >= 65 && scorePercentage <=70 && item.id == "65-70") {
                grade = item.value
            }else if (scorePercentage >= 71 && scorePercentage <= 76 && item.id == "71-76") {
                grade = item.value;
            }else if (scorePercentage >= 77 && scorePercentage <= 83 && item.id == "77-83") {
                grade = item.value;
            }else if (scorePercentage >= 84 && scorePercentage <= 89 && item.id == "84-89") {
                grade = item.value;
            }else if(scorePercentage >= 90 && scorePercentage <= 100 && item.id == "90-100") {
                grade = item.value;
            }
        });
        setCreditScore({
            value: score,
            grade
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
                                    <Autocomplete
                                        getOptionLabel={option=>option.title}
                                        options={[
                                            {id: "Own", title: "Own"},
                                            {id: "Rent", title: "Rent"},
                                            {id: "Mortgage", title: "Mortgage"}
                                        ]}
                                        size="small"
                                        onChange={(e, value) => setCreditCalculationDetails({...creditCalculationDetails, homeOwnership: value.id})}
                                        renderInput={params => <TextField {...params} label="Home ownership" margin="dense" variant="outlined" />}
                                    />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <Autocomplete
                                        options={[
                                            {id: "debtConsolidation", title: "Debt Consolidation"},
                                            {id: "education", title: "Education/Small business/Renewable energy/Movement"},
                                            {id: "vacation", title: "Vacation/house/wedding/other"}
                                        ]}
                                        getOptionLabel={option=>option.title}
                                        onChange={(e, option) => setCreditCalculationDetails({...creditCalculationDetails, purpose: option.id})}
                                        renderInput={params => <TextField {...params} label="Purpose" margin="dense" variant="outlined" />}
                                    />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <Autocomplete
                                        getOptionLabel={option=>option.title}
                                        options={[
                                            {id: "months36Less", title: "Less than 36 months"},
                                            {id: "months36", title: "36 months"},
                                            {id: "months60", title: "60 months"},
                                            {id: "months60Great", title: "Greater than 60 months"}
                                        ]}
                                        size="small"
                                        onChange={(e, value) => setCreditCalculationDetails({...creditCalculationDetails, term: value.id})}
                                        renderInput={params => <TextField {...params} label="Term" margin="dense" variant="outlined" />}
                                    />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Interest Rate"
                                        type="number"
                                        margin="dense"
                                        name="interestRate"
                                        variant="outlined"
                                        value={creditCalculationDetails.interestRate}
                                        onChange={handleChangeOnCredit}
                                    />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Inquiries in the last six months"
                                        type="number"
                                        margin="dense"
                                        name="inquiry"
                                        variant="outlined"
                                        value={creditCalculationDetails.inquiry}
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
                    onClick={calulateCreditScore}
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
                <Typography variant="h3">Your score: {`${creditScore.value} - ${creditScore.grade}`} </Typography>
            </main>
        );
    }
};

export default Todo;