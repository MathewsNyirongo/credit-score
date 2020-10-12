const { request, response } = require('express');
const { error } = require('firebase-functions/lib/logger');
const { db } = require('../utils/admin');

exports.getAllTodos = (request, response) => {
    db
    .collection('todos')
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
    })
}