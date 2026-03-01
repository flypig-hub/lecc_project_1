const authService = require('../services/authService');

async function register(req, res) {
  const { email, password } = req.body;
  const user = await authService.register(email, password);
  res.status(201).json({ user });
}

async function login(req, res) {
  const { email, password } = req.body;
  const data = await authService.login(email, password);
  res.status(200).json(data);
}

module.exports = { register, login };
