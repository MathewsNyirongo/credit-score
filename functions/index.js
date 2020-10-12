const functions = require('firebase-functions');
const app = require('express')();

const {
    getAllTodos,
    postOneTodo,
    deleteTodo,
    editTodo
} = require('./APIs/todos');

app.get('/todos', getAllTodos);
app.post('/todos', postOneTodo);
app.delete('/todos/:todoId', deleteTodo);
app.put('/todos/:todoId', editTodo);
exports.api = functions.https.onRequest(app);