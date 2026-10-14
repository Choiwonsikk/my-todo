const {
  validateTodoId,
  validateCreateTodo,
  validateUpdateTodo,
  validatePagination,
  validateCompletedFilter,
  validateSortOrder,
  validateKeywordFilter,
} = require("../src/middlewares/todoMiddleware.js");

describe("todoMiddleware", () => {
  describe("validateTodoId", () => {
    test("유효한 id는 숫자로 변환하고 next를 호출한다", () => {
      const req = { params: { id: "3" } };
      const res = {};
      const next = jest.fn();

      validateTodoId(req, res, next);

      expect(req.todoId).toBe(3);
      expect(next).toHaveBeenCalledTimes(1);
    });

    test("검증 실패 테스트(숫자가 아닌 값)", () => {
      const req = { params: { id: "abc" } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = jest.fn();

      validateTodoId(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "id는 1이상인 정수이어야 합니다",
      });
      expect(next).not.toHaveBeenCalled();
    });

    test("0 이하 id면 400을 반환하고 next를 호출하지 않는다", () => {
      const req = { params: { id: "0" } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = jest.fn();

      validateTodoId(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "id는 1이상인 정수이어야 합니다",
      });
      expect(next).not.toHaveBeenCalled();
    });
  });
  describe("validateCreateTodo", () => {
    test("유효한 title과 text라면 next()호출 ", () => {
      const req = {
        body: {
          title: "공부하기",
          text: "Node.js 공부",
        },
      };
      const res = {};
      const next = jest.fn();

      validateCreateTodo(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
    });

    test("title이 없다면 400을 반환하고 next를 호출하지 않는다", () => {
      const req = { body: { text: "title 없음" } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = jest.fn();

      validateCreateTodo(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "title은 비어 있지 않은 문자열이어야 합니다.",
      });
      expect(next).not.toHaveBeenCalled();
    });

    test("text가 없어도 title값이 정상값이라면 next호출", () => {
      const req = { body: { title: "text 없음" } };
      const res = {};
      const next = jest.fn();

      validateCreateTodo(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
    });

    test("text가 숫자만 있을 경우에 400을 반환하고 next 호출하지 않는다", () => {
      const req = { body: { title: "text 숫자", text: 123 } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = jest.fn();

      validateCreateTodo(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "text는 문자열 형식이어야 합니다.",
      });
      expect(next).not.toHaveBeenCalled();
    });

    test("title이 공백이라면 400을 반환하고 next를 호출하지 않는다", () => {
      const req = { body: { title: "   ", text: "title 공백" } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = jest.fn();

      validateCreateTodo(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "title은 비어 있지 않은 문자열이어야 합니다.",
      });
      expect(next).not.toHaveBeenCalled();
    });

    test("title이 문자열이 아니라면 400을 반환하고 next를 호출하지 않는다", () => {
      const req = { body: { title: 123, text: "title 숫자" } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = jest.fn();

      validateCreateTodo(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "title은 비어 있지 않은 문자열이어야 합니다.",
      });
      expect(next).not.toHaveBeenCalled();
    });
  });
  describe("validateUpdateTodo", () => {
    test("수정할 값이 없을 때 400 반환", () => {
      const req = { body: {} };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = jest.fn();

      validateUpdateTodo(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "입력값이 없습니다",
      });
      expect(next).not.toHaveBeenCalled();
    });

    test("title 정상 수정 테스트", () => {
      const req = { body: { title: "수정한 제목" } };
      const res = {};
      const next = jest.fn();

      validateUpdateTodo(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
    });

    test("title 수정값이 공백일 때 400 반환", () => {
      const req = { body: { title: "   " } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = jest.fn();

      validateUpdateTodo(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "title은 비어 있지 않은 문자열이어야 합니다.",
      });
      expect(next).not.toHaveBeenCalled();
    });

    test("text 정상 수정 테스트", () => {
      const req = { body: { text: "수정한 내용" } };
      const res = {};
      const next = jest.fn();

      validateUpdateTodo(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
    });

    test("text 수정값이 숫자일 때 400 반환", () => {
      const req = { body: { text: 123 } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = jest.fn();

      validateUpdateTodo(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "text는 문자열 형식이어야 합니다.",
      });
      expect(next).not.toHaveBeenCalled();
    });

    test("completed 정상 수정 테스트", () => {
      const req = { body: { completed: true } };
      const res = {};
      const next = jest.fn();

      validateUpdateTodo(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
    });

    test("completed 수정값이 boolean형식이 아닐 때 400 반환", () => {
      const req = { body: { completed: "true" } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = jest.fn();

      validateUpdateTodo(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "completed는 boolean 형식이어야 합니다.",
      });
      expect(next).not.toHaveBeenCalled();
    });
  });
  describe("validatePagination", () => {
    test("limit과 offset이 없으면 기본값을 저장하고 next를 호출한다", () => {
      const req = { query: {} };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = jest.fn();

      validatePagination(req, res, next);

      expect(req.pagination).toEqual({
        limit: 10,
        offset: 0,
      });
      expect(next).toHaveBeenCalledTimes(1);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    test("query값 문자열을 숫자로 변환", () => {
      const req = {
        query: {
          limit: "5",
          offset: "2",
        },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = jest.fn();

      validatePagination(req, res, next);

      expect(req.pagination).toEqual({
        limit: 5,
        offset: 2,
      });
      expect(next).toHaveBeenCalledTimes(1);
    });

    test("limit가 0일 때 400을 반환", () => {
      const req = { query: { limit: "0", offset: "0" } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = jest.fn();

      validatePagination(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "limit과 offset은 조건에 맞는 정수여야 합니다.",
      });
      expect(next).not.toHaveBeenCalled();
    });

    test("limit가 숫자로 변환할 수 없는 값일 때 400을 반환", () => {
      const req = { query: { limit: "abc", offset: "0" } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = jest.fn();

      validatePagination(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "limit과 offset은 조건에 맞는 정수여야 합니다.",
      });
      expect(next).not.toHaveBeenCalled();
    });

    test("offset이 음수일 때 400을 반환", () => {
      const req = { query: { limit: "10", offset: "-1" } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = jest.fn();

      validatePagination(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "limit과 offset은 조건에 맞는 정수여야 합니다.",
      });
      expect(next).not.toHaveBeenCalled();
    });

    test("offset이 숫자로 변환할 수 없는 값일 때 400을 반환", () => {
      const req = { query: { limit: "10", offset: "abc" } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = jest.fn();

      validatePagination(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "limit과 offset은 조건에 맞는 정수여야 합니다.",
      });
      expect(next).not.toHaveBeenCalled();
    });
  });
  describe("validateCompletedFilter", () => {
    test("필터값을 보내지 않으면 next를 호출한다", () => {
      const req = { query: {} };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = jest.fn();

      validateCompletedFilter(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(req.completedFilter).toBeUndefined();
    });

    test('"true"를 boolean true로 변환하고 next를 호출한다', () => {
      const req = { query: { completed: "true" } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = jest.fn();

      validateCompletedFilter(req, res, next);

      expect(req.completedFilter).toBe(true);
      expect(next).toHaveBeenCalledTimes(1);
    });

    test('"false"를 boolean false로 변환하고 next를 호출한다', () => {
      const req = { query: { completed: "false" } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = jest.fn();

      validateCompletedFilter(req, res, next);

      expect(req.completedFilter).toBe(false);
      expect(next).toHaveBeenCalledTimes(1);
    });

    test("허용되지 않는 completed값은 400 반환", () => {
      const req = { query: { completed: "Yes" } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = jest.fn();

      validateCompletedFilter(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "completed는 boolean값이어야 합니다.",
      });
      expect(next).not.toHaveBeenCalled();
    });
  });
  describe("validateSortOrder", () => {
    test("정렬값을 보내지 않으면 next를 호출한다", () => {
      const req = { query: {} };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = jest.fn();

      validateSortOrder(req, res, next);

      expect(req.sortOrder).toBe("asc");
      expect(next).toHaveBeenCalledTimes(1);
    });

    test('"asc" 정렬값을 보내면 asc로 저장하고 next를 호출한다', () => {
      const req = { query: { sort: "asc" } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = jest.fn();

      validateSortOrder(req, res, next);

      expect(req.sortOrder).toBe("asc");
      expect(next).toHaveBeenCalledTimes(1);
    });

    test('"desc" 정렬값을 보내면 desc로 저장하고 next를 호출한다', () => {
      const req = { query: { sort: "desc" } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = jest.fn();

      validateSortOrder(req, res, next);

      expect(req.sortOrder).toBe("desc");
      expect(next).toHaveBeenCalledTimes(1);
    });

    test("허용되지않는 정렬값을 보내면 400반환", () => {
      const req = { query: { sort: "random" } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = jest.fn();

      validateSortOrder(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "asc 또는 desc이어야 합니다. ",
      });
      expect(next).not.toHaveBeenCalled();
    });
  });
  describe("validateKeywordFilter", () => {
    test("키워드를 보내지 않으면 next를 호출한다", () => {
      const req = { query: {} };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = jest.fn();

      validateKeywordFilter(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(req.keywordFilter).toBeUndefined(); //검색 조건 없이 전체 목록을 조회
    });

    test("키워드 앞뒤 공백 제거 후 next를 호출한다", () => {
      const req = { query: { keyword: "  공부  " } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = jest.fn();

      validateKeywordFilter(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(req.keywordFilter).toBe("공부");
    });

    test("키워드에 공백만 있을 경우 400반환", () => {
      const req = { query: { keyword: "    " } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = jest.fn();

      validateKeywordFilter(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "단어를 입력해주세요",
      });
      expect(next).not.toHaveBeenCalled();
    });
  });
});
//json()이 이 객체를 인자로 받아 호출됐는지 확인
//toHaveBeenCalled()은 한 번 이상 호출됐는지만 확인
//toHaveBeenCalledTimes(1)은 정확히 한 번 호출됐는지 확인
//toHaveBeenCalledWith(...)은 특정 인자와 함께 호출됐는지 확인
