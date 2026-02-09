import { Router } from 'express';
import { rateDifficulty, getProblemDifficultyStats } from '../controllers/rating.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

// Get difficulty stats for a problem
router.get('/:problemId', getProblemDifficultyStats);

// Rate difficulty for a problem (protected)
router.post('/rate', authenticate, rateDifficulty);

export default router;
