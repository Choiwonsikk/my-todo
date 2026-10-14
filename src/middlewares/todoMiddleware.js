const validateTodoId = (req, res, next) => {
  const id = Number(req.params.id);
  if (Number.isInteger(id) === false || id <= 0) {
    return res.status(400).json({
      message: "id는 1이상인 정수이어야 합니다",
    });
  } else {
    req.todoId = id;
    return next();
  }
};

const validateCreateTodo = (req, res, next) => {
  const { title, text } = req.body;

  if (title === undefined || typeof title !== "string" || title.trim() === "") {
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
  return next();
};

const validateUpdateTodo = (req, res, next) => {
  const { title, text, completed } = req.body;

  if (title !== undefined) {
    if (typeof title !== "string" || title.trim() === "") {
      return res.status(400).json({
        message: "title은 비어 있지 않은 문자열이어야 합니다.",
      });
    }
  }
  if (text !== undefined) {
    if (typeof text !== "string") {
      return res.status(400).json({
        message: "text는 문자열 형식이어야 합니다.",
      });
    }
  }
  if (completed !== undefined) {
    if (typeof completed !== "boolean") {
      return res.status(400).json({
        message: "completed는 boolean 형식이어야 합니다.",
      });
    }
  }
  if (title === undefined && text === undefined && completed === undefined) {
    return res.status(400).json({
      message: "입력값이 없습니다",
    });
  }
  return next();
};

const validatePagination = (req, res, next) => {
  const { limit = 10, offset = 0 } = req.query;

  const numberLimit = Number(limit);
  const numberOffset = Number(offset);

  if (
    Number.isInteger(numberLimit) === false ||
    numberLimit <= 0 ||
    Number.isInteger(numberOffset) === false ||
    numberOffset < 0
  )
    return res.status(400).json({
      message: "limit과 offset은 조건에 맞는 정수여야 합니다.",
    });

  req.pagination = {
    limit: numberLimit,
    offset: numberOffset,
  };

  return next();
  // 여기서 numberLimit, numberOffset 검증

  // 통과하면 req.pagination에 저장
  // next() 호출

  //     limit이 없으면 기본값 10
  // offset이 없으면 기본값 0
  // limit은 1 이상 정수
  // offset은 0 이상 정수
  // 유효하지 않으면 400
  // 유효하면 숫자로 변환한 값을 req.pagination에 저장하고 next()
};

const validateCompletedFilter = (req, res, next) => {
  if (req.query.completed === undefined) {
    return next();
  }
  if (req.query.completed === "true") {
    req.completedFilter = true;
    return next();
  }
  if (req.query.completed === "false") {
    req.completedFilter = false;
    return next();
  } else
    return res.status(400).json({
      message: "completed는 boolean값이어야 합니다.",
    });
  //  completed가 없으면 필터 없이 next()
  //  "true"면 req.completedFilter = true 저장 후 next()
  //  "false"면 req.completedFilter = false 저장 후 next()
  //  그 외 값이면 400
};

const validateSortOrder = (req, res, next) => {
  if (req.query.sort === undefined || req.query.sort === "asc") {
    req.sortOrder = "asc";
    return next();
  } else if (req.query.sort === "desc") {
    req.sortOrder = "desc";
    return next();
  } else {
    return res.status(400).json({
      message: "asc 또는 desc이어야 합니다. ",
    });
  }
};

const validateKeywordFilter = (req, res, next) => {
  if (req.query.keyword === undefined) {
    return next();
  }
  const keyword = req.query.keyword.trim();
  if (keyword === "") {
    return res.status(400).json({
      message: "단어를 입력해주세요",
    });
  }
  req.keywordFilter = keyword;
  return next();

  //     req.query.keyword가 없으면 필터 없이 next()
  //     있으면 trim()으로 앞뒤 공백 제거
  //     공백만 있는 문자열이면 400
  //     유효하면 req.keywordFilter에 정리된 문자열을 저장하고 next()
};

module.exports = {
  validateTodoId,
  validateCreateTodo,
  validateUpdateTodo,
  validatePagination,
  validateCompletedFilter,
  validateSortOrder,
  validateKeywordFilter,
};
