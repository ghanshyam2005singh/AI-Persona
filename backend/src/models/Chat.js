import mongoose from 'mongoose';

const { Schema } = mongoose;

const ChatSchema = new Schema(
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

ChatSchema.index({ participants: 1 }, { unique: true });

export default mongoose.models.Chat || mongoose.model('Chat', ChatSchema);