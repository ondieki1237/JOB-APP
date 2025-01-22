import { Stack } from 'expo-router';

export default function AppLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="home" />
      <Stack.Screen name="job-list" />
      <Stack.Screen name="job/[id]" />
      <Stack.Screen name="post-job" />
      <Stack.Screen name="chat/[id]" />
      <Stack.Screen name="active-jobs" />
    </Stack>
  );
} 