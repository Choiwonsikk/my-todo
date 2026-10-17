require("dotenv").config({
  path: process.env.NODE_ENV === "test" ? ".env.test" : ".env",
}); //dotenv.config()를, NODE_ENV가 "test"일 때 .env.test를 읽도록 바꿈

const express = require("express"); //설치한 express 패키지를 현재 파일로 불러오는 코드     require("express"): Express 패키지를 가져옴
const cors = require("cors"); // 설치한 cors 패키지를 가져옴

const app = express(); //Express 애플리케이션 객체를 생성
const PORT = 3000;
const todoRouter = require("./routes/todoRouter.js"); // app.js 와 router파일 참조
const {
  globalErrorHandler,
  notFoundHandler,
} = require("./middlewares/errorHandler.js");

app.use(cors()); // CORS 설정을 Express에 적용
app.use(express.json());
// 클라이언트가 JSON 형식의 데이터를 보내면 Express가 읽을 수 있도록 변환해주는 미들웨어
// 클라이언트가 보낸 JSON 데이터를 req.body로 사용할 수 있게 해준다.

app.use("/todos", todoRouter);
app.use(notFoundHandler);
app.use(globalErrorHandler);

if (require.main === module)
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });

module.exports = app;
