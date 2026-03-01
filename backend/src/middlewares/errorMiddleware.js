function notFoundMiddleware(req, res) {
  res.status(404).json({ message: `Not Found: ${req.method} ${req.originalUrl}` });
}

function errorMiddleware(err, _req, res, _next) {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({ message });
}

module.exports = { notFoundMiddleware, errorMiddleware };
