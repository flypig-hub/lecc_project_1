const { HttpError } = require('../utils/httpError');

function requireFields(fields) {
  return (req, _res, next) => {
    for (const field of fields) {
      if (!req.body[field] || String(req.body[field]).trim() === '') {
        throw new HttpError(400, `${field} 필드는 필수입니다.`);
      }
    }
    next();
  };
}

module.exports = { requireFields };
