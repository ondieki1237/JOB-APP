import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface Message {
  id: string;
  text: string;
  isSender: boolean;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
}

interface Employer {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
  lastSeen?: string;
}

const mockEmployer: Employer = {
  id: '1',
  name: 'City Plumbing Solutions',
  avatar: 'https://example.com/avatar.png',
  isOnline: true,
};

const mockMessages: Message[] = [
  {
    id: '1',
    text: 'Hello! I saw your job posting for the plumber position.',
    isSender: true,
    timestamp: '10:30 AM',
    status: 'read',
  },
  {
    id: '2',
    text: 'Hi! Thanks for your interest. Do you have any experience in commercial plumbing?',
    isSender: false,
    timestamp: '10:31 AM',
    status: 'read',
  },
  {
    id: '3',
    text: 'Yes, I have worked on several commercial projects. I would love to discuss more about the opportunity! 😊',
    isSender: true,
    timestamp: '10:32 AM',
    status: 'delivered',
  },
];

const emojis = ['😊', '👍', '🙏', '💪', '⭐', '🔧', '🛠️', '📅'];

export default function ChatScreen({ employerId }: { employerId: string }) {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const [showEmojis, setShowEmojis] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        text: newMessage,
        isSender: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'sent',
      };
      setMessages([...messages, message]);
      setNewMessage('');
      setShowEmojis(false);
    }
  };

  const addEmoji = (emoji: string) => {
    setNewMessage(prev => prev + emoji);
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <Animated.View
      entering={FadeInDown.springify()}
      style={[
        styles.messageContainer,
        item.isSender ? styles.sentMessage : styles.receivedMessage,
      ]}
    >
      <Text style={styles.messageText}>{item.text}</Text>
      <View style={styles.messageFooter}>
        <Text style={styles.timestamp}>{item.timestamp}</Text>
        {item.isSender && (
          <MaterialCommunityIcons
            name={item.status === 'read' ? 'check-all' : 'check'}
            size={16}
            color={item.status === 'read' ? '#34B7F1' : '#8FA0B4'}
            style={styles.messageStatus}
          />
        )}
      </View>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      {/* Chat Header */}
      <LinearGradient
        colors={['#4630EB', '#5E47F2']}
        style={styles.header}
      >
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        
        <View style={styles.headerInfo}>
          <View style={styles.avatarContainer}>
            <MaterialCommunityIcons name="domain" size={24} color="#fff" />
            {mockEmployer.isOnline && <View style={styles.onlineIndicator} />}
          </View>
          <View>
            <Text style={styles.headerTitle}>{mockEmployer.name}</Text>
            <Text style={styles.headerSubtitle}>
              {mockEmployer.isOnline ? 'Online' : `Last seen ${mockEmployer.lastSeen}`}
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.moreButton}>
          <Ionicons name="ellipsis-vertical" size={24} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
      />

      {/* Input Area */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        style={styles.inputContainer}
      >
        {showEmojis && (
          <View style={styles.emojiContainer}>
            {emojis.map(emoji => (
              <TouchableOpacity
                key={emoji}
                onPress={() => addEmoji(emoji)}
                style={styles.emojiButton}
              >
                <Text style={styles.emojiText}>{emoji}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        
        <View style={styles.inputRow}>
          <TouchableOpacity
            onPress={() => setShowEmojis(!showEmojis)}
            style={styles.emojiToggle}
          >
            <Ionicons name="happy-outline" size={24} color="#666" />
          </TouchableOpacity>
          
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            value={newMessage}
            onChangeText={setNewMessage}
            multiline
          />
          
          <TouchableOpacity
            style={styles.sendButton}
            onPress={sendMessage}
            disabled={!newMessage.trim()}
          >
            <Ionicons 
              name="send" 
              size={24} 
              color={newMessage.trim() ? '#4630EB' : '#666'} 
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F2F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 16,
  },
  backButton: {
    padding: 8,
  },
  headerInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CD964',
    borderWidth: 2,
    borderColor: '#fff',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: '#fff',
    opacity: 0.8,
    fontSize: 12,
  },
  moreButton: {
    padding: 8,
  },
  messagesList: {
    padding: 16,
  },
  messageContainer: {
    maxWidth: '80%',
    marginVertical: 4,
    padding: 12,
    borderRadius: 16,
  },
  sentMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
    borderTopRightRadius: 4,
  },
  receivedMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    borderTopLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    color: '#000',
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  timestamp: {
    fontSize: 12,
    color: '#8FA0B4',
    marginRight: 4,
  },
  messageStatus: {
    marginLeft: 2,
  },
  inputContainer: {
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    backgroundColor: '#fff',
  },
  emojiContainer: {
    flexDirection: 'row',
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    backgroundColor: '#fff',
  },
  emojiButton: {
    padding: 8,
  },
  emojiText: {
    fontSize: 24,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  emojiToggle: {
    padding: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#F0F2F5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 8,
    maxHeight: 100,
  },
  sendButton: {
    padding: 8,
  },
}); 