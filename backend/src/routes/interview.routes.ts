import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import {
    startInterview,
    getInterviewSession,
    submitInterview,
    generateInterviewHint,
} from '../controllers/interview.controller.js';

const router = Router();

router.post('/start', authenticate, startInterview);
router.get('/session/:id', authenticate, getInterviewSession);
router.post('/submit/:id', authenticate, submitInterview);
router.post('/hint/:id', authenticate, generateInterviewHint);

export default router;
