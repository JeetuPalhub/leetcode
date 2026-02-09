import express from 'express';
import { authenticate, checkAdmin } from '../middlewares/auth.middleware.js';
import {
    createContest,
    getContests,
    getContestById,
    registerForContest,
    getContestLeaderboard
} from '../controllers/contest.controller.js';

const router = express.Router();

router.get('/', authenticate, getContests);
router.post('/create', authenticate, checkAdmin, createContest);
router.get('/:id', authenticate, getContestById);
router.post('/:id/register', authenticate, registerForContest);
router.get('/:id/leaderboard', authenticate, getContestLeaderboard);

export default router;
