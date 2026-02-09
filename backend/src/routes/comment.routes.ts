import { Router } from 'express';
import { createComment, getCommentsByProblem, deleteComment } from '../controllers/comment.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

// Get comments for a problem (public)
router.get('/:problemId', getCommentsByProblem);

// Post a comment (protected)
router.post('/create', authenticate, createComment);

// Delete a comment (protected)
router.delete('/:id', authenticate, deleteComment);

export default router;
