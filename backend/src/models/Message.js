import mongoose from 'mongoose';

const { Schema } = mongoose;

const MessageSchema = new Schema(
  {
    participants: {
      type: [Schema.Types.ObjectId],
      ref: 'User',
      required: true,
      validate: {
        validator: function (v) {
          return v.length === 2;
        },
        message: 'Chat must have exactly 2 participants',
      },
    },
    lastMessage: {
      type: Schema.Types.ObjectId,
      ref: 'Message',
      default: null,
    },
    aiModeEnabled: {
      type: Boolean,
      default: false,
    },
    unreadCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate chats between same users
MessageSchema.index({ participants: 1 }, { unique: true });

export default mongoose.models.Message || mongoose.model('Message', MessageSchema);