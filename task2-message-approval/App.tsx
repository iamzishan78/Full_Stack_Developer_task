import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MessageCard } from './components/MessageCard';
import { fetchMessages } from './services/api';
import { Message } from './types';

export default function App() {
  const [pendingMessages, setPendingMessages] = useState<Message[]>([]);
  const [handledMessages, setHandledMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [handledExpanded, setHandledExpanded] = useState(true);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const messages = await fetchMessages();
      setPendingMessages(messages);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = (id: string) => {
    const message = pendingMessages.find((m) => m.id === id);
    if (message) {
      setPendingMessages((prev) => prev.filter((m) => m.id !== id));
      setHandledMessages((prev) => [...prev, message]);
    }
  };

  const handleReject = (id: string) => {
    setPendingMessages((prev) => prev.filter((m) => m.id !== id));
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#5B6EE1" />
          <Text style={styles.loadingText}>Loading messages...</Text>
        </View>
        <StatusBar style="dark" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Message Approvals</Text>
        <Text style={styles.headerSubtitle}>
          Review AI-summarized messages
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Pending Messages Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Pending</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{pendingMessages.length}</Text>
            </View>
          </View>

          {pendingMessages.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                No pending messages. All caught up!
              </Text>
            </View>
          ) : (
            pendingMessages.map((message) => (
              <MessageCard
                key={message.id}
                message={message}
                onApprove={handleApprove}
                onReject={handleReject}
                showActions={true}
              />
            ))
          )}
        </View>

        {/* Handled Messages Section */}
        {handledMessages.length > 0 && (
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.sectionHeader}
              onPress={() => setHandledExpanded(!handledExpanded)}
              activeOpacity={0.7}
            >
              <View style={styles.sectionHeaderLeft}>
                <Text style={styles.sectionTitle}>Handled</Text>
                <View style={[styles.badge, styles.handledBadge]}>
                  <Text style={[styles.badgeText, styles.handledBadgeText]}>
                    {handledMessages.length}
                  </Text>
                </View>
              </View>
              <Text style={styles.expandIcon}>
                {handledExpanded ? '▼' : '▶'}
              </Text>
            </TouchableOpacity>

            {handledExpanded &&
              handledMessages.map((message) => (
                <MessageCard
                  key={message.id}
                  message={message}
                  showActions={false}
                />
              ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666666',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: '#F5F7FA',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  section: {
    marginTop: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  badge: {
    backgroundColor: '#EF4444',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginLeft: 8,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  handledBadge: {
    backgroundColor: '#22C55E',
  },
  handledBadgeText: {
    color: '#FFFFFF',
  },
  expandIcon: {
    fontSize: 12,
    color: '#666666',
  },
  emptyState: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 15,
    color: '#666666',
  },
});
