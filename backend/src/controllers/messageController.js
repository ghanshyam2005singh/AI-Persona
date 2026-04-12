import Message from '../models/Message.js';
import Chat from '../models/Chat.js';

export const getChatMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const messages = await Message.find({ chatId })
      .populate('senderId', 'name email')
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { content, aiMode } = req.body;

    if (!content) {
      res.status(400).json({ message: 'Message content required' });
      return;
    }

    // Create message
    const message = await Message.create({
      chatId,
      senderId: req.userId,
      content,
      isAI: false,
    });

    // Update chat's last message
    await Chat.findByIdAndUpdate(chatId, {
      lastMessage: message._id,
    });

    const populatedMessage = await message.populate('senderId', 'name email');

    // If AI mode is enabled, generate AI response (simulate here)
    if (aiMode) {
      const chat = await Chat.findById(chatId);
      const aiUserId = chat.participants.find(
        (p) => p.toString() !== req.userId
      );
      const aiResponse = await Message.create({
        chatId,
        senderId: aiUserId,
        content: `AI: I understand you said "${content}". This is an AI-generated response.`,
        isAI: true,
      });

      await Chat.findByIdAndUpdate(chatId, {
        lastMessage: aiResponse._id,
      });
    }

    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};