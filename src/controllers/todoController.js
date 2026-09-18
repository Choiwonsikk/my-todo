const { getTodosService } = require("../services/todoService.js");
const { getTodoByIdService } = require("../services/todoService.js");
const { createTodoService } = require("../services/todoService.js");
const { updateTodoService } = require("../services/todoService.js");
const { deleteTodoService } = require("../services/todoService.js");

const getTodos = async (req, res) => {
  const result = await getTodosService();
  res.json(result);
};

const getTodoById = async (req, res) => {
  const id = Number(req.params.id);

  if (Number.isInteger(id) === false || id <= 0) {
    return res.status(400).json({
      message: "id는 1이상인 정수이어야 합니다",
    });
  }
  const result = await getTodoByIdService(id);
  if (result.length === 0)
    return res.status(404).json({ message: "값을 찾을 수 없습니다" });
  res.json(result[0]);
};

const createTodo = async (req, res) => {
  const { title, text } = req.body;

  if (title === undefined || typeof title !== "string" || title.trim() === "") {
    return res.status(400).json({
      message: "title은 비어 있지 않은 문자열이어야 합니다.",
    });
  }
  if (text !== undefined) {
    if (typeof text !== "string") {
      return res.status(400).json({
        message: "text는 문자열 형식이어야 합니다.",
      });
    }
  }

  const result = await createTodoService(title, text);

  const newTodo = {
    id: result.insertId,
    title: title,
    text: text,
    completed: false,
  };
  res.status(201).json(newTodo);
};

const updateTodo = async (req, res) => {
  const id = Number(req.params.id);
  const { title, text, completed } = req.body;

  if (Number.isInteger(id) === false || id <= 0) {
    return res.status(400).json({
      message: "id는 1이상인 정수이어야 합니다",
    });
  }

  const fields = [];
  const values = [];

  if (title !== undefined) {
    if (typeof title !== "string" || title.trim() === "") {
      return res.status(400).json({
        message: "title은 비어 있지 않은 문자열이어야 합니다.",
      });
    }
    fields.push("title = ?");
    values.push(title);
  }
  if (text !== undefined) {
    if (typeof text !== "string") {
      return res.status(400).json({
        message: "text는 문자열 형식이어야 합니다.",
      });
    }
    fields.push("text = ?");
    values.push(text);
  }
  if (completed !== undefined) {
    if (typeof completed !== "boolean") {
      return res.status(400).json({
        message: "completed는 boolean 형식이어야 합니다.",
      });
    }
    fields.push("completed = ?");
    values.push(completed);
  }
  if (fields.length === 0) {
    return res.status(400).json({
      message: "입력값이 없습니다",
    });
  }
  values.push(id);

  const updateResult = await updateTodoService(fields, values, id);

  if (updateResult === 0)
    return res.status(404).json({ message: "값을 찾을 수 없습니다" });
  else res.json(updateResult[0]);
};

const deleteTodo = async (req, res) => {
  const id = Number(req.params.id);

  if (Number.isInteger(id) === false || id <= 0) {
    //Number.isInteger 은 정수인지 아닌지 확인 후 boolean값 출력
    return res.status(400).json({
      message: "id는 1이상인 정수이어야 합니다",
    });
  }
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
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
};
