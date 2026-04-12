import Chat from '../models/Chat.js';
import Message from '../models/Message.js';
import User from '../models/User.js';

export const getChats = async (req, res) => {
  try {
    const chats = await Chat.find({ participants: req.userId })
      .populate('participants', 'name email')
      .populate('lastMessage')
      .sort({ updatedAt: -1 });

    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getChatById = async (req, res) => {
  try {
    const { chatId } = req.params;

    const chat = await Chat.findById(chatId)
      .populate('participants', 'name email')
      .populate('lastMessage');

    if (!chat) {
      res.status(404).json({ message: 'Chat not found' });
      return;
    }

    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createChat = async (req, res) => {
  try {
    const { participantId } = req.body;

    if (!participantId) {
      res.status(400).json({ message: 'Participant ID required' });
      return;
    }

    // Check if participant exists
    const participant = await User.findById(participantId);
    if (!participant) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Check if chat already exists
    let chat = await Chat.findOne({
      participants: { $all: [req.userId, participantId] },
    })
      .populate('participants', 'name email')
      .populate('lastMessage');

    if (chat) {
      res.status(200).json(chat);
      return;
    }

    // Create new chat
    chat = await Chat.create({
      participants: [req.userId, participantId],
      aiModeEnabled: false,
      unreadCount: 0,
    });

    await chat.populate('participants', 'name email');

    res.status(201).json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleAIMode = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { enabled } = req.body;

    const chat = await Chat.findByIdAndUpdate(
      chatId,
      { aiModeEnabled: enabled },
      { new: true }
    )
      .populate('participants', 'name email')
      .populate('lastMessage');

    if (!chat) {
      res.status(404).json({ message: 'Chat not found' });
      return;
    }

    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};