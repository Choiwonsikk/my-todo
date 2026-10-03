const express = require("express");
// Express 패키지를 현재 파일에서 사용하기 위해 불러옴
const router = express.Router();
// Todo의 경로들을 따로 관리할 Router 객체 생성
const {
  getTodos,
  getSummary,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
} = require("../controllers/todoController.js");
const {
  validateTodoId,
  validateCreateTodo,
  validateUpdateTodo,
  validatePagination,
  validateCompletedFilter,
  validateSortOrder,
  validateKeywordFilter,
} = require("../middlewares/todoMiddleware.js");

router.get(
  "/",
  validatePagination,
  validateCompletedFilter,
  validateSortOrder,
  validateKeywordFilter,
  getTodos,
);
router.get("/summary", getSummary);
router.get("/:id", validateTodoId, getTodoById);
router.post("/", validateCreateTodo, createTodo);
router.patch("/:id", validateTodoId, validateUpdateTodo, updateTodo);
router.delete("/:id", validateTodoId, deleteTodo);

module.exports = router;
