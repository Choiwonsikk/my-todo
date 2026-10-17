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
- id 기준 오름차순, 내림차순 정렬
- limit·offset 기반 페이지네이션
- Todo 완료 현황 요약 조회
- 잘못된 요청과 존재하지 않는 경로 처리

## 기술 스택

| JavaScript | Node.js | Express | MySQL | Jest | Supertest |
| :--: | :--: | :--: | :--: | :--: | :--: |
| Backend Language | Runtime | Web Framework | Database | Test Framework | API Test |

## 프로젝트 구조

```text
schema.sql

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
| Controller | 요청 데이터 전달과 응답 처리 |
| Service | 완료율, 이전·다음 페이지 여부 등 계산 |
| DAO | MySQL 쿼리 실행 |
| DB | Todo 데이터 저장 |
| Middleware | 요청값 검증, 오류 처리 |

## 실행 방법

### 1. 패키지 설치

```bash
npm install
```

### 2. 데이터베이스와 테이블 생성

MySQL 8.0 이상을 기준으로 합니다.

프로젝트 최상위 폴더에서 MySQL에 접속합니다.

```bash
mysql -u root -p
```

개발용 데이터베이스와 테스트용 데이터베이스를 각각 생성합니다.  
아래 이름은 예시이며, 환경 변수의 `DB_NAME`과 일치하도록 설정합니다.

```sql
CREATE DATABASE my_todo CHARACTER SET utf8mb4;
CREATE DATABASE my_todo_test CHARACTER SET utf8mb4;
```

각 데이터베이스를 선택한 뒤 `schema.sql`을 실행해 `todos` 테이블을 생성합니다.

```sql
USE my_todo;
SOURCE schema.sql;

USE my_todo_test;
SOURCE schema.sql;
```

- `schema.sql`은 프로젝트 최상위 폴더에 있으며, 테이블 구조만 생성합니다.
- 이미 `todos` 테이블이 있는 데이터베이스에는 다시 실행하지 않습니다.
- 테스트는 매 테스트 전에 `todos` 데이터를 삭제하므로, 테스트용 데이터베이스를 개발용과 분리해야 합니다.

MySQL에서 나올 때는 다음 명령을 사용합니다.

```sql
exit;
```

### 3. 환경 변수 설정

프로젝트 최상위 폴더에 `.env` 파일을 만듭니다.

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=비밀번호
DB_NAME=my_todo
```

테스트용 데이터베이스는 `.env.test` 파일에 따로 설정합니다.

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=비밀번호
DB_NAME=my_todo_test
```

접속 계정, 비밀번호, DB 이름은 자신의 MySQL 환경에 맞게 변경합니다.  
`.env`와 `.env.test`는 Git에 포함하지 않습니다.

### 4. 서버 실행

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

아래 응답의 id와 데이터는 예시입니다.

### Todo 목록 조회

```http
GET /todos
```

#### Query Parameter

| 이름 | 설명 | 기본값 |
|---|---|---|
| `limit` | 한 번에 조회할 Todo 수. 1 이상 정수 | `10` |
| `offset` | 건너뛸 Todo 수. 0 이상 정수 | `0` |
| `completed` | 완료 여부 (`true`, `false`) | 없음 |
| `sort` | id 기준 정렬 (`asc`, `desc`) | `asc` |
| `keyword` | 제목 키워드 검색 | 없음 |

- `completed`를 생략하면 완료 여부와 관계없이 조회합니다.
- `keyword`는 문자열만 허용하며, 앞뒤 공백을 제거합니다.
- 공백만 있는 검색어는 허용하지 않습니다.
- 완료 여부와 키워드를 함께 전달하면 두 조건을 모두 만족하는 Todo를 조회합니다.

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

- `pagination.total`은 검색·완료 여부 필터에 일치하는 전체 Todo 수입니다.
- `hasPrevious`는 `offset`이 0보다 큰지 나타냅니다.
- `hasNext`는 현재 조회 결과 뒤에 추가 데이터가 있는지 나타냅니다.
- 검색 결과가 없으면 200과 빈 `todos` 배열을 반환합니다.

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
- `completionRate`: 완료 개수 ÷ 전체 개수 × 100을 반올림한 값
- 요약은 검색·필터 조건과 관계없이 전체 Todo를 기준으로 계산합니다.
- Todo가 없으면 모든 필드는 0입니다.

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

- `id`는 1 이상 정수여야 합니다.
- 존재하지 않는 Todo는 404를 반환합니다.

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

응답 예시 — 201:

```json
{
  "id": 1,
  "title": "Todo API 테스트",
  "text": "POST 요청 테스트",
  "completed": 0
}
```

- `title`은 필수이며, 공백만 있는 문자열은 허용하지 않습니다.
- `text`는 선택값이며, 전달한다면 문자열이어야 합니다.
- 생성 시 완료 여부는 미완료인 0으로 저장됩니다.

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

- `title`, `text`, `completed` 중 하나 이상 필요합니다.
- 전달한 필드만 수정합니다.
- `title`은 공백만 있는 문자열을 허용하지 않습니다.
- `text`는 문자열이어야 합니다.
- `completed`는 boolean 값인 `true`, `false`만 허용합니다.
- 응답의 `completed`는 DB 조회 결과에 따라 0 또는 1로 반환됩니다.

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

### 잘못된 요청 — 400

id 형식 오류:

```json
{
  "message": "id는 1이상인 정수이어야 합니다"
}
```

title 검증 실패:

```json
{
  "message": "title은 비어 있지 않은 문자열이어야 합니다."
}
```

검색어 자료형 오류:

```json
{
  "message": "keyword는 문자열이어야 합니다."
}
```

JSON 형식 오류:

```json
{
  "message": "JSON 형식이 올바르지 않습니다."
}
```

### 존재하지 않는 Todo — 404

조회·수정 시 응답 예시:

```json
{
  "message": "값을 찾을 수 없습니다"
}
```

삭제 시 응답 예시:

```json
{
  "message": "Todo를 찾을 수 없습니다."
}
```

### 존재하지 않는 경로 — 404

```json
{
  "message": "요청한 경로를 찾을 수 없습니다."
}
```

### 일반 서버 오류 — 500

```json
{
  "message": "서버 에러가 발생했습니다."
}
```

## 테스트

### 통합 테스트

실제 Express 앱과 테스트용 MySQL 데이터베이스를 연결해 API 전체 흐름을 테스트합니다.

```text
Router → Controller → Service → DAO → Test DB
```

- CRUD 정상 동작
- 요청값 검증
- 존재하지 않는 Todo와 경로 처리
- 완료 여부 필터와 키워드 검색
- 다중 필터 적용
- 정렬과 페이지네이션
- 검색 결과가 없는 경우
- Todo 요약 조회와 빈 데이터의 완료율
- 잘못된 JSON 요청 처리

### 유닛 테스트

미들웨어와 오류 처리기 함수를 독립적으로 테스트합니다.

```text
가짜 req, res, next
→ 미들웨어 또는 오류 처리기 실행
→ 호출 결과 확인
```

- 검증 결과에 따른 상태 코드와 응답 메시지
- 정상 입력의 변환 결과와 `next()` 호출
- 배열 형태의 검색어 거부
- JSON 파싱 오류와 일반 오류 처리
- 존재하지 않는 경로 처리

### 테스트 실행

테스트용 DB와 테이블을 생성하고 `.env.test`를 설정한 뒤 실행합니다.

```bash
npm test
```

커버리지 확인:

```bash
npm test -- --coverage
```

테스트 실행 시 `NODE_ENV=test`가 설정되어 `.env.test`를 사용합니다.
