import { Stack } from 'expo-router';
import { BookmarkProvider } from './context/BookmarkContext';
import { SearchProvider } from './context/SearchContext';

export default function RootLayout() {
  return (
    <SearchProvider>
      <BookmarkProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(app)" />
        </Stack>
      </BookmarkProvider>
    </SearchProvider>
  );
}
