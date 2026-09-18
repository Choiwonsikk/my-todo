const db = require("../db/database.js");

const getTodosDao = async () => {
  const [result] = await db.query("SELECT * FROM todos");
  return result;
};

const getTodoByIdDao = async (id) => {
  const [result] = await db.query("SELECT * FROM todos WHERE id = ?", [id]);
  return result;
};

const createTodoDao = async (title, text) => {
  const [result] = await db.query(
    "INSERT INTO todos (title, text) VALUES (?,?)",
    [title, text],
  );
  return result;
};

const updateTodoDao = async (fields, values) => {
  const sql = `UPDATE todos SET ${fields.join(", ")} WHERE id = ?`;
  const [result] = await db.query(sql, values);

  return result;
};

const deleteTodoDao = async (id) => {
  const [result] = await db.query("DELETE FROM todos WHERE id = ?", [id]);

  return result;
};

module.exports = {
  getTodosDao,
  getTodoByIdDao,
  createTodoDao,
  updateTodoDao,
  deleteTodoDao,
};
