const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');
const env = require('../config/env');
const { HttpError } = require('../utils/httpError');

async function register(email, password) {
  const exists = await userRepository.findByEmail(email);
  if (exists) throw new HttpError(409, '이미 등록된 이메일입니다.');

  const hash = await bcrypt.hash(password, 10);
  const user = await userRepository.createUser(email, hash);
  return user;
}

async function login(email, password) {
  const user = await userRepository.findByEmail(email);
  if (!user) throw new HttpError(401, '이메일 또는 비밀번호가 올바르지 않습니다.');

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) throw new HttpError(401, '이메일 또는 비밀번호가 올바르지 않습니다.');

  const token = jwt.sign({ email: user.email }, env.jwtSecret, {
    subject: String(user.id),
    expiresIn: env.jwtExpiresIn
  });

  return { token, user: { id: user.id, email: user.email } };
}

module.exports = { register, login };
