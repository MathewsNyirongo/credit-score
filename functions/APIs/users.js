const { admin, db } = require('../utils/admin');
const config = require('../utils/config');
const firebase = require('firebase');

firebase.initializeApp(config);

const { validateLoginData, validateSignUpData} = require('../utils/validators');
const { request, response } = require('express');

exports.loginUser = (request, response) => {
    const user = {
        email: request.body.email,
        password: request.body.password
    };

    const { valid, errors } = validateLoginData(user);
    if (!valid) {
        return response.status(400).json(errors);
    }

    firebase
    .auth()
    .signInWithEmailAndPassword(user.email, user.password)
    .then((data) => {
        return data.user.getIdToken();
    })
    .then((token) => {
        return response.json({ token });
    })
    .catch((error) => {
        console.error(error);
        return response.status(403).json({ general: 'Incorrect credentials. Please try again!' });
    });
};

exports.signUpUser = (request, response) => {
    const newUser = {
        firstName: request.body.firstName,
        lastName: request.body.lastName,
        username: request.body.username,
        email: request.body.email,
        password: request.body.password,
        confirmPassword: request.body.confirmPassword,
        phoneNumber: request.body.phoneNumber,
        country: request.body.country
    };

    const { errors, valid } = validateSignUpData(newUser);

    if (!valid) {
        return response.status(400).json(errors);
    }

    let token, userId;

    db
    .doc(`/users/${newUser.username}`)
    .get()
    .then(document => {
        if (document.exists) {
            return response.status(400).json({ username: "this username is already taken" });
        }else{
            return firebase.auth().createUserWithEmailAndPassword(
                newUser.email,
                newUser.password
            );
        }
    })
    .then(data => {
        userId = data.user.uid;
        return data.user.getIdToken();
    })
    .then(idToken => {
        token = idToken;
        const userCredentials = {
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            username: newUser.username,
            email: newUser.email,
            country: newUser.country,
            phoneNumber: newUser.phoneNumber,
            createdAt: new Date().toISOString(),
            userId
        };
        return db
        .doc(`/users/${newUser.username}`)
        .set(userCredentials);
    })
    .then(() => {
        return response.status(201).json({ token });
    })
    .catch(err => {
        console.error(err);
        if (err.code === 'auth/email-already-in-use') {
            return response.status(400).json({ email: "Email is already in use" });
        } else {
            return response.status(500).json({ general: "Something went wrong. Please try again" });
        }
    });
};