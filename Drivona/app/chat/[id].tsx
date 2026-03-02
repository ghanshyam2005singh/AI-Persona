import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/components/context/AuthContext';
import { apiService } from '../../services/api';
import { Chat, Message } from '@/types/type';
import { COLORS, SIZES } from '@/constants/theme';
import { formatMessageTime } from '../../utils/formatters';

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const router = useRouter();

  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [inputText, setInputText] = useState('');
  const [aiMode, setAiMode] = useState(false);

  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (id) {
      loadChatData();
    }
  }, [id]);

  const loadChatData = async () => {
    try {
      const [chatData, messagesData] = await Promise.all([
        apiService.getChatById(id!),
        apiService.getChatMessages(id!),
      ]);
      setChat(chatData);
      setMessages(messagesData.reverse());
      setAiMode(chatData.aiModeEnabled);
    } catch (error) {
      console.error('Failed to load chat:', error);
      Alert.alert('Error', 'Failed to load chat');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAI = async () => {
    try {
      const newAiMode = !aiMode;
      await apiService.toggleAIMode(id!, newAiMode);
      setAiMode(newAiMode);
      Alert.alert(
        'AI Mode',
        newAiMode
          ? 'AI Mode enabled. Your messages will get AI responses.'
          : 'AI Mode disabled. Regular chat mode.'
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to toggle AI mode');
    }
  };

  const handleSend = async () => {
    if (!inputText.trim() || sending) return;

    const messageText = inputText.trim();
    setInputText('');
    setSending(true);

    try {
      const newMessage = await apiService.sendMessage(id!, messageText, aiMode);
      setMessages((prev) => [...prev, newMessage]);

      // Scroll to bottom
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);

      // If AI mode is on, wait for AI response
      if (aiMode) {
        setTimeout(async () => {
          const updatedMessages = await apiService.getChatMessages(id!);
          setMessages(updatedMessages.reverse());
          setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
          }, 100);
        }, 1500);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const getOtherParticipant = () => {
    return chat?.participants.find((p) => p._id !== user?._id);
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isMyMessage = item.senderId === user?._id;

    return (
      <View
        style={[
          styles.messageContainer,
          isMyMessage ? styles.myMessageContainer : styles.otherMessageContainer,
        ]}
      >
        <View
          style={[
            styles.messageBubble,
            isMyMessage ? styles.myMessageBubble : styles.otherMessageBubble,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              isMyMessage ? styles.myMessageText : styles.otherMessageText,
            ]}
          >
            {item.content}
          </Text>
          <View style={styles.messageFooter}>
            <Text
              style={[
                styles.messageTime,
                isMyMessage ? styles.myMessageTime : styles.otherMessageTime,
              ]}
            >
              {formatMessageTime(item.createdAt)}
            </Text>
            {item.isAI && (
              <View style={styles.aiLabel}>
                <Ionicons name="sparkles" size={10} color={COLORS.aiModeActive} />
                <Text style={styles.aiLabelText}>AI</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const otherUser = getOtherParticipant();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>

          <View style={styles.headerInfo}>
            <View style={styles.headerAvatar}>
              <Text style={styles.headerAvatarText}>
                {otherUser?.name.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View>
              <Text style={styles.headerName}>{otherUser?.name}</Text>
              <Text style={styles.headerStatus}>
                {aiMode ? 'AI Mode Active' : 'Online'}
              </Text>
            </View>
          </View>

          <TouchableOpacity onPress={handleToggleAI} style={styles.aiButton}>
            <Ionicons
              name="sparkles"
              size={24}
              color={aiMode ? COLORS.aiModeActive : COLORS.textSecondary}
            />
          </TouchableOpacity>
        </View>

        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.messagesList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
        />

        {/* Input */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TouchableOpacity style={styles.attachButton}>
              <Ionicons name="add" size={24} color={COLORS.primary} />
            </TouchableOpacity>

            <View style={styles.textInputContainer}>
              <TextInput
              style={styles.textInput}
              placeholder="Type a message..."
              placeholderTextColor={COLORS.textLight}
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={1000}
              editable={!sending}
            />
            </View>

            <TouchableOpacity
              onPress={handleSend}
              style={[styles.sendButton, (!inputText.trim() || sending) && styles.sendButtonDisabled]}
              disabled={!inputText.trim() || sending}
            >
              {sending ? (
                <ActivityIndicator size="small" color={COLORS.white} />
              ) : (
                <Ionicons name="send" size={20} color={COLORS.white} />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.chatBackground,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.chatBackground,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    paddingVertical: 12,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerAvatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  headerName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  headerStatus: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  aiButton: {
    padding: 8,
  },
  messagesList: {
    paddingHorizontal: SIZES.padding,
    paddingVertical: 16,
  },
  messageContainer: {
    marginBottom: 12,
    maxWidth: '75%',
  },
  myMessageContainer: {
    alignSelf: 'flex-end',
  },
  otherMessageContainer: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  myMessageBubble: {
    backgroundColor: COLORS.messageSent,
    borderBottomRightRadius: 4,
  },
  otherMessageBubble: {
    backgroundColor: COLORS.messageReceived,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  myMessageText: {
    color: COLORS.text,
  },
  otherMessageText: {
    color: COLORS.text,
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 6,
  },
  messageTime: {
    fontSize: 11,
  },
  myMessageTime: {
    color: COLORS.textSecondary,
  },
  otherMessageTime: {
    color: COLORS.textSecondary,
  },
  aiLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  aiLabelText: {
    fontSize: 10,
    color: COLORS.aiModeActive,
    fontWeight: '600',
  },
  inputContainer: {
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingHorizontal: SIZES.padding,
    paddingVertical: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  attachButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.inputBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInputContainer: {
    flex: 1,
    backgroundColor: COLORS.inputBackground,
    borderRadius: 20,
    paddingHorizontal: 16,
    minHeight: 40,
    justifyContent: 'center',
  },
  textInput: {
    fontSize: 15,
    color: COLORS.text,
    maxHeight: 100,
    paddingVertical: 8,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: COLORS.textLight,
  },
});