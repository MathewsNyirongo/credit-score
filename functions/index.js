const functions = require('firebase-functions');
const app = require('express')();
const auth = require('./utils/auth');

const {
    getAllTodos,
    postOneTodo,
    deleteTodo,
    editTodo
} = require('./APIs/todos');

const {
    loginUser,
    signUpUser,
    uploadProfilePhoto,
    getUserDetails,
    updateUserDetails
} = require('./APIs/users');


app.get('/todos', auth, getAllTodos);
app.post('/todos', auth, postOneTodo);
app.delete('/todos/:todoId', auth, deleteTodo);
app.put('/todos/:todoId', auth, editTodo);

app.post('/users/login', loginUser);
app.post('/users/signup', signUpUser);
app.post('/users/image', auth, uploadProfilePhoto);
app.get('/user', auth, getUserDetails);
app.put('/user', auth, updateUserDetails);
exports.api = functions.https.onRequest(app);