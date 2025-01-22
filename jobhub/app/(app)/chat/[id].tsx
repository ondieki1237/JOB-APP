import { useLocalSearchParams } from 'expo-router';
import ChatScreen from '../../screens/ChatScreen';

export default function Chat() {
  const { id } = useLocalSearchParams();
  return <ChatScreen employerId={id as string} />;
} 