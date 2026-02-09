import { Router } from 'express';
import { getLeaderboard, getMyRank } from '../controllers/leaderboard.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

// Get top users (public)
router.get('/', getLeaderboard);

// Get my personal rank (protected)
router.get('/my-rank', authenticate, getMyRank);

export default router;
