import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/components/context/AuthContext';
import { apiService } from '../../services/api';
import { Chat } from '@/types/type';
import { COLORS, SIZES } from '@/constants/theme';
import { formatTime, truncateText } from '../../utils/formatters';

export default function ChatsListScreen() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    loadChats();
  }, []);

  const loadChats = async () => {
    try {
      const data = await apiService.getChats();
      setChats(data);
    } catch (error) {
      console.error('Failed to load chats:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadChats();
    setRefreshing(false);
  };

  const getOtherParticipant = (chat: Chat) => {
    return chat.participants.find((p) => p._id !== user?._id);
  };

  const renderChatItem = ({ item }: { item: Chat }) => {
    const otherUser = getOtherParticipant(item);
    if (!otherUser) return null;

    return (
      <TouchableOpacity
        style={styles.chatItem}
        onPress={() => router.push(`/chat/${item._id}`)}
      >
        {/* Avatar */}
        <View style={styles.avatarContainer}>
          {otherUser.avatar ? (
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {otherUser.name.charAt(0).toUpperCase()}
              </Text>
            </View>
          ) : (
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {otherUser.name.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
        </View>

        {/* Chat Info */}
        <View style={styles.chatInfo}>
          <View style={styles.chatHeader}>
            <Text style={styles.chatName}>{otherUser.name}</Text>
            <Text style={styles.chatTime}>
              {item.lastMessage ? formatTime(item.lastMessage.createdAt) : ''}
            </Text>
          </View>
          <View style={styles.chatFooter}>
            <Text
              style={[
                styles.lastMessage,
                item.unreadCount > 0 && styles.unreadMessage,
              ]}
              numberOfLines={1}
            >
              {item.lastMessage
                ? truncateText(item.lastMessage.content, 40)
                : 'No messages yet'}
            </Text>
            {item.unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadCount}>{item.unreadCount}</Text>
              </View>
            )}
          </View>
          {item.aiModeEnabled && (
            <View style={styles.aiIndicator}>
              <Ionicons name="sparkles" size={12} color={COLORS.aiModeActive} />
              <Text style={styles.aiText}>AI Mode</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Drivona</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => router.push('/search')}
          >
            <Ionicons name="search" size={24} color={COLORS.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Chats List */}
      {chats.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="chatbubbles-outline" size={80} color={COLORS.textLight} />
          <Text style={styles.emptyTitle}>No chats yet</Text>
          <Text style={styles.emptySubtitle}>
            Start a conversation by searching for users
          </Text>
          <TouchableOpacity
            style={styles.startChatButton}
            onPress={() => router.push('/search')}
          >
            <Ionicons name="add" size={24} color={COLORS.white} />
            <Text style={styles.startChatText}>Start Chat</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={chats}
          renderItem={renderChatItem}
          keyExtractor={(item) => item._id}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={COLORS.primary}
            />
          }
          contentContainerStyle={styles.listContent}
        />
      )}

      {/* Floating Action Button */}
      {chats.length > 0 && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => router.push('/search')}
        >
          <Ionicons name="add" size={28} color={COLORS.white} />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.padding,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  headerButton: {
    padding: 8,
  },
  listContent: {
    flexGrow: 1,
  },
  chatItem: {
    flexDirection: 'row',
    padding: SIZES.padding,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  chatInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  chatName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  chatTime: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  chatFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    fontSize: 14,
    color: COLORS.textSecondary,
    flex: 1,
  },
  unreadMessage: {
    color: COLORS.text,
    fontWeight: '600',
  },
  unreadBadge: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    marginLeft: 8,
  },
  unreadCount: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  aiIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  aiText: {
    fontSize: 12,
    color: COLORS.aiModeActive,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  startChatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: SIZES.radius,
    gap: 8,
  },
  startChatText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});