const request = require("supertest");
const app = require("../src/app");
const db = require("../src/db/database.js");

describe("Todo API", () => {
  beforeEach(async () => {
    await db.query("DELETE FROM todos");
  });

  test("존재하지 않는 주소는 404를 반환한다", async () => {
    const response = await request(app).get("/없는주소");

    expect(response.status).toBe(404);
  });
  test("10개 목록 반환", async () => {
    const response = await request(app).get("/todos?limit=10&offset=0");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.todos)).toBe(true);
    expect(response.body.pagination.total).toBe(0);
  });

  test("유효한 id를 조회하면 200과 todo를 반환한다", async () => {
    const createdResponse = await request(app).post("/todos").send({
      title: "기존 제목",
      text: "기존 내용",
    });
    const id = createdResponse.body.id;
    const response = await request(app).get(`/todos/${id}`);
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(id);
    expect(response.body.title).toBe("기존 제목");
    expect(response.body.text).toBe("기존 내용");
    expect(response.body.completed).toBe(0);
  });

  test("존재하지 않는 Todo를 조회하면 404", async () => {
    const response = await request(app).get(`/todos/999999`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message");
  });

  test("잘못된 id형식의 Todo를 조회하면 400", async () => {
    const response = await request(app).get(`/todos/abc`);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
  });

  test("정상 요약테스트하면 200", async () => {
    const response = await request(app).get(`/todos/summary`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      total: 0,
      completed: 0,
      incomplete: 0,
      completionRate: 0,
    });
  });

  test("유효한 Todo를 생성하면 201을 반환한다.", async () => {
    const todo = {
      title: "테스트 todo",
      text: "테스트 내용",
    };

    const response = await request(app).post("/todos").send(todo);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject(todo);
    expect(response.body).toHaveProperty("id");
    expect(response.body.completed).toBe(0);
  });

  test("존재하지 않는 title은 400 반환", async () => {
    const todo = {
      text: "title 없는 내용",
    };

    const response = await request(app).post("/todos").send(todo);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
  });

  test("빈 title로 Todo를 생성하면 400을 반환한다", async () => {
    const todo = {
      title: "",
      text: "title 없는 내용",
    };

    const response = await request(app).post("/todos").send(todo);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
  });

  test("숫자 타입 text는 400을 반환한다", async () => {
    const todo = {
      title: "text가 숫자",
      text: 1234,
    };

    const response = await request(app).post("/todos").send(todo);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
  });

  test("title만 전송해도 201을 반환한다.", async () => {
    const todo = {
      title: "테스트 todo",
    };

    const response = await request(app).post("/todos").send(todo);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject(todo);
    expect(response.body).toHaveProperty("id");
    expect(response.body.completed).toBe(0);
  });

  test("공백만 있는 title로 Todo를 생성하면 400을 반환한다", async () => {
    const todo = {
      title: "        ",
    };

    const response = await request(app).post("/todos").send(todo);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
  });

  test("숫자 타입 title로 Todo를 생성하면 400을 반환한다", async () => {
    const todo = {
      title: 1234,
    };

    const response = await request(app).post("/todos").send(todo);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
  });

  test("타이틀만 수정해도 정상작동", async () => {
    const createdResponse = await request(app).post("/todos").send({
      title: "수정 전 제목",
      text: "기존 내용",
    });

    const id = createdResponse.body.id;
    const response = await request(app)
      .patch(`/todos/${id}`)
      .send({ title: "수정 후 제목" });

    expect(response.status).toBe(200);
    expect(response.body.title).toBe("수정 후 제목");
    expect(response.body.text).toBe("기존 내용");
    expect(response.body.completed).toBe(0);
  });

  test("텍스트만 수정해도 정상작동", async () => {
    const createdResponse = await request(app).post("/todos").send({
      title: "기존 제목",
      text: "수정 전 내용",
    });

    const id = createdResponse.body.id;
    const response = await request(app)
      .patch(`/todos/${id}`)
      .send({ text: "수정 후 내용" });

    expect(response.status).toBe(200);
    expect(response.body.title).toBe("기존 제목");
    expect(response.body.text).toBe("수정 후 내용");
    expect(response.body.completed).toBe(0);
  });

  test("completed만 수정해도 정상작동", async () => {
    const createdResponse = await request(app).post("/todos").send({
      title: "기존 제목",
      text: "기존 내용",
    });

    const id = createdResponse.body.id;
    const response = await request(app)
      .patch(`/todos/${id}`)
      .send({ completed: true });

    expect(response.status).toBe(200);
    expect(response.body.title).toBe("기존 제목");
    expect(response.body.text).toBe("기존 내용");
    expect(response.body.completed).toBe(1);
  });

  test("수정할 값이 없을 때 400", async () => {
    const createdResponse = await request(app).post("/todos").send({
      title: "기존 제목",
      text: "기존 내용",
    });

    const id = createdResponse.body.id;
    const response = await request(app).patch(`/todos/${id}`).send({});

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
  });

  test("수정할 completed값 형태가 boolean형이 아닐 때 400", async () => {
    const createdResponse = await request(app).post("/todos").send({
      title: "기존 제목",
      text: "기존 내용",
    });

    const id = createdResponse.body.id;
    const response = await request(app)
      .patch(`/todos/${id}`)
      .send({ completed: "true" });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
  });

  test("존재하지 않는 수정대상일 때 404", async () => {
    const response = await request(app)
      .patch("/todos/999999")
      .send({ title: "수정 시도" });

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message");
  });

  test("잘못된 아이디 형식일 때 400", async () => {
    const response = await request(app)
      .patch("/todos/abc")
      .send({ title: "수정 시도" });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
  });

  test("빈 title로 수정하면 400", async () => {
    const createdResponse = await request(app).post("/todos").send({
      title: "기존 제목",
      text: "기존 내용",
    });

    const id = createdResponse.body.id;
    const response = await request(app).patch(`/todos/${id}`).send({
      title: "",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
  });

  test("숫자 타입 text로 수정하면 400", async () => {
    const createdResponse = await request(app).post("/todos").send({
      title: "기존 제목",
      text: "기존 내용",
    });

    const id = createdResponse.body.id;
    const response = await request(app).patch(`/todos/${id}`).send({
      text: 1234,
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
  });

  test("여러 값을 동시 수정하면 200", async () => {
    const createdResponse = await request(app).post("/todos").send({
      title: "기존 제목",
      text: "기존 내용",
    });

    const id = createdResponse.body.id;
    const response = await request(app).patch(`/todos/${id}`).send({
      title: "수정된 제목",
      text: "수정된 내용",
      completed: true,
    });

    expect(response.status).toBe(200);
    expect(response.body.title).toBe("수정된 제목");
    expect(response.body.text).toBe("수정된 내용");
    expect(response.body.completed).toBe(1);
  });

  test("DELETE 정상작동하면 200", async () => {
    const createdResponse = await request(app).post("/todos").send({
      title: "기존 제목",
      text: "기존 내용",
    });
    const id = createdResponse.body.id;
    const response = await request(app).delete(`/todos/${id}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(id);
    expect(response.body).toHaveProperty("message");

    const check = await request(app).get(`/todos/${id}`);

    expect(check.status).toBe(404);
  });

  test("존재하지 않는 Todo를 DELETE 하면 404", async () => {
    const response = await request(app).delete(`/todos/999999`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message");
  });

  test("잘못된 id형식일 때 400", async () => {
    const response = await request(app).delete(`/todos/abc`);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
  });

  test("요약 테스트 결과 검사", async () => {
    const firstCreatedResponse = await request(app).post("/todos").send({
      title: "test",
    });

    await request(app).post("/todos").send({
      title: "test",
    });

    await request(app).post("/todos").send({
      title: "test",
    });

    await request(app)
      .patch(`/todos/${firstCreatedResponse.body.id}`)
      .send({ completed: true });

    const response = await request(app).get(`/todos/summary`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      total: 3,
      completed: 1,
      incomplete: 2,
      completionRate: 33,
    });
  });

  test("조회 완료 필터 테스트", async () => {
    const createdResponse = await request(app)
      .post("/todos")
      .send({ title: "완료 todo" });
    await request(app).post("/todos").send({ title: "미완료 todo" });
    await request(app)
      .patch(`/todos/${createdResponse.body.id}`)
      .send({ completed: true });

    const response = await request(app).get("/todos?completed=true");

    expect(response.status).toBe(200);
    expect(response.body.todos).toHaveLength(1);
    expect(response.body.todos[0].id).toBe(createdResponse.body.id);
    expect(response.body.todos[0].completed).toBe(1);
  });

  test("조회 미완료 필터 테스트", async () => {
    const completedTodo = await request(app)
      .post("/todos")
      .send({ title: "완료 todo" });
    const incompleteTodo = await request(app)
      .post("/todos")
      .send({ title: "미완료 todo" });
    await request(app)
      .patch(`/todos/${completedTodo.body.id}`)
      .send({ completed: true });

    const response = await request(app).get("/todos?completed=false");

    expect(response.status).toBe(200);
    expect(response.body.todos).toHaveLength(1);
    expect(response.body.todos[0].id).toBe(incompleteTodo.body.id);
    expect(response.body.todos[0].completed).toBe(0);
  });

  test("내림차순 정렬 테스트", async () => {
    const firstTodo = await request(app)
      .post("/todos")
      .send({ title: "첫번재 todo" });
    const secondTodo = await request(app)
      .post("/todos")
      .send({ title: "두번째 todo" });

    const response = await request(app).get("/todos?sort=desc");

    expect(response.status).toBe(200);
    expect(response.body.todos).toHaveLength(2);
    expect(response.body.todos[0].id).toBe(secondTodo.body.id);
    expect(response.body.todos[1].id).toBe(firstTodo.body.id);
  });

  test("오름차순 정렬 테스트", async () => {
    const firstTodo = await request(app)
      .post("/todos")
      .send({ title: "첫번재 todo" });
    const secondTodo = await request(app)
      .post("/todos")
      .send({ title: "두번째 todo" });

    const response = await request(app).get("/todos?sort=asc");

    expect(response.status).toBe(200);
    expect(response.body.todos).toHaveLength(2);
    expect(response.body.todos[0].id).toBe(firstTodo.body.id);
    expect(response.body.todos[1].id).toBe(secondTodo.body.id);
  });

  test("키워드 검색 테스트", async () => {
    const studyTodo = await request(app)
      .post("/todos")
      .send({ title: "공부하는 todo" });
    await request(app).post("/todos").send({ title: "운동하는 todo" });

    const response = await request(app).get("/todos?keyword=공부");

    expect(response.status).toBe(200);
    expect(response.body.todos).toHaveLength(1);
    expect(response.body.todos[0].id).toBe(studyTodo.body.id);
    expect(response.body.todos[0].title).toBe("공부하는 todo");
  });

  test("다중 필터 동시 테스트", async () => {
    const studyTodo = await request(app)
      .post("/todos")
      .send({ title: "공부하기" });
    const exerciseTodo = await request(app)
      .post("/todos")
      .send({ title: "운동하기" });
    await request(app).post("/todos").send({ title: "공부 계획" });

    await request(app)
      .patch(`/todos/${studyTodo.body.id}`)
      .send({ completed: true });
    await request(app)
      .patch(`/todos/${exerciseTodo.body.id}`)
      .send({ completed: true });

    const response = await request(app).get(
      "/todos?completed=true&keyword=공부",
    );

    expect(response.status).toBe(200);
    expect(response.body.todos).toHaveLength(1);
    expect(response.body.todos[0].id).toBe(studyTodo.body.id);
    expect(response.body.todos[0].completed).toBe(1);
  });

  test("검색 결과가 없을 때 200", async () => {
    await request(app).post("/todos").send({ title: "공부하기" });

    const response = await request(app).get(
      "/todos?completed=true&keyword=여행",
    );

    expect(response.status).toBe(200);
    expect(response.body.todos).toEqual([]);
    expect(response.body.pagination.total).toBe(0);
  });

  test("페이지네이션 테스트", async () => {
    const firstTodo = await request(app)
      .post("/todos")
      .send({ title: "첫번째 todo" });
    await request(app).post("/todos").send({ title: "두번째 todo" });

    const response = await request(app).get("/todos?limit=1&offset=0");

    expect(response.status).toBe(200);
    expect(response.body.todos).toHaveLength(1);
    expect(response.body.pagination.total).toBe(2);
    expect(response.body.pagination.hasPrevious).toBe(false);
    expect(response.body.pagination.hasNext).toBe(true);
    expect(response.body.todos[0]).toEqual(firstTodo.body);
    //객체 전체 내용을 비교하고 싶을 때는 toEqual() 또는 toMatchObject() 사용
    // toBe: 기본값 또는 같은 객체값인지
    // toEqual: 객체·배열 내부 값까지 같은지
    // toMatchObject: 기대한 속성들만 포함되는지
  });

  test("페이지네이션 두 번째 테스트", async () => {
    await request(app).post("/todos").send({ title: "첫번째 todo" });
    const secondTodo = await request(app)
      .post("/todos")
      .send({ title: "두번째 todo" });

    const response = await request(app).get("/todos?limit=1&offset=1");

    expect(response.status).toBe(200);
    expect(response.body.todos).toHaveLength(1);
    expect(response.body.pagination.total).toBe(2);
    expect(response.body.pagination.hasPrevious).toBe(true);
    expect(response.body.pagination.hasNext).toBe(false);
    expect(response.body.todos[0]).toEqual(secondTodo.body);
  });

  test("목록 조회 잘못된 limit 테스트", async () => {
    const response = await request(app).get("/todos?limit=0&offset=0");

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
  });

  test("목록 조회 잘못된 offset 테스트", async () => {
    const response = await request(app).get("/todos?limit=10&offset=-1");

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
  });

  test("목록 조회 잘못된 completed 필터값 테스트", async () => {
    const response = await request(app).get("/todos?completed=yes");

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
  });

  test("목록 조회 잘못된 정렬값 테스트", async () => {
    const response = await request(app).get("/todos?sort=random");

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
  });

  test("공백 키워드 검색 결과는 400", async () => {
    const response = await request(app).get("/todos?keyword=%20%20%20");

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
  });

  test("limit값이 숫자가 아닌 결과는 400", async () => {
    const response = await request(app).get("/todos?limit=abc&offset=0");

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
  });

  test("offset값이 숫자가 아닌 결과는 400", async () => {
    const response = await request(app).get("/todos?limit=10&offset=abc");

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
  });

  test("존재하는 todo보다 더 큰 offset값일 때 200", async () => {
    await request(app).post("/todos").send({ title: "offset 테스트" });

    const response = await request(app).get("/todos?limit=10&offset=10");

    expect(response.status).toBe(200);
    expect(response.body.todos).toEqual([]);
    expect(response.body.pagination.total).toBe(1);
    expect(response.body.pagination.hasPrevious).toBe(true);
    expect(response.body.pagination.hasNext).toBe(false);
  });

  test("JSON본문 테스트", async () => {
    const response = await request(app)
      .post("/todos")
      .set("Content-Type", "application/json")
      .send('{"title":"테스트"');
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "JSON 형식이 올바르지 않습니다.",
    });
  });

  afterAll(async () => {
    await db.end();
  });
});

// - request(app): Supertest가 Express 앱에 요청할 준비
// - .get("/없는주소"): GET 요청 전송
// - await: 응답이 올 때까지 기다림
// - expect(...).toBe(...): 결과가 예상한 값인지 검사
// - describe: 관련 테스트를 하나의 그룹으로 묶음
// - test: 실제 검증 하나
