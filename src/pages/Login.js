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
        width: '100%',
        marginTop: theme.spacing(1)
    },
    submit: {
        margin: theme.spacing(3, 0, 2)
    },
    customError: {
        color: 'red',
        fontSize: '0.8rem',
        marginTop: 10
    },
    progress: {
        position: 'absolute'
    }
}));

const Login = () => {
    const [errors, setErrors] = useState([]);
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [loading, setLoading] = useState(false);
    let history = useHistory();
    const classes = useStyles();

    const handleSubmit = (event) => {
        event.preventDefault();
        setLoading(true);
        const userData = {
            email: email,
            password: password
        };
        Axios.post(`${AppConstants.apiBaseUrl}/users/login`, userData).then(res => {
            localStorage.setItem('AuthToken', `Bearer ${res.data.token}`);
            setLoading(false);
            history.push("/");
        }).catch(err => {
            console.error(err);
            setErrors(err);
            setLoading(false);
        });
    };

    return (
        <div>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlined />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Login
                    </Typography>
                    <form className={classes.form} noValidate>
                        <TextField
                            variant="outlined"
                            type="email"
							margin="normal"
							required
							fullWidth
							id="email"
							label="Email Address"
							name="email"
							autoComplete="email"
                            autoFocus
                            value={email}
                            helperText={errors.email}
                            error={errors.email ? true : false}
                            onChange={e => setEmail(e.target.value)}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            type="password"
							required
							fullWidth
							id="password"
							label="Password"
							name="password"
                            autoComplete="current-password"
                            value={password}
                            helperText={errors.password}
                            error={errors.password ? true : false}
                            onChange={e => setPassword(e.target.value)}
                        />
                        <Button
                            type="submit"
							fullWidth
							variant="contained"
							color="primary"
                            className={classes.submit}
                            onClick={handleSubmit}
                            disabled={loading || !email || !password}
                        >
                            Sign In
                            {loading && <CircularProgress size={30} className={classes.progress} />}
                        </Button>
                        <Grid container>
                            <Grid item>
                                <Link href="signup" variant="body2">
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Grid>
                        </Grid>
                        {errors.general && (
                            <Typography variant="body2" className={classes.customError}>
                                {errors.general}
                            </Typography>
                        )}
                    </form>
                </div>
            </Container>
        </div>
    );
};

export default Login;