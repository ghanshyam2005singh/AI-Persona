import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import {
  getChats,
  getChatById,
  createChat,
  toggleAIMode,
} from '../controllers/chatController.js';
import {
  getChatMessages,
  sendMessage,
} from '../controllers/messageController.js';

const router = Router();

router.use(authMiddleware);

router.get('/', getChats);
router.post('/', createChat);
router.get('/:chatId', getChatById);
router.patch('/:chatId/ai-mode', toggleAIMode);
router.get('/:chatId/messages', getChatMessages);
router.post('/:chatId/messages', sendMessage);

export default router;