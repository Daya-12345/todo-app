const fs = require("fs");
const path = require("path");

// Path to todos.json
const filePath = path.join(__dirname, "../data/todos.json");

// Helper function to read todos
const readTodos = () => {
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data);
};

const writeTodos = (todos) => {
    fs.writeFileSync(filePath, JSON.stringify(todos, null, 2));
};

// GET /todos
const getAllTodos = (req, res) => {
    const todos = readTodos();
    res.status(200).json(todos);
};

const createTodo = (req, res) => {

    const todos = readTodos();

    const { title, description, important, dueDate, list } = req.body;

    if (!title) {
        return res.status(400).json({
            message: "Title is required"
        });
    }

    const newTodo = {
        id: Date.now(),
        title,
        description: description || "",
        completed: false,
        important: important || false,
        dueDate: dueDate || null,
        list: list || null,
        createdAt: new Date().toISOString()
    };

    todos.push(newTodo);

    writeTodos(todos);

    res.status(201).json({
        message: "Todo created successfully",
        todo: newTodo
    });

};

// GET /todos/:id
const getTodoById = (req, res) => {

    const todos = readTodos();

    const id = Number(req.params.id);

    const todo = todos.find(todo => todo.id === id);

    if (!todo) {
        return res.status(404).json({
            message: "Todo not found"
        });
    }

    res.status(200).json(todo);
};

// PUT /todos/:id
const updateTodo = (req, res) => {

    const todos = readTodos();

    const id = Number(req.params.id);

    const todo = todos.find(todo => todo.id === id);

    if (!todo) {
        return res.status(404).json({
            message: "Todo not found"
        });
    }

    const { title, description, completed, important, dueDate, list } = req.body;

    if (title !== undefined) {
        todo.title = title;
    }

    if (description !== undefined) {
        todo.description = description;
    }

    if (completed !== undefined) {
        todo.completed = completed;
    }

    if (important !== undefined) {
        todo.important = important;
    }

    if (dueDate !== undefined) {
        todo.dueDate = dueDate;
    }

    if (list !== undefined) {
        todo.list = list;
    }

    writeTodos(todos);

    res.status(200).json({
        message: "Todo updated successfully",
        todo
    });

};

// DELETE /todos/:id
const deleteTodo = (req, res) => {

    const todos = readTodos();

    const id = Number(req.params.id);

    const index = todos.findIndex(todo => todo.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Todo not found"
        });
    }

    const deletedTodo = todos[index];

    todos.splice(index, 1);

    writeTodos(todos);

    res.status(200).json({
        message: "Todo deleted successfully",
        todo: deletedTodo
    });

};

module.exports = {
    getAllTodos,
    createTodo,
    getTodoById,
    updateTodo,
    deleteTodo
};