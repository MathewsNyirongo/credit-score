const { request, response } = require('express');
const { error } = require('firebase-functions/lib/logger');
const { db } = require('../utils/admin');

exports.getAllTodos = (request, response) => {
    db
    .collection('todos')
    .where('username', '==', request.user.username)
    .orderBy('createdAt', 'desc')
    .get()
    .then((data) => {
        let todos = [];
        data.forEach((document) => {
            todos.push({
                todoId: document.id,
                title: document.data().title,
                body: document.data().body,
                createdAt: document.data().createdAt
            });
        });
        return response.json(todos);
    })
    .catch((error) => {
        console.error(error);
        return response.status(500).json({ error: error.code });
    });
};

exports.postOneTodo = (request, response) => {
    if (request.body.body.trim() === '') {
        return response.status(400).json({ body: 'Must not be empty' });
    }

    if (request.body.title.trim() === '') {
        return response.status(400).json({ title: 'Must not be empty' });
    }

    const newTodoItem = {
        title: request.body.title,
        body: request.body.body,
        username: request.user.username,
        createdAt: new Date().toISOString()
    };
    db
    .collection('todos')
    .add(newTodoItem)
    .then((document) => {
        const responseTodoItem = newTodoItem;
        responseTodoItem.id = document.id;
        return response.json(responseTodoItem);
    })
    .catch((error) => {
        response.status(500).json({ error: 'Something went wrong' });
        console.error(error);
    });
};

exports.deleteTodo = (request, response) => {
    const doc = db.doc(`/todos/${request.params.todoId}`);
    doc
        .get()
        .then((document) => {
            if (!document.exists) {
                return response.status(404).json({ error: 'Todo not found' });
            }
            if (document.data().username !== request.user.username) {
                return response.status(403).json({ error: "Unauthorized" });
            }
            return doc.delete();
        })
        .then(() => {
            response.json({ message: 'Deleted successfully' });
        })
        .catch((error) => {
            console.error(error);
            return response.status(500).json({ error: error.code });
        });
};

exports.editTodo = (request, response) => {
    if (request.body.todoId || request.body.createdAt) {
        response.status(403).json({ message: 'Not allowed to edit' });
    }
    let doc = db.collection('todos').doc(`${request.params.todoId}`);
    doc.update(request.body)
    .then(() => {
        response.json({ message: 'Updated successfully' });
    })
    .catch((error) => {
        console.log(error);
        return response.status(500).json({
            error: error.code
        });
    });
};