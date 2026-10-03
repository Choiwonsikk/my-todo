const { getTodosService } = require("../services/todoService.js");
const { getSummaryService } = require("../services/todoService.js");
const { getTodoByIdService } = require("../services/todoService.js");
const { createTodoService } = require("../services/todoService.js");
const { updateTodoService } = require("../services/todoService.js");
const { deleteTodoService } = require("../services/todoService.js");

const getTodos = async (req, res) => {
  const queryOptions = {
    pagination: req.pagination,
    completedFilter: req.completedFilter,
    sortOrder: req.sortOrder,
    keywordFilter: req.keywordFilter,
  };
  const result = await getTodosService(queryOptions);
  const { todos, total, hasPrevious, hasNext } = result;
  const { limit, offset } = req.pagination;
  res.json({
    todos: todos,
    pagination: {
      total: total,
      limit: limit,
      offset: offset,
      hasPrevious: hasPrevious,
      hasNext: hasNext,
      sort: req.sortOrder,
    },
  });
};

const getSummary = async (req, res) => {
  const result = await getSummaryService();
  res.json(result);
};

const getTodoById = async (req, res) => {
  const id = req.todoId;

  const result = await getTodoByIdService(id);
  if (result.length === 0)
    return res.status(404).json({ message: "값을 찾을 수 없습니다" });
  res.json(result[0]);
};

const createTodo = async (req, res) => {
  const { title, text } = req.body;

  const result = await createTodoService(title, text);
  res.status(201).json(result[0]);
};

const updateTodo = async (req, res) => {
  const id = req.todoId;
  const { title, text, completed } = req.body;
  const updateData = { title, text, completed };
  const updateResult = await updateTodoService(updateData, id);

  if (updateResult === 0)
    return res.status(404).json({ message: "값을 찾을 수 없습니다" });
  else res.json(updateResult[0]);
};

const deleteTodo = async (req, res) => {
  const id = req.todoId;

  const result = await deleteTodoService(id);

  if (result === 0) {
    return res.status(404).json({
      message: "Todo를 찾을 수 없습니다.",
    });
  }

  res.json({
    id: id,
    message: "Todo 삭제 성공",
  });
};

module.exports = {
  getTodos,
  getSummary,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
};
