import { Redirect } from 'expo-router';

export default function Home() {
  // Redirect to the main app layout
  return <Redirect href="/(app)/home" />;
}