const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const env = require('./config/env');
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const { swaggerSpec } = require('./docs/swagger');
const { notFoundMiddleware, errorMiddleware } = require('./middlewares/errorMiddleware');

const app = express();

app.use(
  cors({
    origin: env.corsOrigin,
    credentials: false,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  })
);
app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

module.exports = { app };
