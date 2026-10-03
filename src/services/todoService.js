const { getTodosDao } = require("../models/todoDao.js");
const { getSummaryDao } = require("../models/todoDao.js");
const { getTodoByIdDao } = require("../models/todoDao.js");
const { createTodoDao } = require("../models/todoDao.js");
const { updateTodoDao } = require("../models/todoDao.js");
const { deleteTodoDao } = require("../models/todoDao.js");

const getTodosService = async (queryOptions) => {
  const result = await getTodosDao(queryOptions);
  const { pagination } = queryOptions;
  const hasPrevious = pagination.offset > 0;
  const hasNext = pagination.offset + result.todos.length < result.total;
  result.hasPrevious = hasPrevious;
  result.hasNext = hasNext;
  return result;
};

const getSummaryService = async () => {
  const result = await getSummaryDao();
  const completionRate =
    result.total === 0
      ? 0
      : Math.round((result.completed / result.total) * 100);
  result.completionRate = completionRate;
  return result;
};

const getTodoByIdService = async (id) => {
  const result = await getTodoByIdDao(id);
  return result;
};

const createTodoService = async (title, text) => {
  const resultId = await createTodoDao(title, text);
  const result = await getTodoByIdDao(resultId.insertId);
  return result;
};

const updateTodoService = async (updateData, id) => {
  const updateResult = await updateTodoDao(updateData, id); // update 하는 함수

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
  getSummaryService,
  getTodoByIdService,
  createTodoService,
  updateTodoService,
  deleteTodoService,
};
