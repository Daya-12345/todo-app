const express = require("express");
const router = express.Router();

const {
    getAllTodos,
    createTodo,
    getTodoById,
    updateTodo,
    deleteTodo
} = require("../controllers/todoController");

// GET /todos
router.get("/", getAllTodos);

// POST /todos
router.post("/", createTodo);

// GET /todos/:id
router.get("/:id", getTodoById);

// PUT /todos/:id
router.put("/:id", updateTodo);

// DELETE /todos/:id
router.delete("/:id", deleteTodo);

module.exports = router;