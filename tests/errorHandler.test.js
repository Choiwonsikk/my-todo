const {
  globalErrorHandler,
  notFoundHandler,
} = require("../src/middlewares/errorHandler.js");
describe("에러핸들러 테스트", () => {
  describe("globalErrorHandler test", () => {
    test("JSON 파싱 오류면 400을 반환", () => {
      const err = {
        type: "entity.parse.failed",
      };
      const req = {};
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = jest.fn();

      globalErrorHandler(err, req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "JSON 형식이 올바르지 않습니다.",
      });
      expect(next).not.toHaveBeenCalled();
    });

    test("상태코드 없는 일반오류는 500반환", () => {
      const err = {};
      const req = {};
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = jest.fn();

      globalErrorHandler(err, req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "서버 에러가 발생했습니다.",
      });
      expect(next).not.toHaveBeenCalled();
    });

    test("상태코드 있는 오류는 그대로 반환", () => {
      const err = { status: 403 };
      const req = {};
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = jest.fn();

      globalErrorHandler(err, req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        message: "서버 에러가 발생했습니다.",
      });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe("notFoundHandler test", () => {
    test("경로를 찾을 수 없다면 404반환", () => {
      const req = {};
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      notFoundHandler(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "요청한 경로를 찾을 수 없습니다.",
      });
    });
  });
});
