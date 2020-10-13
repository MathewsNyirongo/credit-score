const functions = require('firebase-functions');
const app = require('express')();

const {
    getAllTodos,
    postOneTodo,
    deleteTodo,
    editTodo
} = require('./APIs/todos');

const {
    loginUser,
    signUpUser
} = require('./APIs/users');

app.get('/todos', getAllTodos);
app.post('/todos', postOneTodo);
app.delete('/todos/:todoId', deleteTodo);
app.put('/todos/:todoId', editTodo);

app.post('/users/login', loginUser);
app.post('/users/signup', signUpUser);
exports.api = functions.https.onRequest(app);