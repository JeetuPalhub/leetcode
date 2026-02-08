import express from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import {
    likeProblem,
    unlikeProblem,
    bookmarkProblem,
    removeBookmark,
    getUserBookmarks,
    getUserLikes,
    getProblemInteractionStatus,
} from '../controllers/interaction.controller.js';

const interactionRoutes = express.Router();

// Like/Unlike
interactionRoutes.post('/like/:problemId', authenticate, likeProblem);
interactionRoutes.delete('/like/:problemId', authenticate, unlikeProblem);

// Bookmark/Unbookmark
interactionRoutes.post('/bookmark/:problemId', authenticate, bookmarkProblem);
interactionRoutes.delete('/bookmark/:problemId', authenticate, removeBookmark);

// Get user's likes and bookmarks
interactionRoutes.get('/likes', authenticate, getUserLikes);
interactionRoutes.get('/bookmarks', authenticate, getUserBookmarks);

// Get interaction status for a specific problem
interactionRoutes.get('/status/:problemId', authenticate, getProblemInteractionStatus);

export default interactionRoutes;
