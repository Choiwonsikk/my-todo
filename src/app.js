require("dotenv").config();

const express = require("express"); //설치한 express 패키지를 현재 파일로 불러오는 코드     require("express"): Express 패키지를 가져옴
const cors = require("cors"); // 설치한 cors 패키지를 가져옴
const mysql = require("mysql2/promise");
// mysql이라는 변수를 통해 MySQL 드라이버의 기능을 사용

const app = express(); //Express 애플리케이션 객체를 생성
const PORT = 3000;

app.use(cors()); // CORS 설정을 Express에 적용
app.use(express.json());
// 클라이언트가 JSON 형식의 데이터를 보내면 Express가 읽을 수 있도록 변환해주는 미들웨어
// 클라이언트가 보낸 JSON 데이터를 req.body로 사용할 수 있게 해준다.

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});
// db.connect((err) => {
//   if (err) {
//     console.error("MySQL 연결 실패:", err);
//     return;
//   }

//   console.log("MySQL 연결 성공");
// });

const catchAsync = (func) => {
  return (req, res, next) => {
    func(req, res).catch((err) => next(err));
  };
};

/*app.post("/todos", (req, res) => {
  const { text } = req.body;
  //객체의 구조분해할당 - 객체 안에 있는 값을 꺼내서 같은 이름의 변수로 만드는 것

  console.log(text);
  
});
*/

app.get("/", (req, res) => {
  res.json({ message: "My Todo API" });
});
//루트 주소에 대한 GET API
// "/"는 주소 (req, res) req는 사용자가 보낸 모든 정보가 들어있는 객체 res는 보내는 응답

app.get(
  "/todos",
  catchAsync(async (req, res) => {
    const [result] = await db.query("SELECT * FROM todos");
    res.json(result);
    // } catch (err) {
    //   console.error(err);
    //   return res.status(500).json({ message: "데이터 조회 실패" });
    // }
  }),
);
// 전체 배열 출력

// app.get("/todos", (req, res) => {
//   res.json(todos);
// });
//”/todos” 주소로 GET 요청이 오면, 요청(req)을 받고 빈 배열([])을 JSON 형식으로 응답(res)해라.

app.get(
  "/todos/:id",
  catchAsync(async (req, res) => {
    const id = Number(req.params.id);

    if (Number.isInteger(id) === false || id <= 0) {
      return res.status(400).json({
        message: "id는 1이상인 정수이어야 합니다",
      });
    }

    const [result] = await db.query("SELECT * FROM todos WHERE id = ?", [id]);

    if (result.length === 0)
      return res.status(404).json({ message: "값을 찾을 수 없습니다" });

    res.json(result[0]);
  }),
);
// id에 해당하는 객체 전체 출력

// app.get("/todos/:id", (req, res) => {
//   const id = Number(req.params.id);
//   const todo = todos.find((todo) => {
//     return todo.id === id;
//   });

//   if (!todo) {
//     return res.status(404).json({
//       message: "Todo를 찾을 수 없습니다.",
//     });
//   }

//   res.json(todo);
// });

app.post(
  "/todos",
  catchAsync(async (req, res) => {
    const { title, text } = req.body;

    if (
      title === undefined ||
      typeof title !== "string" ||
      title.trim() === ""
    ) {
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

    const [result] = await db.query(
      "INSERT INTO todos (title, text) VALUES (?,?)",
      [title, text],
    );

    const newTodo = {
      id: result.insertId,
      title: title,
      text: text,
      completed: false,
    };
    res.status(201).json(newTodo);
  }),
);

// app.post("/todos", (req, res) => {
//   const { text } = req.body; //req로 받는건 body밖에 없나?

//   const newTodo = {
//     id: todos.length + 1,
//     text: text,
//     completed: false,
//   };

//   todos.push(newTodo);
//   res.json(newTodo);
// });

app.patch(
  "/todos/:id",
  catchAsync(async (req, res) => {
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

    const sql = `UPDATE todos SET ${fields.join(", ")} WHERE id = ?`; //

    const [result] = await db.query(sql, values);

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "값을 찾을 수 없습니다" });

    const [newTodo] = await db.query("SELECT * FROM todos WHERE id = ?", [id]);
    res.json(newTodo[0]);
  }),
);

// app.patch("/todos/:id", (req, res) => {
//   const id = Number(req.params.id);
//   const { completed } = req.body;

//   const todo = todos.find((todo) => {
//     return todo.id === id;
//   });

//   if (!todo) {
//     return res.status(404).json({
//       message: "Todo를 찾을 수 없습니다.",
//     });
//   }

//   todo.completed = completed;

//   res.json(todo);
// });

app.delete(
  "/todos/:id",
  catchAsync(async (req, res) => {
    const id = Number(req.params.id);

    if (Number.isInteger(id) === false || id <= 0) {
      //Number.isInteger 은 정수인지 아닌지 확인 후 boolean값 출력
      return res.status(400).json({
        message: "id는 1이상인 정수이어야 합니다",
      });
    }
    const [result] = await db.query("DELETE FROM todos WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Todo를 찾을 수 없습니다.",
      });
    }
    res.json({
      id: id,
      message: "Todo 삭제 성공",
    });
  }),
);

// app.delete("/todos/:id", (req, res) => {
//   const id = Number(req.params.id);
//   const todoIndex = todos.findIndex((todo) => {
//     return todo.id === id;
//   }); // findIndex 는 return 조건에 맞는 인덱스값을 추출, 조건에 맞는 값 없으면 -1 반환

//   if (todoIndex === -1) {
//     return res.status(404).json({
//       message: "Todo를 찾을 수 없음",
//     });
//   }

//   const deletedTodo = todos.splice(todoIndex, 1)[0];
//   // splice(a, b) - 인덱스 a 위치부터 b개를 제거

//   res.json(deletedTodo);
//   // 근데 제거한 객체를 반환할 필요가 있나 ?
// });
const globalErrorHandler = (err, req, res, next) => {
  console.log(err);

  return res.status(500).json({
    message: "서버 에러가 발생했습니다.",
  });
};

app.use(globalErrorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
