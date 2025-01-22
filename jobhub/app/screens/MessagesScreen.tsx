import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  KeyboardAvoidingView,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  Dimensions,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

interface Message {
  _id: string;
  sender: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'image';
  imageUrl?: string;
}

export default function MessagesScreen() {
  const router = useRouter();
  const { jobId, jobTitle, companyName } = useLocalSearchParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isAttachmentOpen, setIsAttachmentOpen] = useState(false);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage: Message = {
      _id: Date.now().toString(),
      sender: 'user',
      content: inputMessage,
      timestamp: new Date(),
      type: 'text',
    };

    setMessages(prev => [newMessage, ...prev]);
    setInputMessage('');
  };

  const handleImagePick = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        allowsEditing: true,
        aspect: [4, 3],
      });

      if (!result.canceled && result.assets[0]) {
        const newMessage: Message = {
          _id: Date.now().toString(),
          sender: 'user',
          content: 'Image',
          timestamp: new Date(),
          type: 'image',
          imageUrl: result.assets[0].uri,
        };

        setMessages(prev => [newMessage, ...prev]);
        setIsAttachmentOpen(false);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.sender === 'user';

    return (
      <Animated.View 
        entering={FadeInUp.duration(300)}
        style={[styles.messageContainer, isUser ? styles.userMessage : styles.otherMessage]}
      >
        {item.type === 'text' ? (
          <Text style={[styles.messageText, isUser ? styles.userMessageText : styles.otherMessageText]}>
            {item.content}
          </Text>
        ) : (
          <Image 
            source={{ uri: item.imageUrl }} 
            style={styles.messageImage}
            resizeMode="cover"
          />
        )}
        <Text style={[styles.timestamp, isUser ? styles.userTimestamp : styles.otherTimestamp]}>
          {new Date(item.timestamp).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
          })}
        </Text>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={['#4630EB', '#5E47F2']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity 
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.companyName}>{companyName}</Text>
            <Text style={styles.jobTitle} numberOfLines={1}>{jobTitle}</Text>
          </View>
        </View>
      </LinearGradient>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardAvoid}
      >
        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={item => item._id}
          inverted
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
        />

        <View style={styles.inputContainer}>
          <TouchableOpacity 
            style={styles.attachButton}
            onPress={() => setIsAttachmentOpen(!isAttachmentOpen)}
          >
            <Ionicons 
              name={isAttachmentOpen ? "close" : "add"} 
              size={24} 
              color="#4630EB" 
            />
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            value={inputMessage}
            onChangeText={setInputMessage}
            placeholder="Type a message..."
            multiline
            maxLength={1000}
          />

          <TouchableOpacity 
            onPress={handleSendMessage}
            style={styles.sendButton}
            disabled={!inputMessage.trim()}
          >
            <Ionicons 
              name="send" 
              size={24} 
              color={inputMessage.trim() ? '#4630EB' : '#999'} 
            />
          </TouchableOpacity>
        </View>

        {isAttachmentOpen && (
          <Animated.View 
            entering={FadeInDown}
            style={styles.attachmentMenu}
          >
            <TouchableOpacity 
              style={styles.attachmentOption}
              onPress={handleImagePick}
            >
              <View style={styles.attachmentIcon}>
                <Ionicons name="image" size={24} color="#fff" />
              </View>
              <Text style={styles.attachmentText}>Image</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 0 : 30,
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 12,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTextContainer: {
    flex: 1,
  },
  companyName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  jobTitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
  },
  keyboardAvoid: {
    flex: 1,
  },
  messagesList: {
    padding: 16,
  },
  messageContainer: {
    maxWidth: width * 0.75,
    marginBottom: 16,
    borderRadius: 20,
    padding: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#4630EB',
    borderBottomRightRadius: 4,
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  messageImage: {
    width: width * 0.6,
    height: width * 0.6 * 0.75,
    borderRadius: 12,
  },
  userMessageText: {
    color: '#fff',
  },
  otherMessageText: {
    color: '#000',
  },
  timestamp: {
    fontSize: 11,
    marginTop: 4,
  },
  userTimestamp: {
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'right',
  },
  otherTimestamp: {
    color: '#666',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    padding: 8,
  },
  attachButton: {
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
  },
  input: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 100,
    fontSize: 16,
  },
  sendButton: {
    padding: 8,
  },
  attachmentMenu: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  attachmentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  attachmentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4630EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  attachmentText: {
    fontSize: 16,
    color: '#000',
  },
}); 