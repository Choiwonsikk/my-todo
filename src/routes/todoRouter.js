const express = require("express");
// Express 패키지를 현재 파일에서 사용하기 위해 불러옴
const router = express.Router();
// Todo의 경로들을 따로 관리할 Router 객체 생성
const {
  getTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
} = require("../controllers/todoController.js");

router.get("/", getTodos);
router.get("/:id", getTodoById);
router.post("/", createTodo);
router.patch("/:id", updateTodo);
router.delete("/:id", deleteTodo);

module.exports = router;
