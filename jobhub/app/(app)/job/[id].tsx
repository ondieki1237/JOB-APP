import { useLocalSearchParams } from 'expo-router';
import JobViewScreen from '../../screens/JobViewScreen';

export default function JobView() {
  const { id } = useLocalSearchParams();
  return <JobViewScreen jobId={id as string} />;
} 