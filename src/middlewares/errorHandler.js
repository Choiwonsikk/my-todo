const globalErrorHandler = (err, req, res, next) => {
  console.log(err);

  const statusCode = err.status || 500;
  //오류 객체에 상태 코드가 있으면 그 값을 쓰고, 없으면 500을 기본값으로 쓰라는 뜻
  //이미 정해진 오류 상태 코드가 있으면 존중하고, 없으면 서버 오류로 처리한다

  if (err.type === "entity.parse.failed") {
    return res.status(400).json({
      message: "JSON 형식이 올바르지 않습니다.",
    });
  }

  return res.status(statusCode).json({
    message: "서버 에러가 발생했습니다.",
  });
};

const notFoundHandler = (req, res) => {
  return res.status(404).json({
    message: "요청한 경로를 찾을 수 없습니다.",
  });
};

module.exports = { globalErrorHandler, notFoundHandler };
