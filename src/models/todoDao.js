const db = require("../db/database.js");

const getTodosDao = async (queryOptions) => {
  const { pagination, completedFilter, sortOrder, keywordFilter } =
    queryOptions;
  const { limit, offset } = pagination;
  const conditions = [];
  const filterValues = [];

  if (completedFilter !== undefined) {
    conditions.push("completed = ?");
    filterValues.push(completedFilter);
  }

  if (keywordFilter !== undefined) {
    conditions.push("title LIKE ?");
    filterValues.push(`%${keywordFilter}%`);
  }

  const whereSql =
    conditions.length === 0 ? "" : ` WHERE ${conditions.join(" AND ")}`;

  const [[countResult], [result]] = await Promise.all([
    db.query(`SELECT COUNT(*) AS total FROM todos ${whereSql}`, filterValues), //전체 개수를 세기
    db.query(
      `SELECT * FROM todos ${whereSql} ORDER BY id ${sortOrder} LIMIT ? OFFSET ? `,
      [...filterValues, limit, offset],
    ),
  ]);

  return {
    todos: result,
    total: countResult[0].total,
  };
};

const getSummaryDao = async () => {
  const [result] = await db.query(`SELECT COUNT(*) AS total,
  COUNT(CASE WHEN completed = 1 THEN 2 END) AS completed,
  COUNT(CASE WHEN completed = 0 THEN 1 END) AS incomplete
FROM todos`);
  return result[0];
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

const updateTodoDao = async (updateData, id) => {
  const { title, text, completed } = updateData;
  const fields = [];
  const values = [];

  if (title !== undefined) {
    fields.push("title = ?");
    values.push(title);
  }
  if (text !== undefined) {
    fields.push("text = ?");
    values.push(text);
  }
  if (completed !== undefined) {
    fields.push("completed = ?");
    values.push(completed);
  }
  values.push(id);

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
  getSummaryDao,
  getTodoByIdDao,
  createTodoDao,
  updateTodoDao,
  deleteTodoDao,
};
