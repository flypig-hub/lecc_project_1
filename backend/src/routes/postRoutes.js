const express = require('express');
const postController = require('../controllers/postController');
const commentController = require('../controllers/commentController');
const { asyncHandler } = require('../utils/asyncHandler');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { requireFields } = require('../middlewares/validateMiddleware');

const router = express.Router();

/**
 * @openapi
 * /api/posts:
 *   get:
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: ok
 *   post:
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: created
 */
router.get('/', asyncHandler(postController.listPosts));
router.post('/', authMiddleware, requireFields(['title', 'content']), asyncHandler(postController.createPost));

/**
 * @openapi
 * /api/posts/{id}:
 *   get:
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: ok
 *   put:
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *   delete:
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 */
router.get('/:id', asyncHandler(postController.getPost));
router.put('/:id', authMiddleware, requireFields(['title', 'content']), asyncHandler(postController.updatePost));
router.delete('/:id', authMiddleware, asyncHandler(postController.deletePost));

/**
 * @openapi
 * /api/posts/{postId}/comments:
 *   get:
 *     tags: [Comments]
 *   post:
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 */
router.get('/:postId/comments', asyncHandler(commentController.listComments));
router.post('/:postId/comments', authMiddleware, requireFields(['content']), asyncHandler(commentController.createComment));

/**
 * @openapi
 * /api/posts/comments/{commentId}:
 *   put:
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *   delete:
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 */
router.put('/comments/:commentId', authMiddleware, requireFields(['content']), asyncHandler(commentController.updateComment));
router.delete('/comments/:commentId', authMiddleware, asyncHandler(commentController.deleteComment));

module.exports = router;
