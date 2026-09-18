const { getTodosDao } = require("../models/todoDao.js");
const { getTodoByIdDao } = require("../models/todoDao.js");
const { createTodoDao } = require("../models/todoDao.js");
const { updateTodoDao } = require("../models/todoDao.js");
const { deleteTodoDao } = require("../models/todoDao.js");

const getTodosService = async () => {
  return await getTodosDao();
};

const getTodoByIdService = async (id) => {
  const result = await getTodoByIdDao(id);

  return result;
};

const createTodoService = async (title, text) => {
  const result = await createTodoDao(title, text);

  return result;
};

const updateTodoService = async (fields, values, id) => {
  const updateResult = await updateTodoDao(fields, values); // update 하는 함수

  if (updateResult.affectedRows === 0) return 0;
  else return await getTodoByIdDao(id);
};

const deleteTodoService = async (id) => {
  const result = await deleteTodoDao(id);
  if (result.affectedRows === 0) return 0;
  else return 1;
};

module.exports = {
  getTodosService,
  getTodoByIdService,
  createTodoService,
  updateTodoService,
  deleteTodoService,
};
