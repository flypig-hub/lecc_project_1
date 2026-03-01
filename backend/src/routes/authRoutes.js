const express = require('express');
const authController = require('../controllers/authController');
const { asyncHandler } = require('../utils/asyncHandler');
const { requireFields } = require('../middlewares/validateMiddleware');

const router = express.Router();

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *     responses:
 *       201:
 *         description: created
 */
router.post('/register', requireFields(['email', 'password']), asyncHandler(authController.register));

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *     responses:
 *       200:
 *         description: ok
 */
router.post('/login', requireFields(['email', 'password']), asyncHandler(authController.login));

module.exports = router;
