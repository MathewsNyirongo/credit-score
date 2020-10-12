exports.getAllTodos = (request, response) => {
    todos = [
        {
            'id': '1',
            'title': 'greeting',
            'body': 'Hello world from Mathews'
        },
        {
            'id': '2',
            'title': 'greeting2',
            'body': 'Hello world from Miyo'
        }
    ];
    return response.json(todos);
}