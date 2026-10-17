# Todo API

Node.js, Express, MySQL를 사용해 만든 Todo REST API입니다.  
기존 CRUD 코드를 구조별로 분리하고, 요청 검증과 테스트 코드를 직접 작성하며 백엔드 동작을 학습하는 목적으로 만들었습니다.

## 프로젝트 정보

### 프로젝트 목적

- Express와 MySQL을 이용한 CRUD API 구현
- `Router → Controller → Service → DAO → DB` 구조 분리
- 미들웨어를 이용한 요청 데이터 검증
- 전역 오류 처리 적용
- Jest와 Supertest를 이용한 통합 테스트, 유닛 테스트 작성

### 주요 기능

- Todo 생성, 조회, 수정, 삭제
- Todo 완료 여부 필터
- 제목 키워드 검색
- 오름차순, 내림차순 정렬
- 페이지네이션
- Todo 완료 현황 요약 조회
- 잘못된 요청과 존재하지 않는 경로 처리

## 기술 스택

| JavaScript | Node.js | Express | MySQL | Jest | Supertest |
| :--: | :--: | :--: | :--: | :--: | :--: |
| Backend Language | Runtime | Web Framework | Database | Test Framework | API Test |

## 프로젝트 구조

```text
src
├── app.js
├── controllers
│   └── todoController.js
├── db
│   └── database.js
├── middlewares
│   ├── errorHandler.js
│   └── todoMiddleware.js
├── models
│   └── todoDao.js
├── routes
│   └── todoRouter.js
└── services
    └── todoService.js

tests
├── todo.test.js
├── todoMiddleware.test.js
└── errorHandler.test.js
```

### 구조 역할

| 계층 | 역할 |
|---|---|
| Router | URL과 HTTP 메서드를 Controller에 연결 |
| Controller | 요청 데이터와 응답 처리 |
| Service | Todo 관련 비즈니스 로직 처리 |
| DAO | MySQL 쿼리 실행 |
| DB | Todo 데이터 저장 |
| Middleware | 요청값 검증, 오류 처리 |

## 실행 방법

### 1. 패키지 설치

```bash
npm install
```

### 2. 환경 변수 설정

프로젝트 최상단에 `.env` 파일을 만든다.

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=비밀번호
DB_NAME=데이터베이스이름
```

테스트용 데이터베이스는 `.env.test` 파일에 따로 설정한다.

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=비밀번호
DB_NAME=테스트데이터베이스이름
```

### 3. 서버 실행

```bash
npm start
```

개발 중 자동 재시작:

```bash
npm run dev
```

서버 주소:

```text
http://localhost:3000
```

## API 목록

| 메서드 | 엔드포인트 | 설명 |
|---|---|---|
| GET | `/todos` | Todo 목록 조회 |
| GET | `/todos/summary` | Todo 요약 조회 |
| GET | `/todos/:id` | Todo 단건 조회 |
| POST | `/todos` | Todo 생성 |
| PATCH | `/todos/:id` | Todo 수정 |
| DELETE | `/todos/:id` | Todo 삭제 |

## API 상세

### Todo 목록 조회

```http
GET /todos
```

#### Query Parameter

| 이름 | 설명 | 기본값 |
|---|---|---|
| `limit` | 한 번에 조회할 Todo 수 | `10` |
| `offset` | 건너뛸 Todo 수 | `0` |
| `completed` | 완료 여부 (`true`, `false`) | 없음 |
| `sort` | 정렬 방식 (`asc`, `desc`) | `asc` |
| `keyword` | 제목 키워드 검색 | 없음 |

요청 예시:

```http
GET /todos?limit=10&offset=0&completed=false&sort=desc&keyword=공부
```

응답 예시:

```json
{
  "todos": [
    {
      "id": 2,
      "title": "Node.js 공부",
      "text": "Express 학습",
      "completed": 0
    }
  ],
  "pagination": {
    "total": 1,
    "limit": 10,
    "offset": 0,
    "hasPrevious": false,
    "hasNext": false,
    "sort": "desc"
  }
}
```

### Todo 요약 조회

```http
GET /todos/summary
```

응답 예시:

```json
{
  "total": 3,
  "completed": 1,
  "incomplete": 2,
  "completionRate": 33
}
```

- `total`: 전체 Todo 수
- `completed`: 완료된 Todo 수
- `incomplete`: 미완료 Todo 수
- `completionRate`: 완료율을 반올림한 숫자

### Todo 단건 조회

```http
GET /todos/:id
```

응답 예시:

```json
{
  "id": 1,
  "title": "Node.js 공부",
  "text": "Express와 MySQL 연결하기",
  "completed": 0
}
```

### Todo 생성

```http
POST /todos
Content-Type: application/json
```

요청 예시:

```json
{
  "title": "Todo API 테스트",
  "text": "POST 요청 테스트"
}
```

응답 예시:

```json
{
  "id": 1,
  "title": "Todo API 테스트",
  "text": "POST 요청 테스트",
  "completed": 0
}
```

- `title`은 필수값
- `title`은 공백만 있는 문자열 불가
- `text`는 선택값
- `text`를 보낸다면 문자열이어야 함

### Todo 수정

```http
PATCH /todos/:id
Content-Type: application/json
```

요청 예시:

```json
{
  "title": "수정한 제목",
  "text": "수정한 내용",
  "completed": true
}
```

응답 예시:

```json
{
  "id": 1,
  "title": "수정한 제목",
  "text": "수정한 내용",
  "completed": 1
}
```

- `title`, `text`, `completed` 중 하나 이상 필요
- `completed`는 `true`, `false` boolean 값만 허용

### Todo 삭제

```http
DELETE /todos/:id
```

응답 예시:

```json
{
  "id": 1,
  "message": "Todo 삭제 성공"
}
```

## 오류 처리

### 잘못된 요청

```json
{
  "message": "id는 1이상인 정수이어야 합니다"
}
```

```json
{
  "message": "title은 비어 있지 않은 문자열이어야 합니다."
}
```

```json
{
  "message": "JSON 형식이 올바르지 않습니다."
}
```

### 존재하지 않는 Todo

```json
{
  "message": "값을 찾을 수 없습니다"
}
```

### 존재하지 않는 경로

```json
{
  "message": "요청한 경로를 찾을 수 없습니다."
}
```

## 테스트

### 통합 테스트

실제 Express 앱과 테스트용 MySQL 데이터베이스를 연결해 API 전체 흐름을 테스트했다.

```text
Router → Controller → Service → DAO → Test DB
```

- CRUD 정상 동작
- 요청값 검증
- 존재하지 않는 Todo와 경로 처리
- 완료 여부 필터
- 키워드 검색
- 정렬과 페이지네이션
- Todo 요약 조회

### 유닛 테스트

미들웨어와 오류 처리기 함수를 독립적으로 테스트했다.

```text
가짜 req, res, next
→ 미들웨어 또는 오류 처리기 실행
→ 호출 결과 확인
```

### 테스트 실행

```bash
npm test
```

커버리지 확인:

```bash
npm test -- --coverage
```
