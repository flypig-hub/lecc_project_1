const { HttpError } = require('./httpError');

function toPositiveInt(value, fieldName) {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new HttpError(400, `${fieldName}는 1 이상의 정수여야 합니다.`);
  }
  return parsed;
}

module.exports = { toPositiveInt };
