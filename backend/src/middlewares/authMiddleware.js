const jwt = require('jsonwebtoken');
const env = require('../config/env');
const { HttpError } = require('../utils/httpError');

function authMiddleware(req, _res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new HttpError(401, '인증 토큰이 필요합니다.');
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    req.user = { id: decoded.sub, email: decoded.email };
    next();
  } catch (_e) {
    next(new HttpError(401, '유효하지 않은 토큰입니다.'));
  }
}

module.exports = { authMiddleware };
